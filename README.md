# 🏋️‍♂️ Gym Progress Tracker (IronTrack)

A fast, mobile-first web app for logging gym workouts mid-session and committing them directly to a GitHub repository via the GitHub REST API.

---

## ⚡ Architecture & Philosophy

- **Zero Database**: No database or user authentication setup required. Every saved workout commits a structured JSON session file directly to your target GitHub repository (`/data/inbox/YYYY-MM-DD-{day}-{timestamp}.json`).
- **Separation of Concerns**: The web app handles user input, set logging, and GitHub writes. A separate local sync agent (governed by [`agents.md`](./agents.md)) pulls new inbox files and formats them into your permanent `training-log.md`.
- **Gym Ergonomics**: Large touch targets, decimal & numeric mobile keyboard prompts (`inputmode`), quick weight stepper buttons, copy-previous-set shortcuts, and persistent safe-area bottom save controls.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Write Path**: GitHub REST API (Contents API: `PUT /repos/{owner}/{repo}/contents/{path}`)
- **Hosting**: Vercel

---

## 🚀 Quick Start (Local Development)

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your GitHub details:
```ini
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your_github_username
GITHUB_REPO=training-log
GITHUB_BRANCH=main
GITHUB_INBOX_PATH=data/inbox
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser or mobile device on your local network.

---

## 🔑 GitHub Personal Access Token (PAT) Setup

To allow the server-side Next.js route to commit session files to your repo:

1. Go to **GitHub Settings** → **Developer Settings** → **Personal Access Tokens** → **Fine-grained tokens**.
2. Click **Generate new token**.
3. Set **Token name**: `Gym Progress Tracker Web App`.
4. Set **Repository access**: *Only select repositories* → Choose your `training-log` repo.
5. Under **Repository permissions**, find **Contents** and set access to **Read and write**.
6. Generate token and copy the string to `GITHUB_TOKEN`.

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub or import it into [Vercel](https://vercel.com).
2. In your Vercel Project dashboard, go to **Settings** → **Environment Variables** and add:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `GITHUB_BRANCH` (value: `main`)
   - `GITHUB_INBOX_PATH` (value: `data/inbox`)
3. Deploy! Add the deployed URL to your phone's home screen as a standalone PWA.

---

## 📋 Training Split Seed Data

| Split Day | Focus | Default Exercises & Sets |
|---|---|---|
| **Lower A** | Heavy Squat & Quads | Squats (1 heavy), Leg Extensions (3), Leg Press (2), Hack Squats (2), Hamstring Curls (5), Calf Raises (5) |
| **Upper A** | Back & Chest | Pull Ups (3), Pullovers (2), Rows (2), Incline Bench Press (4), Pec Deck (2) |
| **Arms** | Arms & Delts | Tricep Pushdown (4), Machine Overhead Tricep Ext (2), Bicep DB Curl (4), Seated Bicep DB Curl (2), Lateral Raises (4) |
| **Lower B** | Hypertrophy Lower | Leg Extensions (3), Leg Press (2), Hack Squats (2), Hamstring Curls (5), Calf Raises (5) |
| **Upper B** | High Volume Pull | Pull Ups (5), Rows (2), Incline Bench Press (4), Pec Deck (2) |

---

## 📦 JSON Payload Schema

Every saved session commits a JSON file with the following exact shape expected by `agents.md`:

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
  "notes": "Felt strong on squats today."
}
```
