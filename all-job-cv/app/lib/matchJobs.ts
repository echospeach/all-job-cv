import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type CvContent = {
  name?: string;
  title?: string;
  summary?: string;
  skills?: string;
  experience?: { role: string; company: string; description: string }[];
};

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
};

export type JobMatch = {
  job: Job;
  score: number;
  reason: string;
};

function cvToText(cv: CvContent): string {
  const parts = [
    cv.title && `Current/target role: ${cv.title}`,
    cv.summary && `Summary: ${cv.summary}`,
    cv.skills && `Skills: ${cv.skills}`,
    cv.experience?.length &&
      "Experience:\n" +
        cv.experience
          .map((e) => `- ${e.role} at ${e.company}: ${e.description}`)
          .join("\n"),
  ].filter(Boolean);
  return parts.join("\n\n");
}

export async function scoreJobMatch(cv: CvContent, job: Job): Promise<JobMatch> {
  const cvText = cvToText(cv);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are scoring how well a candidate's CV matches a job posting.

CV:
${cvText}

Job posting:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}

Respond with ONLY a JSON object, no other text, in this exact format:
{"score": <integer 0-100>, "reason": "<one sentence explaining the score>"}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { job, score: parsed.score ?? 0, reason: parsed.reason ?? "" };
  } catch {
    return { job, score: 0, reason: "Could not evaluate this match." };
  }
}

export async function matchJobsForCv(cv: CvContent, jobs: Job[]): Promise<JobMatch[]> {
  const results = await Promise.all(jobs.map((job) => scoreJobMatch(cv, job)));
  return results.sort((a, b) => b.score - a.score);
}
