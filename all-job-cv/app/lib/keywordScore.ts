export type CvContentForScoring = {
  name?: string;
  title?: string;
  summary?: string;
  skills?: string;
  experience?: { role: string; company: string; description: string }[];
};

function cvToText(cv: CvContentForScoring): string {
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

function cvKeywords(cv: CvContentForScoring): string[] {
  const text = cvToText(cv).toLowerCase();
  return text.split(/[^a-z0-9+]+/).filter((w) => w.length > 2);
}

/**
 * Fast, free, deterministic keyword-overlap score (0-100).
 * Not AI-scored - used for quick browsing, not the detailed AI matches page.
 */
export function keywordMatchScore(cv: CvContentForScoring, job: { title: string; description: string }): number {
  const keywords = Array.from(new Set(cvKeywords(cv)));
  if (keywords.length === 0) return 0;

  const jobText = `${job.title} ${job.description}`.toLowerCase();
  let overlap = 0;
  for (const kw of keywords) {
    if (jobText.includes(kw)) overlap++;
  }

  const ratio = overlap / Math.min(keywords.length, 30);
  return Math.min(100, Math.round(ratio * 100));
}
