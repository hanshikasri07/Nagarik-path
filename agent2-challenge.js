import { getAnthropicClient } from "../../lib/anthropicClient";
import { runBureaucraticChallenge } from "../../lib/agents/bureaucraticChallenge";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { location, jurisdictionTrap, advocateDraft } = req.body || {};
  if (!advocateDraft) {
    return res.status(400).json({ error: "advocateDraft (Agent I output) is required." });
  }

  try {
    const anthropic = getAnthropicClient();
    const challenge = await runBureaucraticChallenge(anthropic, { location, jurisdictionTrap }, advocateDraft);
    return res.status(200).json({ challenge });
  } catch (err) {
    console.error("Agent II error:", err);
    return res.status(500).json({ error: err.message });
  }
}
