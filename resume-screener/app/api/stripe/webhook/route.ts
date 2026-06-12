import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your environment variables." },
      { status: 500 }
    );
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-03-25.dahlia",
  });

  let event: import("stripe").Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session;
    const firebaseUid = session.metadata?.firebaseUid;

    if (!firebaseUid) {
      console.error("No UID in Stripe session metadata");
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    try {
      const db = adminDb();
      // Upgrade user to Pro plan in Firestore
      await db.collection("users").doc(firebaseUid).update({
        plan: "pro",
        screensLimit: 999999, // Essentially unlimited
      });
      
      console.log(`User ${firebaseUid} upgraded to Pro in Firestore`);
    } catch (err) {
      console.error("Failed to update user plan in Firestore:", err);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
