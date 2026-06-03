"use client";
// components/CandidateCard.tsx - Individual candidate result card
import { Candidate } from "@/lib/types";

interface CandidateCardProps {
  candidate: Candidate;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#4ade80" : score >= 45 ? "#facc15" : "#f87171";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
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
        <span className="text-base font-bold" style={{ color, fontFamily: "var(--font-manrope)", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)" }}>/ 100</span>
      </div>
    </div>
  );
}

function RecommendationBadge({ rec }: { rec: Candidate["recommendation"] }) {
  const map = {
    strong_fit: { label: "Strong Fit", className: "badge-strong" },
    possible_fit: { label: "Possible Fit", className: "badge-possible" },
    not_fit: { label: "Not a Fit", className: "badge-not-fit" },
  };
  const { label, className } = map[rec];
  return <span className={className}>{label}</span>;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const isStrong = candidate.recommendation === "strong_fit";

  return (
    <div
      className={`card fade-in ${isStrong ? "glow-strong" : ""}`}
      style={{
        background: "var(--surface-container)",
        border: isStrong ? "1px solid rgba(189,157,255,0.2)" : "1px solid rgba(72,71,77,0.15)",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Score ring */}
        <div className="flex-shrink-0">
          <ScoreRing score={candidate.score} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
              {candidate.name}
            </h3>
            <RecommendationBadge rec={candidate.recommendation} />
          </div>

          <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
            {candidate.summary}
          </p>

          {/* Skills */}
          <div className="space-y-2">
            {candidate.matchedSkills.length > 0 && (
              <div>
                <span className="form-label inline" style={{ marginBottom: 0, marginRight: "0.5rem" }}>Matched</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {candidate.matchedSkills.slice(0, 8).map((skill) => (
                    <span key={skill} className="chip-matched">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {candidate.missingSkills.length > 0 && (
              <div>
                <span className="form-label inline" style={{ marginBottom: 0, marginRight: "0.5rem" }}>Missing</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {candidate.missingSkills.slice(0, 6).map((skill) => (
                    <span key={skill} className="chip-missing">
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

      {/* Processed timestamp */}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(72,71,77,0.1)" }}>
        <span style={{ color: "var(--on-surface-variant)", fontSize: "0.72rem" }}>
          Processed {new Date(candidate.processedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
