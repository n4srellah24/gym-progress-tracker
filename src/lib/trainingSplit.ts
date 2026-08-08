import { SplitDayTemplate, EditableExercise } from "@/types/workout";

export const TRAINING_SPLIT: SplitDayTemplate[] = [
  {
    id: "lower-a",
    name: "Lower A",
    focus: "Quads, Hamstrings, Calves & Heavy Squat",
    badgeColor: "emerald",
    exercises: [
      { name: "Squats", defaultSets: 1, notes: "1 Heavy set" },
      { name: "Leg Extensions", defaultSets: 3 },
      { name: "Leg Press", defaultSets: 2 },
      { name: "Hack Squats", defaultSets: 2 },
      { name: "Hamstring Curls", defaultSets: 5 },
      { name: "Calf Raises", defaultSets: 5 },
    ],
  },
  {
    id: "upper-a",
    name: "Upper A",
    focus: "Back, Chest & Vertical / Horizontal Pulls",
    badgeColor: "cyan",
    exercises: [
      { name: "Pull Ups", defaultSets: 3 },
      { name: "Pullovers", defaultSets: 2 },
      { name: "Rows", defaultSets: 2 },
      { name: "Incline Bench Press", defaultSets: 4 },
      { name: "Pec Deck", defaultSets: 2 },
    ],
  },
  {
    id: "arms",
    name: "Arms",
    focus: "Triceps, Biceps & Lateral Delts",
    badgeColor: "amber",
    exercises: [
      { name: "Tricep Pushdown", defaultSets: 4 },
      { name: "Machine Overhead Tricep Extension", defaultSets: 2 },
      { name: "Bicep DB Curl", defaultSets: 4 },
      { name: "Seated Bicep DB Curl", defaultSets: 2 },
      { name: "Lateral Raises", defaultSets: 4 },
    ],
  },
  {
    id: "lower-b",
    name: "Lower B",
    focus: "Hypertrophy Lower (No Heavy Squats)",
    badgeColor: "teal",
    exercises: [
      { name: "Leg Extensions", defaultSets: 3 },
      { name: "Leg Press", defaultSets: 2 },
      { name: "Hack Squats", defaultSets: 2 },
      { name: "Hamstring Curls", defaultSets: 5 },
      { name: "Calf Raises", defaultSets: 5 },
    ],
  },
  {
    id: "upper-b",
    name: "Upper B",
    focus: "High Volume Pull Ups & Upper Hypertrophy",
    badgeColor: "sky",
    exercises: [
      { name: "Pull Ups", defaultSets: 5, notes: "5 sets volume" },
      { name: "Rows", defaultSets: 2 },
      { name: "Incline Bench Press", defaultSets: 4 },
      { name: "Pec Deck", defaultSets: 2 },
    ],
  },
];

/**
 * Finds a split day template by day slug or day name (case-insensitive)
 */
export function getSplitDay(identifier: string): SplitDayTemplate | undefined {
  const normalized = identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return TRAINING_SPLIT.find(
    (day) =>
      day.id === normalized ||
      day.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized ||
      day.name.toLowerCase() === identifier.toLowerCase()
  );
}

/**
 * Generates fresh editable exercise state for a given day template
 */
export function generateInitialExercises(dayTemplate: SplitDayTemplate): EditableExercise[] {
  return dayTemplate.exercises.map((ex, exIdx) => ({
    id: `ex-${exIdx}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: ex.name,
    isCollapsed: false,
    sets: Array.from({ length: ex.defaultSets }, (_, setIdx) => ({
      id: `set-${exIdx}-${setIdx}-${Math.random().toString(36).slice(2, 6)}`,
      set: setIdx + 1,
      weight: "",
      reps: "",
    })),
  }));
}
