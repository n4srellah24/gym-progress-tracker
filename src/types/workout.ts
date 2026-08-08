export type SetEntry = {
  set: number;
  weight: number; // numeric, unit implied (kg) — no unit field needed for v1
  reps: number;
};

export type ExerciseEntry = {
  name: string;
  sets: SetEntry[];
};

export type SessionPayload = {
  date: string; // ISO date, e.g. "2026-08-08", set at save time
  day: string; // e.g. "Lower A"
  exercises: ExerciseEntry[];
  notes?: string; // optional free text
};

export type SplitDayTemplate = {
  id: string; // slug, e.g. "lower-a"
  name: string; // e.g. "Lower A"
  focus: string; // e.g. "Quads, Calves & Heavy Squat"
  badgeColor: string; // styling badge
  exercises: {
    name: string;
    defaultSets: number;
    notes?: string;
  }[];
};

export type EditableSet = {
  id: string;
  set: number;
  weight: string; // string during editing to handle live typing like "42.5" or empty
  reps: string; // string during editing
};

export type EditableExercise = {
  id: string;
  name: string;
  isCollapsed: boolean;
  sets: EditableSet[];
};
