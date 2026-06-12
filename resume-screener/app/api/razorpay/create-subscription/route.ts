import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keySecret || !keyId) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables." },
        { status: 500 }
      );
    }

    const { firebaseUid, email } = (await req.json()) as {
      firebaseUid: string;
      email: string;
    };

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firebaseUid, email" },
        { status: 400 }
      );
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "HireIQ Pro",
        amount: 99900,
        currency: "INR",
        description: "Unlimited AI resume screening, priority processing, CSV export",
      },
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12,
      notes: {
        firebaseUid,
      },
    });

    return NextResponse.json({ url: subscription.short_url });
  } catch (error) {
    console.error("Razorpay subscription error:", error);
    const message = error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
