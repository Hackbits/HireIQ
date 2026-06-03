"use client";
// app/dashboard/page.tsx - Main Dashboard view with Firebase
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  getCountFromServer
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const UploadForm = dynamic(() => import('@/components/UploadForm'), { 
  ssr: false, 
  loading: () => <div className="loader mx-auto" /> 
});
import PlanGate from "@/components/PlanGate";
import { Job } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("createdBy", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(jobsQuery);
        
        const jobsList: Job[] = [];
        
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          
          // Get candidate count for this job
          const candidatesQuery = query(
            collection(db, "candidates"),
            where("jobId", "==", docSnap.id)
          );
          const countSnapshot = await getCountFromServer(candidatesQuery);
          
          jobsList.push({
            id: docSnap.id,
            title: data.title,
            description: data.description,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            candidateCount: countSnapshot.data().count,
          });
        }
        
        setJobs(jobsList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading || (!user && !loading)) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center p-8">
           <div className="loader" style={{ width: 40, height: 40 }} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        <div className="page-header mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Manage your jobs and AI candidate screenings.
            </p>
          </div>
          <button 
            className={showNewJob ? "btn-secondary" : "btn-primary"} 
            onClick={() => setShowNewJob(!showNewJob)}
          >
            {showNewJob ? "Cancel" : "New Job"}
          </button>
        </div>

        {showNewJob ? (
          <PlanGate>
            <div className="max-w-2xl">
              <UploadForm onSuccess={(jobId) => router.push(`/dashboard/${jobId}`)} />
            </div>
          </PlanGate>
        ) : dataLoading ? (
           <div className="card text-center py-10" style={{ border: "1px solid rgba(72,71,77,0.15)" }}>
            <div className="loader mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-16" style={{ border: "1px solid rgba(72,71,77,0.15)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4" style={{ color: "var(--primary)" }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="text-lg font-semibold mb-2">No jobs created yet</p>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }} className="mb-6">
              Create your first job to start screening candidates with AI.
            </p>
            <button className="btn-primary" onClick={() => setShowNewJob(true)}>
              Create First Job
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => router.push(`/dashboard/${job.id}`)}
                className="card hover:border-[rgba(189,157,255,0.4)] transition-colors cursor-pointer group"
                style={{ border: "1px solid rgba(72,71,77,0.3)" }}
              >
                <h3 className="font-semibold text-lg truncate mb-1 group-hover:text-white transition-colors" style={{ color: "var(--on-surface)" }}>
                  {job.title}
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--on-surface-variant)" }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: "rgba(189,157,255,0.1)", color: "var(--primary)" }}>
                    {job.candidateCount} Candidates
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--on-surface-variant)" }} className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
