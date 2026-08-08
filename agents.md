# Workout Log Agent — Standing Instructions

## Purpose
This repo holds a running training log (`training-log.md`). A phone-hosted web
app writes new workout sessions to this repo as JSON files. Your job, when
prompted with something like "process new workout data" or "sync my log", is
to pull the latest data, convert it to markdown, and append it — nothing more.

## Assumed repo structure
> Adjust these paths once the actual repo is scaffolded — these are the
> defaults this instruction set expects.

```
/data/inbox/        <- new session JSON files land here (from the web app)
/data/processed/    <- move each JSON file here after it's been logged
/training-log.md    <- the single running markdown log, append-only
```

## Task: process new workout data
Run these steps in order, every time you're asked to sync:

1. `git pull origin main` to get the latest commits from the web app.
2. List all files in `/data/inbox/`. If empty, report "nothing new to log" and stop.
3. Sort files oldest → newest (by filename timestamp or commit order).
4. For each file:
   - Parse the JSON.
   - Convert it to a markdown entry using the exact format below.
   - Append the entry to the end of `training-log.md`.
   - Move the JSON file from `/data/inbox/` to `/data/processed/`.
5. Stage and commit: `training-log.md` + the moved files, with a commit
   message like `log: sync N session(s) through <date>`.
6. Report back a short summary: which day(s) were logged, and their dates.

Do not push to a remote unless explicitly told to.

## Expected JSON shape (one file per session)
```json
{
  "date": "2026-08-08",
  "day": "Lower A",
  "exercises": [
    {
      "name": "Squats",
      "sets": [
        { "set": 1, "weight": 100, "reps": 5 }
      ]
    },
    {
      "name": "Leg Extensions",
      "sets": [
        { "set": 1, "weight": 40, "reps": 12 },
        { "set": 2, "weight": 40, "reps": 11 },
        { "set": 3, "weight": 40, "reps": 10 }
      ]
    }
  ],
  "notes": "optional free text, may be empty or absent"
}
```

## Markdown entry format
Append entries in this exact shape — one `##` heading per session, one
sub-list per exercise. Weight units are whatever was entered (assume kg
unless the JSON says otherwise).

```markdown
## 2026-08-08 — Lower A

- **Squats**: 100kg x5 (1 set)
- **Leg Extensions**: 40kg x12, 40kg x11, 40kg x10
- **Leg Press**: ...
- **Hack Squats**: ...
- **Hamstring Curls**: ...
- **Calf Raises**: ...

*Notes: (only include this line if notes is non-empty)*
```

Rules for formatting:
- One line per exercise, all sets for that exercise comma-separated on the
  same line, in the format `WEIGHTunit xREPS`.
- Preserve set order as given in the JSON — do not reorder or average sets.
- If an exercise has only one set, still show it as `WEIGHTunit xREPS (1 set)`.
- New sessions always go at the **bottom** of the file (chronological order).

## Reference: the training split
Use this only to sanity-check exercise names/order — never to invent or
auto-fill data that wasn't in the JSON.

- **Lower A**: Squats (1 heavy set), Leg Extensions (3), Leg Press (2), Hack Squats (2), Hamstring Curls (5), Calf Raises (5)
- **Upper A**: Pull Ups (3), Pullovers (2), Rows (2), Incline Bench Press (4), Pec Deck (2)
- **Arms**: Tricep Pushdown (4), Machine Overhead Tricep Extension (2), Bicep DB Curl (4), Seated Bicep DB Curl (2), Lateral Raises (4)
- **Lower B**: same as Lower A, no heavy squat set
- **Upper B**: same as Upper A, no pullovers, Pull Ups increased to 5 sets
- Cycle: Lower A → Upper A → Arms → Lower B → Upper B → rest → rest

## Do NOT
- Do not reformat, reorder, or "clean up" existing entries already in `training-log.md`.
- Do not touch any file outside `/data/inbox/`, `/data/processed/`, and `training-log.md`.
- Do not push to any remote unless explicitly asked.
- Do not invent, average, round, or estimate any weight/rep/set value that wasn't in the JSON.
- Do not delete JSON files — always move them to `/data/processed/`, never remove.
- Do not create a new markdown file per session — everything appends to the one `training-log.md`.

## Edge cases
- **Multiple sessions queued** (missed a few syncs): process each as its own
  entry, oldest first, one commit covering all of them.
- **Unrecognized exercise name**: log it as-is under the session it came from.
  Do not try to match it to the reference list above or rename it.
- **Malformed/unparseable JSON file**: skip it, leave it in `/data/inbox/`,
  and report which file failed and why — do not guess at its contents.
