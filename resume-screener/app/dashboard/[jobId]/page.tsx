"use client";
// app/dashboard/[jobId]/page.tsx - Candidate results view with Firebase
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CandidateCard from "@/components/CandidateCard";
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
        // Fetch job
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

        // Fetch candidates sorted by score descending
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
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="loader" style={{ width: 40, height: 40 }} />
        </main>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Back + Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm mb-4 transition-colors hover:text-white"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Jobs
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="page-title">{job.title}</h1>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} screened
                {job.createdAt && ` · ${new Date(job.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
              </p>
            </div>

            {candidates.length > 0 && (
              <button
                id="export-csv-btn"
                onClick={() => exportToCSV(candidates, job.title)}
                className="btn-secondary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        {candidates.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="card" style={{ border: "1px solid rgba(74,222,128,0.15)" }}>
              <p className="form-label mb-1">Strong Fit</p>
              <p className="text-2xl font-bold score-high" style={{ fontFamily: "var(--font-manrope)" }}>{stats.strong}</p>
            </div>
            <div className="card" style={{ border: "1px solid rgba(250,204,21,0.15)" }}>
              <p className="form-label mb-1">Possible Fit</p>
              <p className="text-2xl font-bold score-mid" style={{ fontFamily: "var(--font-manrope)" }}>{stats.possible}</p>
            </div>
            <div className="card" style={{ border: "1px solid rgba(248,113,113,0.15)" }}>
              <p className="form-label mb-1">Not a Fit</p>
              <p className="text-2xl font-bold score-low" style={{ fontFamily: "var(--font-manrope)" }}>{stats.notFit}</p>
            </div>
            <div className="card" style={{ border: "1px solid rgba(72,71,77,0.15)" }}>
              <p className="form-label mb-1">Avg Score</p>
              <p className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-manrope)" }}>{stats.avgScore}</p>
            </div>
          </div>
        )}

        {/* Filter buttons */}
        {candidates.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(RECOMMENDATION_LABELS) as RecommendationFilter[]).map((key) => (
              <button
                key={key}
                id={`filter-${key}`}
                onClick={() => setFilter(key)}
                className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
                style={{
                  background: filter === key ? "var(--gradient-primary)" : "var(--surface-container-high)",
                  color: filter === key ? "#000" : "var(--on-surface-variant)",
                  border: filter === key ? "none" : "1px solid rgba(72,71,77,0.3)",
                }}
              >
                {RECOMMENDATION_LABELS[key]}
                {key !== "all" && (
                  <span className="ml-1.5 text-xs">
                    ({key === "strong_fit" ? stats.strong : key === "possible_fit" ? stats.possible : stats.notFit})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Candidates list */}
        {candidates.length === 0 ? (
          <div className="card text-center py-16" style={{ border: "1px solid rgba(72,71,77,0.15)" }}>
            <p className="text-lg font-semibold mb-2">No candidates yet</p>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
              Go back and upload resumes to start screening.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-10" style={{ border: "1px solid rgba(72,71,77,0.15)" }}>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
              No candidates match this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
