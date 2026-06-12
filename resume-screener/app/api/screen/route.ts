// app/api/screen/route.ts - Screen resume with Gemini and save to Firestore
import { NextRequest, NextResponse } from "next/server";
import { screenResume } from "@/lib/gemini";
import { adminDb } from "@/lib/firebase-admin";
import { checkRateLimit } from "@/lib/rate-limit";
import * as admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription, jobId, candidateName, firebaseUid, resumeUrl } = await req.json();

    if (!resumeText || !jobDescription || !jobId || !firebaseUid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rateLimit = checkRateLimit(`screen:${firebaseUid}`, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before screening again.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const db = adminDb();

    // 1. Check user quota
    const userRef = db.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const limit = userData?.plan === "pro" ? (userData?.screensLimit || 999999) : 20;
    if (userData?.plan === "free" && (userData?.screensUsed || 0) >= limit) {
      return NextResponse.json({ error: "Quota exceeded" }, { status: 403 });
    }

    // 2. Call Gemini
    const result = await screenResume(jobDescription, resumeText);

    // 3. Save candidate result as Firestore document
    await db.collection("candidates").add({
      jobId,
      name: candidateName,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      summary: result.summary,
      recommendation: result.recommendation,
      resumeUrl: resumeUrl || null,
      createdBy: firebaseUid,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Increment usage
    await userRef.update({
      screensUsed: admin.firestore.FieldValue.increment(1),
    });

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Screening error:", error);
    const message = error instanceof Error ? error.message : "Failed to screen resume";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
