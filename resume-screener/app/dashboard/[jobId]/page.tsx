"use client";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import CandidateCard from "@/components/CandidateCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, SkeletonMetricCard, SkeletonCandidateCard } from "@/components/ui/skeleton";
import { Candidate, Job, RecommendationFilter } from "@/lib/types";

const RECOMMENDATION_LABELS: Record<RecommendationFilter, string> = {
  all: "All",
  strong_fit: "Strong Fit",
  possible_fit: "Possible Fit",
  not_fit: "Not a Fit",
};

function exportToCSV(candidates: Candidate[], jobTitle: string) {
  const headers = ["Name", "Score", "Recommendation", "Matched Skills", "Missing Skills", "Summary"];
  const rows = candidates.map((c) => [
    c.name,
    c.score,
    c.recommendation,
    c.matchedSkills.join("; "),
    c.missingSkills.join("; "),
    `"${c.summary.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${jobTitle.replace(/\s+/g, "_")}_candidates.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function JobResultsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState<RecommendationFilter>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !jobId) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists() || jobSnap.data().createdBy !== user.uid) {
          router.push("/dashboard");
          return;
        }

        const jobData = jobSnap.data();
        setJob({
          id: jobSnap.id,
          title: jobData.title,
          description: jobData.description,
          createdBy: jobData.createdBy,
          createdAt: jobData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });

        const candidatesQuery = query(
          collection(db, "candidates"),
          where("jobId", "==", jobId),
          orderBy("score", "desc")
        );
        const candidatesSnap = await getDocs(candidatesQuery);

        const cList: Candidate[] = candidatesSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            jobId: data.jobId,
            name: data.name,
            score: data.score,
            matchedSkills: data.matchedSkills || [],
            missingSkills: data.missingSkills || [],
            summary: data.summary,
            recommendation: data.recommendation,
            processedAt: data.processedAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };
        });

        setCandidates(cList);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, jobId, router]);

  const filtered = useMemo(() => {
    if (filter === "all") return candidates;
    return candidates.filter((c) => c.recommendation === filter);
  }, [candidates, filter]);

  const stats = useMemo(() => ({
    strong: candidates.filter((c) => c.recommendation === "strong_fit").length,
    possible: candidates.filter((c) => c.recommendation === "possible_fit").length,
    notFit: candidates.filter((c) => c.recommendation === "not_fit").length,
    avgScore: candidates.length
      ? Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length)
      : 0,
  }), [candidates]);

  if (loading || dataLoading) {
    return (
      <div className="animate-fade-up">
        <div className="mb-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Skeleton className="h-7 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => <SkeletonMetricCard key={i} />)}
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-24 rounded-md" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCandidateCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm mb-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Jobs
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} screened
              {job.createdAt && ` · ${new Date(job.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
            </p>
          </div>

          {candidates.length > 0 && (
            <Button
              id="export-csv-btn"
              variant="outline"
              onClick={() => exportToCSV(candidates, job.title)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {candidates.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="micro-label mb-1">Strong Fit</p>
              <p className="text-2xl font-bold">{stats.strong}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="micro-label mb-1">Possible Fit</p>
              <p className="text-2xl font-bold">{stats.possible}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="micro-label mb-1">Not a Fit</p>
              <p className="text-2xl font-bold">{stats.notFit}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="micro-label mb-1">Avg Score</p>
              <p className="text-2xl font-bold">{stats.avgScore}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {candidates.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(RECOMMENDATION_LABELS) as RecommendationFilter[]).map((key) => (
            <Button
              key={key}
              id={`filter-${key}`}
              variant={filter === key ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {RECOMMENDATION_LABELS[key]}
              {key !== "all" && (
                <span className="ml-1 text-xs opacity-70">
                  ({key === "strong_fit" ? stats.strong : key === "possible_fit" ? stats.possible : stats.notFit})
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {candidates.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-lg font-bold mb-2">No candidates yet</p>
            <p className="text-muted-foreground text-sm">
              Go back and upload resumes to start screening.
            </p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No candidates match this filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
