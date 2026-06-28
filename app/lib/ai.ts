import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Generate a plain-English summary of what changed between two HTML snapshots.
 * Used to power the AI alert summary shown in the dashboard.
 */
export async function summarizeDiff(
  competitorName: string,
  oldSnapshot: string,
  newSnapshot: string
): Promise<string> {
  const prompt = `You are a competitive intelligence analyst.
A competitor called "${competitorName}" just updated their website.

OLD version (first 3000 chars):
${oldSnapshot.slice(0, 3000)}

NEW version (first 3000 chars):
${newSnapshot.slice(0, 3000)}

In 2-3 sentences, summarize the key changes in plain English.
Focus on: pricing changes, new features, messaging shifts, new CTAs.
Be specific and actionable. Do not mention HTML or technical details.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.3,
  });

  return response.choices[0]?.message.content ?? "Changes detected on competitor site.";
}

/**
 * Detect if a pricing change occurred between two snapshots.
 */
export async function detectPriceChange(
  oldSnapshot: string,
  newSnapshot: string
): Promise<boolean> {
  // Simple heuristic: look for price patterns like $xx or €xx
  const priceRegex = /[\$€£]\s*\d+(\.\d{2})?/g;
  const oldPrices = new Set(oldSnapshot.match(priceRegex) ?? []);
  const newPrices = new Set(newSnapshot.match(priceRegex) ?? []);

  const changed =
    JSON.stringify([...oldPrices].sort()) !==
    JSON.stringify([...newPrices].sort());

  return changed;
}
