"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile } from "./types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  plan: "free" | "pro";
  quotaUsed: number;
  quotaLimit: number;
  refreshUserData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  plan: "free",
  quotaUsed: 0,
  quotaLimit: 20,
  refreshUserData: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile({
          uid,
          email,
          fullName: data.fullName,
          organizationName: data.organizationName,
          organizationSize: data.organizationSize,
          plan: data.plan || "free",
          screensUsed: data.screensUsed || 0,
          screensLimit: (data.plan || "free") === "free" ? 20 : (data.screensLimit || 999999),
          createdAt: data.createdAt,
        });
      } else {
        // Create initial profile
        const newProfile: UserProfile = {
          uid,
          email,
          plan: "free",
          screensUsed: 0,
          screensLimit: 20,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const refreshUserData = async () => {
    if (user) await fetchProfile(user.uid, user.email || "");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email || "");
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        plan: profile?.plan || "free",
        quotaUsed: profile?.screensUsed || 0,
        quotaLimit: profile?.screensLimit || 20,
        refreshUserData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
