"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, ExternalLink, ArrowRight, RotateCcw } from "lucide-react";
import { SessionPayload } from "@/types/workout";

interface SuccessModalProps {
  isOpen: boolean;
  filePath: string;
  commitUrl?: string | null;
  payload: SessionPayload;
  onClose: () => void;
  onResetSession: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  filePath,
  commitUrl,
  payload,
  onClose,
  onResetSession,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#0071e3", "#30d158", "#ffffff"],
        });
      } catch {
        // Fallback gracefully if canvas is unavailable
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalExercises = payload.exercises.length;
  const totalSets = payload.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] border border-white/[0.08] bg-[#161618] p-6 text-center shadow-2xl">
        {/* iOS Success Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/20">
          <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[22px] font-semibold tracking-tight text-[#f5f5f7]">
          Workout Saved
        </h2>
        <p className="mt-1 text-[13px] text-[#86868b]">
          Committed {totalExercises} exercises ({totalSets} sets) directly to GitHub.
        </p>

        {/* File Path Card */}
        <div className="mt-4 rounded-[12px] bg-[#242426] border border-white/[0.06] p-3 text-left">
          <div className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider mb-1">
            Committed JSON File
          </div>
          <code className="text-[12px] font-mono text-[#a1a1a6] break-all">
            {filePath}
          </code>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2">
          {commitUrl && (
            <a
              href={commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press inline-flex items-center justify-center gap-1.5 rounded-full bg-[#242426] border border-white/[0.08] py-2.5 text-[13px] font-medium text-[#f5f5f7] hover:bg-[#2c2c2e] transition-colors"
            >
              <span>View Commit on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#86868b]" />
            </a>
          )}

          <Link
            href="/"
            onClick={onClose}
            className="apple-press inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0071e3] py-2.5 text-[14px] font-semibold text-white hover:bg-[#0077ed] transition-colors"
          >
            <span>Return to Workouts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
