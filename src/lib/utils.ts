import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EditableExercise, SessionPayload, ExerciseEntry, SetEntry } from "@/types/workout";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns today's date formatted as ISO YYYY-MM-DD in local time zone
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats ISO date string (YYYY-MM-DD) into human readable date
 */
export function formatReadableDate(isoDate: string): string {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Converts editable exercise state into clean SessionPayload,
 * dropping empty/incomplete sets silently as requested in specs.
 */
export function prepareSessionPayload(
  day: string,
  date: string,
  exercises: EditableExercise[],
  notes?: string
): { payload: SessionPayload; totalFilledSets: number } {
  let totalFilledSets = 0;

  const cleanedExercises: ExerciseEntry[] = [];

  for (const ex of exercises) {
    const validSets: SetEntry[] = [];

    for (const s of ex.sets) {
      const trimmedWeight = s.weight.trim();
      const trimmedReps = s.reps.trim();

      // Only include if both weight and reps are filled with valid positive numbers
      if (trimmedWeight !== "" && trimmedReps !== "") {
        const weightNum = parseFloat(trimmedWeight);
        const repsNum = parseInt(trimmedReps, 10);

        if (!isNaN(weightNum) && !isNaN(repsNum) && weightNum >= 0 && repsNum > 0) {
          validSets.push({
            set: validSets.length + 1, // normalize 1-indexed set numbers
            weight: weightNum,
            reps: repsNum,
          });
          totalFilledSets++;
        }
      }
    }

    if (validSets.length > 0) {
      cleanedExercises.push({
        name: ex.name.trim() || "Untitled Exercise",
        sets: validSets,
      });
    }
  }

  const payload: SessionPayload = {
    date: date || getTodayISODate(),
    day: day.trim(),
    exercises: cleanedExercises,
    ...(notes && notes.trim() !== "" ? { notes: notes.trim() } : {}),
  };

  return { payload, totalFilledSets };
}
