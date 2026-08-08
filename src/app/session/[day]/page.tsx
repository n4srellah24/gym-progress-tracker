"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getSplitDay, generateInitialExercises, TRAINING_SPLIT } from "@/lib/trainingSplit";
import { EditableExercise, SessionPayload } from "@/types/workout";
import { getTodayISODate, formatReadableDate, prepareSessionPayload } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { AddExerciseSection } from "@/components/AddExerciseSection";
import { SaveBar } from "@/components/SaveBar";
import { SuccessModal } from "@/components/SuccessModal";
import { ErrorBanner } from "@/components/ErrorBanner";
import { UnsavedChangesModal } from "@/components/UnsavedChangesModal";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileText,
  Loader2,
} from "lucide-react";

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-[#0071e3]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#0071e3]" />
            <p className="text-[13px] text-[#86868b]">Loading session...</p>
          </div>
        </div>
      }
    >
      <SessionPageContent />
    </Suspense>
  );
}

function SessionPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dayParam = Array.isArray(params?.day) ? params.day[0] : (params?.day as string) || "lower-a";
  const dateQuery = searchParams.get("date");

  const dayTemplate = useMemo(() => {
    return getSplitDay(dayParam) || TRAINING_SPLIT[0];
  }, [dayParam]);

  const [workoutDate, setWorkoutDate] = useState<string>(() => dateQuery || getTodayISODate());
  const [exercises, setExercises] = useState<EditableExercise[]>(() =>
    generateInitialExercises(dayTemplate)
  );
  const [workoutNotes, setWorkoutNotes] = useState<string>("");

  // Saving and modal state
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    isOpen: boolean;
    filePath: string;
    commitUrl?: string | null;
    payload: SessionPayload;
  } | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Sync template if dayParam changes
  useEffect(() => {
    if (dayTemplate) {
      setExercises(generateInitialExercises(dayTemplate));
    }
  }, [dayTemplate]);

  // Compute live statistics
  const { totalFilledSets, totalPlannedSets, totalFilledExercises } = useMemo(() => {
    let filledSets = 0;
    let plannedSets = 0;
    let filledExercises = 0;

    for (const ex of exercises) {
      plannedSets += ex.sets.length;
      let exHasFilled = false;
      for (const s of ex.sets) {
        if (
          s.weight.trim() !== "" &&
          s.reps.trim() !== "" &&
          !isNaN(parseFloat(s.weight)) &&
          !isNaN(parseInt(s.reps, 10))
        ) {
          filledSets++;
          exHasFilled = true;
        }
      }
      if (exHasFilled) filledExercises++;
    }

    return {
      totalFilledSets: filledSets,
      totalPlannedSets: plannedSets,
      totalFilledExercises: filledExercises,
    };
  }, [exercises]);

  // Handler for back navigation with unsaved warning
  const handleBackClick = () => {
    if (totalFilledSets > 0 && !successInfo?.isOpen) {
      setShowUnsavedModal(true);
    } else {
      router.push("/");
    }
  };

  // Exercise management handlers
  const handleUpdateExerciseName = (exIdx: number, newName: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, name: newName } : ex))
    );
  };

  const handleToggleCollapse = (exIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, isCollapsed: !ex.isCollapsed } : ex))
    );
  };

  const handleToggleAllCollapse = (collapse: boolean) => {
    setExercises((prev) => prev.map((ex) => ({ ...ex, isCollapsed: collapse })));
  };

  const handleAddExercise = (customName: string) => {
    const newExercise: EditableExercise = {
      id: `custom-ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: customName,
      isCollapsed: false,
      sets: [
        {
          id: `set-custom-0-${Math.random().toString(36).slice(2, 6)}`,
          set: 1,
          weight: "",
          reps: "",
        },
      ],
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const handleDeleteExercise = (exIdx: number) => {
    if (confirm(`Remove "${exercises[exIdx].name}" from this workout?`)) {
      setExercises((prev) => prev.filter((_, i) => i !== exIdx));
    }
  };

  // Set management handlers
  const handleAddSet = (exIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSetNumber = ex.sets.length + 1;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `set-${exIdx}-${newSetNumber}-${Math.random().toString(36).slice(2, 6)}`,
              set: newSetNumber,
              weight: lastSet ? lastSet.weight : "",
              reps: lastSet ? lastSet.reps : "",
            },
          ],
        };
      })
    );
  };

  const handleDeleteSet = (exIdx: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const filtered = ex.sets.filter((_, sIdx) => sIdx !== setIdx);
        const renumbered = filtered.map((s, idx) => ({ ...s, set: idx + 1 }));
        return { ...ex, sets: renumbered };
      })
    );
  };

  const handleUpdateSet = (
    exIdx: number,
    setIdx: number,
    field: "weight" | "reps",
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const updatedSets = ex.sets.map((s, sIdx) => {
          if (sIdx !== setIdx) return s;
          return { ...s, [field]: value };
        });
        return { ...ex, sets: updatedSets };
      })
    );
  };

  const handleCopyPreviousSet = (exIdx: number, setIdx: number) => {
    if (setIdx <= 0) return;
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const prevSet = ex.sets[setIdx - 1];
        if (!prevSet) return ex;

        const updatedSets = ex.sets.map((s, sIdx) => {
          if (sIdx !== setIdx) return s;
          return {
            ...s,
            weight: prevSet.weight,
            reps: prevSet.reps,
          };
        });
        return { ...ex, sets: updatedSets };
      })
    );
  };

  const handleResetSession = () => {
    if (confirm("Reset all entered weights and reps for this session?")) {
      setExercises(generateInitialExercises(dayTemplate));
      setWorkoutNotes("");
      setErrorMessage(null);
    }
  };

  // Save to GitHub REST API Handler
  const handleSaveWorkout = async () => {
    setErrorMessage(null);

    const { payload, totalFilledSets: validCount } = prepareSessionPayload(
      dayTemplate.name,
      workoutDate,
      exercises,
      workoutNotes
    );

    if (validCount === 0) {
      setErrorMessage("Please log weight and reps for at least 1 set before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `Save failed with status ${response.status}`);
      }

      setSuccessInfo({
        isOpen: true,
        filePath: data.path,
        commitUrl: data.commitUrl,
        payload,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-[#000000] text-[#f5f5f7] flex flex-col">
      {/* Top Frosted Navbar */}
      <Navbar
        currentDayName={dayTemplate.name}
        showBack={true}
        onBackClick={handleBackClick}
      />

      <main className="mx-auto w-full max-w-lg px-4 sm:max-w-xl flex-1 pt-4 space-y-4">
        {/* Error Banner */}
        {errorMessage && (
          <ErrorBanner
            error={errorMessage}
            onRetry={handleSaveWorkout}
            onDismiss={() => setErrorMessage(null)}
            isSaving={isSaving}
          />
        )}

        {/* Workout Session Header Card */}
        <section className="rounded-[20px] border border-white/[0.06] bg-[#161618] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-[#242426] px-2.5 py-0.5 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  {dayTemplate.name}
                </span>
              </div>
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#f5f5f7] tracking-tight">
                {dayTemplate.focus}
              </h1>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 rounded-full bg-[#242426] border border-white/[0.08] px-3.5 py-1.5">
                <Calendar className="h-4 w-4 text-[#0071e3]" />
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value || getTodayISODate())}
                  className="bg-transparent text-[13px] font-medium text-[#f5f5f7] focus:outline-none cursor-pointer"
                  aria-label="Workout Date"
                />
              </div>
            </div>
          </div>

          {/* Quick Toolbar: Collapse/Expand All & Reset */}
          <div className="mt-4 pt-3.5 border-t border-white/[0.04] flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleAllCollapse(false)}
                className="flex items-center gap-1 text-[#86868b] hover:text-[#f5f5f7] transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Expand All</span>
              </button>
              <span className="text-[#333336]">|</span>
              <button
                type="button"
                onClick={() => handleToggleAllCollapse(true)}
                className="flex items-center gap-1 text-[#86868b] hover:text-[#f5f5f7] transition-colors"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Collapse All</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetSession}
              className="flex items-center gap-1 text-[#6e6e73] hover:text-[#ff453a] transition-colors"
              title="Reset all inputs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </section>

        {/* Exercises List */}
        <section className="space-y-3.5">
          {exercises.map((exercise, exIdx) => (
            <ExerciseCard
              key={exercise.id}
              exerciseIndex={exIdx}
              exercise={exercise}
              onUpdateExerciseName={(newName) => handleUpdateExerciseName(exIdx, newName)}
              onToggleCollapse={() => handleToggleCollapse(exIdx)}
              onAddSet={() => handleAddSet(exIdx)}
              onDeleteExercise={() => handleDeleteExercise(exIdx)}
              onUpdateSet={(setIdx, field, value) => handleUpdateSet(exIdx, setIdx, field, value)}
              onDeleteSet={(setIdx) => handleDeleteSet(exIdx, setIdx)}
              onCopyPreviousSet={(setIdx) => handleCopyPreviousSet(exIdx, setIdx)}
            />
          ))}
        </section>

        {/* Add Custom Exercise Section */}
        <section>
          <AddExerciseSection onAddExercise={handleAddExercise} />
        </section>

        {/* Workout Notes Section */}
        <section className="rounded-[20px] border border-white/[0.06] bg-[#161618] p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[#0071e3]" />
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              Workout Notes (Optional)
            </h3>
          </div>
          <p className="text-[12px] text-[#86868b] mb-3">
            Add any reflections, energy levels, RPE, or equipment adjustments for this session.
          </p>
          <textarea
            rows={3}
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            placeholder="e.g. Felt strong on squats; used pin 7 on leg extension..."
            className="w-full rounded-[12px] bg-[#242426] border border-white/[0.08] p-3 text-[14px] text-[#f5f5f7] placeholder-[#6e6e73] focus:border-[#0071e3] focus:outline-none transition-colors resize-none"
          />
        </section>
      </main>

      {/* Sticky Bottom Save Bar */}
      <SaveBar
        totalFilledSets={totalFilledSets}
        totalPlannedSets={totalPlannedSets}
        totalFilledExercises={totalFilledExercises}
        isSaving={isSaving}
        onSave={handleSaveWorkout}
      />

      {/* Success Modal */}
      {successInfo && (
        <SuccessModal
          isOpen={successInfo.isOpen}
          filePath={successInfo.filePath}
          commitUrl={successInfo.commitUrl}
          payload={successInfo.payload}
          onClose={() => setSuccessInfo(null)}
          onResetSession={() => {
            setSuccessInfo(null);
            setExercises(generateInitialExercises(dayTemplate));
            setWorkoutNotes("");
          }}
        />
      )}

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirmLeave={() => {
          setShowUnsavedModal(false);
          router.push("/");
        }}
        onCancel={() => setShowUnsavedModal(false)}
      />
    </div>
  );
}
