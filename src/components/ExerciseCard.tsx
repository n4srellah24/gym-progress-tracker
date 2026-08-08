"use client";

import React, { useState } from "react";
import { EditableExercise } from "@/types/workout";
import { SetRow } from "./SetRow";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";

interface ExerciseCardProps {
  exerciseIndex: number;
  exercise: EditableExercise;
  onUpdateExerciseName: (newName: string) => void;
  onToggleCollapse: () => void;
  onAddSet: () => void;
  onDeleteExercise: () => void;
  onUpdateSet: (setIdx: number, field: "weight" | "reps", value: string) => void;
  onDeleteSet: (setIdx: number) => void;
  onCopyPreviousSet: (setIdx: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseIndex,
  exercise,
  onUpdateExerciseName,
  onToggleCollapse,
  onAddSet,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  onCopyPreviousSet,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(exercise.name);

  const filledCount = exercise.sets.filter(
    (s) =>
      s.weight.trim() !== "" &&
      s.reps.trim() !== "" &&
      !isNaN(parseFloat(s.weight)) &&
      !isNaN(parseInt(s.reps, 10))
  ).length;

  const totalSets = exercise.sets.length;
  const isFullyComplete = filledCount === totalSets && totalSets > 0;

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      onUpdateExerciseName(trimmed);
    } else {
      setTempName(exercise.name);
    }
    setIsEditingName(false);
  };

  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-[#161618] p-4 sm:p-5 transition-all">
      {/* Exercise Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="w-full rounded-[10px] bg-[#242426] border border-[#0071e3] px-2.5 py-1 text-[16px] font-semibold text-[#f5f5f7] focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="apple-press flex h-7 w-7 items-center justify-center rounded-full bg-[#0071e3] text-white"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#6e6e73] font-mono">
                #{exerciseIndex + 1}
              </span>
              <h3
                onClick={() => setIsEditingName(true)}
                className="truncate text-[17px] font-semibold tracking-tight text-[#f5f5f7] cursor-pointer hover:text-[#0071e3] transition-colors"
                title="Click to rename"
              >
                {exercise.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="text-[#6e6e73] hover:text-[#86868b] transition-colors"
                aria-label="Rename exercise"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Set Completion Status Pill */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[12px] font-medium ${
                isFullyComplete
                  ? "text-[#30d158]"
                  : filledCount > 0
                  ? "text-[#0071e3]"
                  : "text-[#86868b]"
              }`}
            >
              {filledCount} of {totalSets} sets logged
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onDeleteExercise}
            className="apple-press flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e73] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-colors"
            title="Delete exercise"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="apple-press flex h-8 w-8 items-center justify-center rounded-full bg-[#242426] text-[#86868b] hover:text-[#f5f5f7] transition-colors"
            aria-label={exercise.isCollapsed ? "Expand sets" : "Collapse sets"}
          >
            {exercise.isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Sets List */}
      {!exercise.isCollapsed && (
        <div className="mt-3.5 space-y-2 pt-3 border-t border-white/[0.04]">
          {exercise.sets.map((set, sIdx) => (
            <SetRow
              key={set.id}
              setIndex={sIdx}
              setData={set}
              previousSetData={sIdx > 0 ? exercise.sets[sIdx - 1] : undefined}
              onUpdate={(field, val) => onUpdateSet(sIdx, field, val)}
              onDelete={() => onDeleteSet(sIdx)}
              onCopyPrevious={() => onCopyPreviousSet(sIdx)}
              canDelete={exercise.sets.length > 1}
            />
          ))}

          {/* Add Set Button */}
          <button
            type="button"
            onClick={onAddSet}
            className="apple-press mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#242426] py-2 text-[13px] font-medium text-[#f5f5f7] hover:bg-[#2c2c2e] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" />
            <span>Add Set</span>
          </button>
        </div>
      )}
    </div>
  );
};
