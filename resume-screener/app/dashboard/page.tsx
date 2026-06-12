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
  loading: () => (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-9 w-full rounded-md" />
      </div>
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-[120px] w-full rounded-md" />
      </div>
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="skeleton h-32 w-full rounded-xl" />
      </div>
    </div>
  )
});
import PlanGate from "@/components/PlanGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import OnboardingTour, { completeOnboarding } from "@/components/OnboardingTour";
import { Job } from "@/lib/types";
import { toDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!dataLoading && jobs.length === 0 && !loading && user) {
      const done = localStorage.getItem("hireiq_onboarding_done") === "true";
      setShowOnboarding(!done);
    }
  }, [dataLoading, jobs.length, loading, user]);

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
      <div className="animate-fade-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-7 w-40 mb-2" />
            <div className="skeleton h-4 w-64" />
          </div>
          <div className="skeleton h-9 w-24 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
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
        <Button id="onboarding-new-job-btn" variant={showNewJob ? "outline" : "primary"} onClick={() => setShowNewJob(!showNewJob)}>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl text-center py-16 px-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 className="text-xl font-bold tracking-tight mb-2">No jobs created yet</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first job to start screening candidates with AI.
          </p>
          <Button id="onboarding-new-job-btn" variant="primary" onClick={() => setShowNewJob(true)}>
            Create First Job
          </Button>
        </div>
      ) : (
        <>
          {showOnboarding && (
            <OnboardingTour
              steps={[
                {
                  title: "Welcome to HireIQ",
                  description: "Let's walk through your first screening. In a few minutes you'll create a job, upload resumes, and see AI-powered candidate scores.",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                },
                {
                  title: "Create a New Job",
                  description: "Click the 'New Job' button to start. You'll enter a job title and paste the job description so our AI knows exactly what to look for.",
                  highlightId: "onboarding-new-job-btn",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
                },
                {
                  title: "Enter Job Details",
                  description: "Fill in the job title and paste a detailed description. The more context you give, the better our AI scores each candidate against your requirements.",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
                },
                {
                  title: "Upload Resumes",
                  description: "Drag and drop PDF resumes or click to browse. You can upload multiple at once — our system processes them in parallel to save you time.",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
                },
                {
                  title: "Screen Candidates",
                  description: "Click 'Screen Candidates' to start AI analysis. Each resume gets a 0–100 match score, skill gap breakdown, and an executive summary.",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"></path></svg>,
                },
                {
                  title: "Review Results",
                  description: "Your results page shows every candidate ranked by score. Use filters, export to CSV, and dive into each candidate's matched and missing skills.",
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
                },
              ]}
              onClose={() => {
                setShowOnboarding(false);
                completeOnboarding();
              }}
            />
          )}
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
                {toDate(job.createdAt).toLocaleDateString()}
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
        </>
      )}
    </div>
  );
}
