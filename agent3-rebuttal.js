import { getAnthropicClient } from "../../lib/anthropicClient";
import { runAdvocateRebuttal } from "../../lib/agents/advocateRebuttal";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { location, jurisdictionTrap, advocateDraft, bureaucraticChallenge } = req.body || {};
  if (!advocateDraft || !bureaucraticChallenge) {
    return res.status(400).json({ error: "advocateDraft and bureaucraticChallenge are required." });
  }

  try {
    const anthropic = getAnthropicClient();
    const resolved = await runAdvocateRebuttal(
      anthropic,
      { location, jurisdictionTrap },
      advocateDraft,
      bureaucraticChallenge
    );
    return res.status(200).json(resolved);
  } catch (err) {
    console.error("Agent III error:", err);
    return res.status(500).json({ error: err.message });
  }
}
