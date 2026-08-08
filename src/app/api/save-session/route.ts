import { NextRequest, NextResponse } from "next/server";
import { SessionPayload, ExerciseEntry, SetEntry } from "@/types/workout";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SessionPayload;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const { date, day, exercises, notes } = body;

    if (!date || typeof date !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid 'date' field in session payload." },
        { status: 400 }
      );
    }

    if (!day || typeof day !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid 'day' field in session payload." },
        { status: 400 }
      );
    }

    if (!Array.isArray(exercises)) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid 'exercises' array in session payload." },
        { status: 400 }
      );
    }

    // Clean and validate exercises & sets (dropping empty sets silently per spec)
    const cleanedExercises: ExerciseEntry[] = [];

    for (const ex of exercises) {
      if (!ex || typeof ex.name !== "string" || !Array.isArray(ex.sets)) {
        continue;
      }

      const validSets: SetEntry[] = [];
      for (const s of ex.sets) {
        const weight = typeof s.weight === "number" ? s.weight : parseFloat(String(s.weight));
        const reps = typeof s.reps === "number" ? s.reps : parseInt(String(s.reps), 10);

        if (!isNaN(weight) && !isNaN(reps) && weight >= 0 && reps > 0) {
          validSets.push({
            set: validSets.length + 1,
            weight: Number(weight),
            reps: Number(reps),
          });
        }
      }

      if (validSets.length > 0) {
        cleanedExercises.push({
          name: ex.name.trim() || "Untitled Exercise",
          sets: validSets,
        });
      }
    }

    if (cleanedExercises.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "No valid completed sets to log. Please fill in weight and reps for at least one set.",
        },
        { status: 400 }
      );
    }

    // Build the final cleaned payload matching exact AGENTS.md schema
    const finalPayload: SessionPayload = {
      date: date.trim(),
      day: day.trim(),
      exercises: cleanedExercises,
      ...(notes && typeof notes === "string" && notes.trim() !== ""
        ? { notes: notes.trim() }
        : {}),
    };

    // Environment variables
    const token = process.env.GITHUB_TOKEN?.trim();
    const owner = process.env.GITHUB_OWNER?.trim();
    const repo = process.env.GITHUB_REPO?.trim();
    const branch = process.env.GITHUB_BRANCH?.trim() || "main";
    const inboxPath = (process.env.GITHUB_INBOX_PATH?.trim() || "data/inbox").replace(
      /^\/+|\/+$/g,
      ""
    );

    if (!token || !owner || !repo) {
      const missingVars: string[] = [];
      if (!token) missingVars.push("GITHUB_TOKEN");
      if (!owner) missingVars.push("GITHUB_OWNER");
      if (!repo) missingVars.push("GITHUB_REPO");

      return NextResponse.json(
        {
          ok: false,
          error: `GitHub integration is not configured on the server. Missing environment variables: ${missingVars.join(
            ", "
          )}. Please configure them in your Vercel project settings or .env.local file.`,
        },
        { status: 500 }
      );
    }

    // Generate filename: {GITHUB_INBOX_PATH}/{date}-{day-slug}-{timestamp}.json
    const daySlug = day
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const timestamp = Date.now();
    const fileName = `${date}-${daySlug || "session"}-${timestamp}.json`;
    const filePath = `${inboxPath}/${fileName}`;

    // Base64 encode the JSON content
    const fileContentUtf8 = JSON.stringify(finalPayload, null, 2);
    const contentBase64 = Buffer.from(fileContentUtf8, "utf-8").toString("base64");

    const commitMessage = `session: log ${finalPayload.day} - ${finalPayload.date}`;

    // Call GitHub REST API Contents endpoint
    const githubApiUrl = `https://api.github.com/repos/${encodeURIComponent(
      owner
    )}/${encodeURIComponent(repo)}/contents/${filePath}`;

    const githubResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Gym-Progress-Tracker-App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        branch: branch,
      }),
    });

    if (!githubResponse.ok) {
      let errorMessage = `GitHub API responded with status ${githubResponse.status}: ${githubResponse.statusText}`;
      try {
        const errorData = await githubResponse.json();
        if (errorData.message) {
          errorMessage = `GitHub API Error (${githubResponse.status}): ${errorData.message}`;
        }
      } catch {
        // use fallback statusText
      }

      return NextResponse.json(
        {
          ok: false,
          error: errorMessage,
        },
        { status: githubResponse.status >= 400 && githubResponse.status < 600 ? githubResponse.status : 502 }
      );
    }

    const responseData = await githubResponse.json();

    return NextResponse.json({
      ok: true,
      path: filePath,
      commitUrl: responseData.commit?.html_url || null,
      contentUrl: responseData.content?.html_url || null,
      summary: {
        day: finalPayload.day,
        date: finalPayload.date,
        totalExercises: finalPayload.exercises.length,
        totalSets: finalPayload.exercises.reduce((acc, e) => acc + e.sets.length, 0),
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error saving session.";
    return NextResponse.json(
      {
        ok: false,
        error: `Server error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
