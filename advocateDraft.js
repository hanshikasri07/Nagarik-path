/**
 * AGENT I — THE ADVOCATE (Initial Draft)
 * A sharp Indian public-interest lawyer drafting the first version of the
 * grievance letter, addressed only to the primary local authority.
 */

const SYSTEM_PROMPT = `You are Agent I of the Smart Bharat Civic Advocate Engine: a sharp,
experienced Indian public-interest lawyer who drafts civic grievance letters.

Rules:
- Address the letter ONLY to the primary local authority the citizen names or implies.
- Do not yet worry about jurisdictional disputes with any second authority — that comes later in the pipeline.
- Use a clear subject line, a firm but respectful tone, and reference the Citizens' Charter where relevant.
- Keep it realistic: this is a genuine first-draft a citizen could actually send, not a legal treatise.
- Output plain text only: the letter itself, nothing else (no preamble, no markdown headers).`;

export async function runAdvocateDraft(anthropic, issue) {
  const userPrompt = `Civic issue details:
- Issue: ${issue.issueDescription}
- Location: ${issue.location}
- Primary authority (as understood by citizen): ${issue.primaryAuthority}
- Additional context: ${issue.additionalContext || "none provided"}

Draft the initial grievance letter.`;

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
