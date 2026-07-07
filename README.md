# Smart Bharat Civic Advocate Engine (SB-CAE)

A live 3-agent adversarial pipeline for drafting rejection-proof Indian civic
grievance letters:

- **Agent I — Advocate** (`lib/agents/advocateDraft.js`): drafts the initial letter.
- **Agent II — Bureaucratic Clerk** (`lib/agents/bureaucraticChallenge.js`): tries to
  find every real reason to reject or redirect it.
- **Agent III — Advocate Rebuttal** (`lib/agents/advocateRebuttal.js`): resolves every
  objection with real legal citations and compiles the final letter, target
  authorities, and a checklist.

Each agent is a separate Claude API call with its own locked system prompt, wired
through its own API route (`pages/api/agent1-draft.js`, `agent2-challenge.js`,
`agent3-rebuttal.js`). The frontend (`pages/index.js`) calls them in sequence and
lights up a live pipeline visualization as each one genuinely completes.

## 1. Run it locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your key from https://console.anthropic.com/settings/keys
npm run dev
```

Open http://localhost:3000, fill in the civic issue form, and click
"Run 3-agent pipeline".

## 2. Deploy to Vercel

**Option A — via GitHub (recommended for a hackathon demo link):**

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Smart Bharat Civic Advocate Engine"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new, sign in, and click "Import" on your GitHub repo.
3. Vercel auto-detects Next.js — no build config changes needed.
4. Before deploying, add your environment variable:
   - Go to **Project Settings → Environment Variables**
   - Add `ANTHROPIC_API_KEY` = your key, for the Production environment
5. Click **Deploy**. You'll get a live `https://<project-name>.vercel.app` link —
   that's what you share with the judges.

**Option B — via Vercel CLI (fastest, no GitHub needed):**

```bash
npm install -g vercel
vercel login
vercel
# follow the prompts, accept defaults
vercel env add ANTHROPIC_API_KEY
# paste your key when prompted, select "Production"
vercel --prod
```

The final command prints your live deployment URL.

## Project structure

```
sb-cae/
├── pages/
│   ├── index.js              # dashboard UI + form
│   ├── _app.js                # global styles import
│   └── api/
│       ├── agent1-draft.js    # Agent I endpoint
│       ├── agent2-challenge.js # Agent II endpoint
│       └── agent3-rebuttal.js  # Agent III endpoint
├── lib/
│   ├── anthropicClient.js     # shared Anthropic SDK client
│   └── agents/
│       ├── advocateDraft.js
│       ├── bureaucraticChallenge.js
│       └── advocateRebuttal.js
├── styles/globals.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example
```

## Notes

- Uses `claude-sonnet-4-6` — swap the model string in the three agent files if you
  want to try a different one.
- Agent III returns strict JSON (final letter, authorities, checklist) so the
  frontend never has to guess how to parse it.
- If a demo run fails, the most common cause is a missing/incorrect
  `ANTHROPIC_API_KEY` — check the error banner under the "Run pipeline" button.
