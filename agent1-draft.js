import { getAnthropicClient } from "../../lib/anthropicClient";
import { runAdvocateDraft } from "../../lib/agents/advocateDraft";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { issueDescription, location, primaryAuthority, additionalContext } = req.body || {};
  if (!issueDescription || !location || !primaryAuthority) {
    return res.status(400).json({ error: "issueDescription, location, and primaryAuthority are required." });
  }

  try {
    const anthropic = getAnthropicClient();
    const draft = await runAdvocateDraft(anthropic, {
      issueDescription,
      location,
      primaryAuthority,
      additionalContext,
    });
    return res.status(200).json({ draft });
  } catch (err) {
    console.error("Agent I error:", err);
    return res.status(500).json({ error: err.message });
  }
}
