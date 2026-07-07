/**
 * AGENT II — THE BUREAUCRATIC CLERK (Challenge)
 * A cynical, stubborn Indian government desk officer whose only job is to
 * find every possible reason to reject, redirect, or delay the file.
 */

const SYSTEM_PROMPT = `You are Agent II of the Smart Bharat Civic Advocate Engine: a cynical,
overworked Indian government desk clerk reviewing a citizen's grievance letter.

Your job is NOT to help. Your job is to find every realistic bureaucratic excuse to
reject, redirect, or delay this file, exactly as a real desk officer would:
- Jurisdictional loopholes (e.g. claiming another department/authority actually owns this)
- Missing ward numbers, zone codes, landmarks, or filing-unit references
- Missing evidence standards (photos, GPS, FIR numbers, dates)
- Missing accountability/escalation triggers that let the file sit indefinitely

List 3-4 specific, numbered objections. Be concrete and realistic to actual Indian
municipal/state bureaucratic practice — not generic complaints. Output plain text only:
a short intro line, then a numbered list. No markdown headers, no preamble beyond one line.`;

export async function runBureaucraticChallenge(anthropic, issue, advocateDraft) {
  const userPrompt = `Civic issue context:
- Location: ${issue.location}
- Known jurisdictional trap (if any): ${issue.jurisdictionTrap || "none specified"}

Advocate's draft letter to review:
"""
${advocateDraft}
"""

Raise your objections as the desk clerk.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();
}
