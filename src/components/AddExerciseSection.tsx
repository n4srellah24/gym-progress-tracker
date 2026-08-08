"use client";

import React, { useState } from "react";
import { Plus, X, Dumbbell } from "lucide-react";

interface AddExerciseSectionProps {
  onAddExercise: (customName: string) => void;
}

export const AddExerciseSection: React.FC<AddExerciseSectionProps> = ({
  onAddExercise,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = exerciseName.trim();
    if (!trimmed) return;
    onAddExercise(trimmed);
    setExerciseName("");
    setIsOpen(false);
  };

  return (
    <div className="pt-1">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="apple-press flex w-full items-center justify-center gap-2 rounded-[16px] border border-dashed border-white/[0.12] bg-[#161618]/50 py-3.5 text-[14px] font-medium text-[#86868b] hover:border-white/[0.2] hover:text-[#f5f5f7] transition-all"
        >
          <Plus className="h-4 w-4 text-[#0071e3]" />
          <span>Add Custom Exercise</span>
        </button>
      ) : (
        <div className="rounded-[20px] border border-white/[0.08] bg-[#161618] p-4 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-[#0071e3]" />
              <h4 className="text-[14px] font-semibold text-[#f5f5f7]">
                New Exercise
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setExerciseName("");
                setIsOpen(false);
              }}
              className="apple-press flex h-7 w-7 items-center justify-center rounded-full text-[#86868b] hover:text-[#f5f5f7]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Incline DB Flyes, Cable Lateral Raises..."
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="flex-1 rounded-[10px] bg-[#242426] border border-white/[0.08] px-3 py-2 text-[14px] text-[#f5f5f7] placeholder-[#6e6e73] focus:border-[#0071e3] focus:outline-none transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!exerciseName.trim()}
              className="apple-press rounded-full bg-[#0071e3] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#0077ed] disabled:opacity-40 transition-all"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
