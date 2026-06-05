"use client";
import { Candidate } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const recommendationColor: Record<Candidate["recommendation"], { badge: "success" | "warning" | "destructive"; label: string }> = {
  strong_fit: { badge: "success", label: "Strong Fit" },
  possible_fit: { badge: "warning", label: "Possible Fit" },
  not_fit: { badge: "destructive", label: "Not a Fit" },
};

function ScoreDisplay({ score }: { score: number }) {
  const color = score >= 70 ? "var(--color-primary)" : score >= 45 ? "var(--color-warning)" : "var(--color-destructive)";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r="24" fill="none" stroke="color-mix(in oklch, var(--color-foreground), transparent 90%)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="24"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 - (score / 100) * 2 * Math.PI * 24}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold" style={{ color }}>{score}</span>
      </div>
      <span className="text-[0.6rem] text-muted-foreground">/ 100</span>
    </div>
  );
}

interface CompareViewProps {
  candidates: Candidate[];
  onClose: () => void;
}

export default function CompareView({ candidates, onClose }: CompareViewProps) {
  const allMatchedSkills = [...new Set(candidates.flatMap((c) => c.matchedSkills))].sort();
  const allMissingSkills = [...new Set(candidates.flatMap((c) => c.missingSkills))].sort();

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold tracking-tight">
              Comparing {candidates.length} Candidates
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Side-by-side skills breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className={`grid gap-4 ${candidates.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {candidates.map((c) => {
              const rec = recommendationColor[c.recommendation];
              return (
                <div key={c.id} className="bg-card border border-border rounded-xl p-5 flex flex-col">
                  <div className="flex flex-col items-center mb-4 pb-4 border-b border-border">
                    <ScoreDisplay score={c.score} />
                    <h3 className="text-sm font-semibold text-foreground mt-2 text-center">{c.name}</h3>
                    <Badge variant={rec.badge} className="mt-1.5">{rec.label}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                    {c.summary}
                  </p>

                  {c.matchedSkills.length > 0 && (
                    <div className="mb-3">
                      <p className="micro-label mb-2">Matched Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {c.matchedSkills.map((s) => (
                          <span key={s} className="bg-success/10 text-success border border-success/20 rounded-md px-1.5 py-0.5 text-[0.65rem] inline-flex items-center gap-0.5">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.missingSkills.length > 0 && (
                    <div>
                      <p className="micro-label mb-2">Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {c.missingSkills.map((s) => (
                          <span key={s} className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-1.5 py-0.5 text-[0.65rem] inline-flex items-center gap-0.5">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allMatchedSkills.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border">
              <p className="micro-label mb-3">All Matched Skills Across Candidates</p>
              <div className="flex flex-wrap gap-1.5">
                {allMatchedSkills.map((skill) => {
                  const count = candidates.filter((c) => c.matchedSkills.includes(skill)).length;
                  const allHave = count === candidates.length;
                  return (
                    <span
                      key={skill}
                      className={`rounded-md px-2 py-0.5 text-xs border ${
                        allHave
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }`}
                    >
                      {skill}
                      <span className="ml-1 opacity-70">({count}/{candidates.length})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {allMissingSkills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="micro-label mb-3">All Missing Skills Across Candidates</p>
              <div className="flex flex-wrap gap-1.5">
                {allMissingSkills.map((skill) => {
                  const count = candidates.filter((c) => c.missingSkills.includes(skill)).length;
                  return (
                    <span
                      key={skill}
                      className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-2 py-0.5 text-xs"
                    >
                      {skill}
                      <span className="ml-1 opacity-70">({count}/{candidates.length})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
