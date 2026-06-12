import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not configured." },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const crypto = await import("crypto");
  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSig) {
    console.error("Razorpay webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload: { subscription?: { entity?: { notes?: Record<string, string> } }; payment?: { entity?: { notes?: Record<string, string> } } } };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const handleUpgrade = async (firebaseUid: string) => {
    try {
      const db = adminDb();
      await db.collection("users").doc(firebaseUid).update({
        plan: "pro",
        screensLimit: 999999,
      });
      console.log(`User ${firebaseUid} upgraded to Pro via Razorpay`);
    } catch (err) {
      console.error("Failed to update user plan in Firestore:", err);
    }
  };

  if (event.event === "subscription.charged") {
    const firebaseUid = event.payload.subscription?.entity?.notes?.firebaseUid;
    if (firebaseUid) {
      await handleUpgrade(firebaseUid);
    }
  }

  if (event.event === "payment.captured") {
    const firebaseUid = event.payload.payment?.entity?.notes?.firebaseUid;
    if (firebaseUid) {
      await handleUpgrade(firebaseUid);
    }
  }

  return NextResponse.json({ received: true });
}
