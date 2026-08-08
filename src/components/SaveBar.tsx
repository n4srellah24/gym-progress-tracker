"use client";

import React from "react";
import { Loader2, ArrowUpCircle } from "lucide-react";

interface SaveBarProps {
  totalFilledSets: number;
  totalPlannedSets: number;
  totalFilledExercises: number;
  isSaving: boolean;
  onSave: () => void;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  totalFilledSets,
  totalPlannedSets,
  totalFilledExercises,
  isSaving,
  onSave,
}) => {
  const canSave = totalFilledSets > 0 && !isSaving;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.08] bg-black/85 backdrop-blur-2xl pb-safe">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4 sm:max-w-xl">
        {/* Left: Set Count & Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#f5f5f7]">
              {totalFilledSets}{" "}
              <span className="text-[#86868b] font-normal">
                / {totalPlannedSets} sets
              </span>
            </span>
          </div>
          <span className="text-[11px] text-[#6e6e73]">
            {totalFilledExercises} exercises with data
          </span>
        </div>

        {/* Right: Apple Action Blue Save Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={`apple-press relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-semibold text-white transition-all ${
            canSave
              ? "bg-[#0071e3] hover:bg-[#0077ed] shadow-sm"
              : "bg-[#242426] text-[#6e6e73] cursor-not-allowed opacity-60"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ArrowUpCircle className="h-4 w-4" />
              <span>Save Session</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
