"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "hireiq_onboarding_done";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlightId?: string;
}

export function useOnboarding() {
  const [show, setShow] = useState(false);

  const start = useCallback(() => setShow(true), []);
  const dismiss = useCallback(() => {
    setShow(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem(ONBOARDING_KEY) === "true";
      if (!done) setShow(true);
    }
  }, []);

  return { show, start, dismiss };
}

export function completeOnboarding() {
  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_KEY, "true");
  }
}

interface OnboardingTourProps {
  steps: Step[];
  onClose: () => void;
  onStep?: (step: number) => void;
}

export default function OnboardingTour({ steps, onClose, onStep }: OnboardingTourProps) {
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const isLast = current === total - 1;

  useEffect(() => {
    onStep?.(current);
  }, [current, onStep]);

  useEffect(() => {
    const highlightId = steps[current]?.highlightId;
    if (highlightId) {
      const el = document.getElementById(highlightId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-ring", "ring-offset-2", "rounded-md", "transition-all", "duration-300");
        const timeout = setTimeout(() => {
          el.classList.remove("ring-2", "ring-ring", "ring-offset-2");
        }, 2000);
        return () => {
          clearTimeout(timeout);
          el.classList.remove("ring-2", "ring-ring", "ring-offset-2");
        };
      }
    }
  }, [current, steps]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (isLast) onClose();
        else setCurrent((c) => Math.min(c + 1, total - 1));
      }
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, isLast, total]);

  const step = steps[current];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-up">
        <div className="p-8 pb-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-1.5">
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {step.highlightId && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted border border-border text-xs text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>Look for the highlighted element on the page</span>
            </div>
          )}
        </div>

        <div className="px-8 pb-6">
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-primary"
                    : i < current
                      ? "w-1.5 bg-primary/40"
                      : "w-1.5 bg-border"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Skip tour
            </button>

            <div className="flex items-center gap-2">
              {current > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrent((c) => c - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (isLast) onClose();
                  else setCurrent((c) => c + 1);
                }}
              >
                {isLast ? "Done" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
