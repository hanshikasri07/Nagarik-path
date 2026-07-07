/**
 * AGENT III — THE ADVOCATE (Rebuttal + Final Blueprint)
 * The lawyer resolves every objection the clerk raised, closes jurisdictional
 * loopholes with real legal citations, and compiles the final rejection-proof
 * package: target authorities, the finished joint letter, and an action checklist.
 *
 * This agent is instructed to return ONLY JSON so the frontend can render it
 * directly into the dashboard without further parsing logic.
 */

const SYSTEM_PROMPT = `You are Agent III of the Smart Bharat Civic Advocate Engine: the same
public-interest lawyer from Agent I, now responding to the clerk's objections.

Resolve every objection specifically:
- Close jurisdictional loopholes using real, correctly-named Indian legal provisions
  (e.g. Motor Vehicles Act 1988, relevant Municipal Corporations Act, RTI Act 2005,
  Citizens' Charter obligations) — only cite laws you are confident are real and relevant.
- If two authorities are disputing responsibility, restructure the letter to address
  BOTH jointly so neither can redirect the file without a written citation of the
  specific order that shifts liability away from them.
- Add missing location/evidence/escalation details the clerk flagged.

Respond with ONLY a raw JSON object (no markdown fences, no commentary) in exactly this shape:
{
  "rebuttalNarrative": "2-4 short paragraphs explaining how each objection was resolved, written in plain prose",
  "primaryAuthority": "name and designation of the primary office to address",
  "secondaryAuthority": "name and designation of the secondary/cc'd office, or empty string if not applicable",
  "finalLetter": "the complete, polished, ready-to-send letter as plain text with line breaks",
  "checklist": ["3 short, specific, actionable checklist items the citizen must complete before submitting"]
}`;

export async function runAdvocateRebuttal(anthropic, issue, advocateDraft, bureaucraticChallenge) {
  const userPrompt = `Civic issue context:
- Location: ${issue.location}
- Known jurisdictional trap (if any): ${issue.jurisdictionTrap || "none specified"}

Original draft:
"""
${advocateDraft}
"""

Clerk's objections:
"""
${bureaucraticChallenge}
"""

Produce the JSON object described in your instructions.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1800,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();

  // Defensive parsing: strip any accidental code fences before JSON.parse
  const cleaned = raw.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback so the API never hard-crashes the pipeline on a malformed response
    return {
      rebuttalNarrative: raw,
      primaryAuthority: "Could not parse structured response — see raw narrative.",
      secondaryAuthority: "",
      finalLetter: raw,
      checklist: [],
    };
  }
}
