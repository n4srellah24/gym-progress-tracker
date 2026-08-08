"use client";

import React from "react";
import { EditableSet } from "@/types/workout";
import { Trash2, Copy, Check } from "lucide-react";

interface SetRowProps {
  setIndex: number;
  setData: EditableSet;
  previousSetData?: EditableSet;
  onUpdate: (field: "weight" | "reps", value: string) => void;
  onDelete: () => void;
  onCopyPrevious?: () => void;
  canDelete: boolean;
}

export const SetRow: React.FC<SetRowProps> = ({
  setIndex,
  setData,
  previousSetData,
  onUpdate,
  onDelete,
  onCopyPrevious,
  canDelete,
}) => {
  const isFilled =
    setData.weight.trim() !== "" &&
    setData.reps.trim() !== "" &&
    !isNaN(parseFloat(setData.weight)) &&
    !isNaN(parseInt(setData.reps, 10));

  // Step weight by delta
  const adjustWeight = (delta: number) => {
    const current = parseFloat(setData.weight) || 0;
    const next = Math.max(0, current + delta);
    onUpdate("weight", next === 0 && setData.weight.trim() === "" ? "" : String(next));
  };

  // Step reps by delta
  const adjustReps = (delta: number) => {
    const current = parseInt(setData.reps, 10) || 0;
    const next = Math.max(0, current + delta);
    onUpdate("reps", next === 0 && setData.reps.trim() === "" ? "" : String(next));
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-[14px] bg-[#1a1a1c] border border-white/[0.04] p-2.5 transition-colors">
      <div className="flex items-center gap-2">
        {/* Set Indicator Badge */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
            isFilled
              ? "bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30"
              : "bg-[#242426] text-[#86868b]"
          }`}
        >
          {isFilled ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : setIndex + 1}
        </div>

        {/* Weight Input Box with Micro-Steppers */}
        <div className="flex-1 min-w-0">
          <div className="relative flex items-center rounded-[10px] bg-[#242426] border border-white/[0.08] px-2.5 py-1.5 focus-within:border-[#0071e3] transition-colors">
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0"
              value={setData.weight}
              onChange={(e) => onUpdate("weight", e.target.value)}
              className="w-full bg-transparent text-[16px] font-semibold text-[#f5f5f7] placeholder-[#545458] focus:outline-none"
              aria-label={`Set ${setIndex + 1} Weight`}
            />
            <span className="text-[12px] font-medium text-[#86868b] select-none ml-1">
              kg
            </span>
          </div>
        </div>

        {/* Reps Input Box with Micro-Steppers */}
        <div className="flex-1 min-w-0">
          <div className="relative flex items-center rounded-[10px] bg-[#242426] border border-white/[0.08] px-2.5 py-1.5 focus-within:border-[#0071e3] transition-colors">
            <input
              type="number"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={setData.reps}
              onChange={(e) => onUpdate("reps", e.target.value)}
              className="w-full bg-transparent text-[16px] font-semibold text-[#f5f5f7] placeholder-[#545458] focus:outline-none"
              aria-label={`Set ${setIndex + 1} Reps`}
            />
            <span className="text-[12px] font-medium text-[#86868b] select-none ml-1">
              reps
            </span>
          </div>
        </div>

        {/* Delete Set Button */}
        {canDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="apple-press flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6e6e73] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-colors"
            title="Delete this set"
            aria-label={`Delete set ${setIndex + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}
      </div>

      {/* Quick Helper Bar: Micro Steppers & Same As Previous */}
      <div className="flex items-center justify-between px-1 text-[11px] text-[#86868b]">
        {/* Weight Steppers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => adjustWeight(-2.5)}
            className="apple-press px-1.5 py-0.5 rounded-[6px] bg-[#242426] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors"
          >
            -2.5
          </button>
          <button
            type="button"
            onClick={() => adjustWeight(2.5)}
            className="apple-press px-1.5 py-0.5 rounded-[6px] bg-[#242426] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors"
          >
            +2.5
          </button>
        </div>

        {/* Copy Previous Set Helper */}
        {setIndex > 0 && previousSetData && (
          <button
            type="button"
            onClick={onCopyPrevious}
            className="apple-press inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#0071e3] hover:bg-[#0071e3]/10 transition-colors"
          >
            <Copy className="h-3 w-3" />
            <span>Same as Set {setIndex}</span>
          </button>
        )}

        {/* Reps Steppers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => adjustReps(-1)}
            className="apple-press px-1.5 py-0.5 rounded-[6px] bg-[#242426] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => adjustReps(1)}
            className="apple-press px-1.5 py-0.5 rounded-[6px] bg-[#242426] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
};
