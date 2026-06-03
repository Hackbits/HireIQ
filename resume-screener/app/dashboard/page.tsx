"use client";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loader" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your jobs and AI candidate screenings.
          </p>
        </div>
        <Button variant={showNewJob ? "outline" : "primary"} onClick={() => setShowNewJob(!showNewJob)}>
          {showNewJob ? "Cancel" : "New Job"}
        </Button>
      </div>

      {showNewJob ? (
        <PlanGate>
          <div className="max-w-2xl">
            <UploadForm onSuccess={(jobId) => router.push(`/dashboard/${jobId}`)} />
          </div>
        </PlanGate>
      ) : dataLoading ? (
        <Card>
          <CardContent className="py-10 flex justify-center">
            <div className="loader mx-auto" />
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl text-center py-16 px-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 className="text-xl font-bold tracking-tight mb-2">No jobs created yet</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first job to start screening candidates with AI.
          </p>
          <Button variant="primary" onClick={() => setShowNewJob(true)}>
            Create First Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/dashboard/${job.id}`)}
              className="bg-card border border-border rounded-xl cursor-pointer p-6"
            >
              <h3 className="text-lg font-bold tracking-tight truncate mb-1">
                {job.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-0.5">
                  {job.candidateCount} Candidates
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
