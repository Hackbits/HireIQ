"use client";
import { Candidate } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toDate } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--color-primary)" : score >= 45 ? "var(--color-warning)" : "var(--color-destructive)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="color-mix(in oklch, var(--color-foreground), transparent 90%)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none" style={{ color }}>{score}</span>
        <span className="text-[0.6rem] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

const recommendationBadgeVariant: Record<Candidate["recommendation"], "success" | "warning" | "destructive"> = {
  strong_fit: "success",
  possible_fit: "warning",
  not_fit: "destructive",
};

const recommendationLabels: Record<Candidate["recommendation"], string> = {
  strong_fit: "Strong Fit",
  possible_fit: "Possible Fit",
  not_fit: "Not a Fit",
};

export default function CandidateCard({ candidate, selected, onToggle }: CandidateCardProps) {
  const isStrong = candidate.recommendation === "strong_fit";

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {onToggle && (
              <button
                onClick={() => onToggle(candidate.id)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
                  selected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary/50 text-transparent"
                }`}
                aria-label={selected ? "Deselect candidate" : "Select candidate for comparison"}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            )}
          </div>
          <div className="flex-shrink-0">
            <ScoreRing score={candidate.score} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h3 className="text-sm font-semibold">
                {candidate.name}
              </h3>
              <Badge variant={recommendationBadgeVariant[candidate.recommendation]}>
                {recommendationLabels[candidate.recommendation]}
              </Badge>
            </div>

            <p className="text-sm mb-3 leading-relaxed text-muted-foreground">
              {candidate.summary}
            </p>

            <div className="space-y-2">
              {candidate.matchedSkills.length > 0 && (
                <div>
                  <span className="micro-label mr-2">Matched</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {candidate.matchedSkills.slice(0, 8).map((skill) => (
                      <span key={skill} className="bg-success/10 text-success border border-success/20 rounded-md px-2 py-0.5 text-xs inline-flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {candidate.missingSkills.length > 0 && (
                <div>
                  <span className="micro-label mr-2">Missing</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {candidate.missingSkills.slice(0, 6).map((skill) => (
                      <span key={skill} className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-2 py-0.5 text-xs inline-flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-[0.72rem] text-muted-foreground">
            Processed {toDate(candidate.processedAt).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
