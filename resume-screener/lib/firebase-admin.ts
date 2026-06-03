import * as admin from "firebase-admin";

// Use a lazy initialization pattern for Firebase Admin to avoid 
// build-time environment variable errors in Next.js
export const getAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  // Handle the private key newline issues commonly found in environment variables
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (!process.env.FIREBASE_CLIENT_EMAIL || !privateKey || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase Admin credentials missing, using mock/incomplete config.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
};

export const adminDb = () => getAdminApp()!.firestore();
export const adminAuth = () => getAdminApp()!.auth();
