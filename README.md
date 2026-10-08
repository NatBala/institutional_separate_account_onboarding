# Institutional Onboarding

An institutional separate-account onboarding workspace built around the fictional Alpenridge Pension Foundation case. It shows how source evidence, relevant historical cases, risk analysis and human decisions produce a tailored onboarding plan.

## Included

- The current browser experience, in six tabs that follow the story from the whole book down to one client:
  - **Portfolio**
    1. **Onboarding portfolio**: every onboarding in flight (synthetic book): volume, split by vehicle and client type, the bottleneck stage, risk concentration and accounts behind schedule. Opens Alpenridge.
  - **Alpenridge Pension Foundation**
    2. **Status & next actions**: status as of Thu 8 Oct 2026. RAG status for each stage with owner, team and escalation point; the root-cause issues that move the funding date and the reviews each needs; who acts now, who is blocked and who must be contacted; a stage drill-down with due and forecast dates and each task's escalation path.
    3. **Requirements & obligations**: what the client asked for and where each ask stands, contractual versus non-contractual obligations, and the key players for each responsibility, including servicing.
    4. **How the plan was built**: the seven-agent flow and an animated run that pauses after each agent (client requirement → precedent → risk → workflow).
    5. **What-if**: if a task slips (dependency chain, knock-on dates, who gets notified) and if the client's requirements change (Low/Medium/High per area → onboarding days, each issue's impact and the reviews it needs, who does what). Onboarding days use the longest parallel workstream, not the sum.
  - **Across all clients**
    6. **One framework, many variations**: shared activities (AML/KYC, beneficial owner review, service model, contract review, investment guidelines, billing, account and system setup, reporting, funding, ongoing servicing) with configurable attributes: vehicle (separate account, CIT, mutual fund), client type (direct, consultant-advised, OCIO, sub-advisory, omnibus, MEP/PEP), funding method, transition manager, reporting, restrictions and billing.
- Seven agent roles: Context, Precedent, Operational risk, Investment risk, Playbook, Key players (who owns what, who is blocked, who acts next, which contacts are missing) and Evidence Review.
- A corpus of 54 source records, 157 passages and 12 historical clients.
- Synthetic PDFs, including the draft IMA, investment policy, transfer list, operating guidance and case records, under `docs/synthetic-pdfs/`.
- Two human checkpoints: confirm client context and review the proposed plan.
- A separate OpenAI backend implementation and frontend, with source validation, hybrid retrieval, saved revisions and review decisions.

## Run the current workspace

Use Node.js 22 or newer. The project has no npm package dependencies.

```bash
npm run build
python3 -m http.server 8000 --directory dist
```

Open <http://localhost:8000>. The current workspace uses prepared agent outputs and local evidence search. It runs without an OpenAI key. It must not be represented as live model execution.

## Code map

| Path | Purpose |
| --- | --- |
| `prepared-release/` | Current standalone browser experience |
| `prepared-release/onboarding-model.js` | Shared framework, attributes, Alpenridge task plan and schedule, escalation paths, book of onboardings |
| `prepared-release/status-view.js` | Portfolio, Status & next actions, Requirements & obligations, and the task-slip what-if |
| `prepared-release/framework-view.js` | One framework, many variations |
| `docs/Demo_Script.md` | Presenter script for the six-tab walkthrough |
| `prepared-release/corpus/` | Individual source records and emails |
| `public/` | Frontend that also includes the live agent workspace |
| `server/core.mjs` | Schemas, instructions, retrieval, calculations and validation |
| `server/worker.mjs` | OpenAI calls, run storage, workflow and human decisions |
| `scripts/build.mjs` | Static or Worker build |
| `tests/` | Startup checks and backend tests with explicit API stubs |
| `docs/synthetic-pdfs/` | 38 source PDFs, a guide and the source manifest |
| `LIVE_IMPLEMENTATION.md` | Detailed design, limitations and activation requirements |

## Test

```bash
npm test
```

This builds the Worker and runs both the backend and startup suites. Backend tests substitute an in-memory object store and stubbed OpenAI responses; they do not test model quality or confirm live model access. Startup checks execute the shipped scripts in a small DOM adapter, not a full browser.

To return the build output to the current standalone workspace after testing:

```bash
npm run build
```

## Build the live implementation

```bash
npm run build:live
```

The Worker output is `dist/server/index.js`; frontend assets are in `dist/client/`. A build does not activate or deploy the live implementation.

The backend expects:

- `OPENAI_API_KEY` as a server-side secret.
- `OPENAI_MODEL` and `OPENAI_EMBEDDING_MODEL` set to models available to your account. Existing defaults are retained from the original source; verify access before running.
- An R2-compatible `BUCKET` binding for runs, revisions and embedding indexes.
- An `ASSETS` binding for the frontend.
- A trusted authentication layer that supplies the user identity currently read from Sites authentication headers. When deploying elsewhere, implement authenticated identity at the server boundary and prevent clients from supplying trusted identity headers directly.

Keep credentials out of source and browser assets. `.env.example` lists the expected variables; this build does not load `.env` automatically. Provision secrets through the chosen runtime.

The live implementation has not been tested against an actual OpenAI account. The current hosted workspace remains the prepared version. Account systems, messaging and asset movements are not connected.

## Evidence and review behavior

The initial snapshot excludes superseded guidance and client updates that had not yet arrived. Retrieval compares prior cases by issue, combines semantic and keyword ranking, and retains source references. Deterministic code calculates the tobacco boundary tests and historical reporting cohort. Human updates create a new plan revision and invalidate acceptance of the old revision.

The corpus and client records are synthetic. Risk attention levels and historical rework examples are planning aids, not calibrated forecasts. Accepting a working plan does not authorize legal terms, trading, account creation or funding.

## Repository preparation

This is an independent source snapshot of the onboarding application. It omits the original site's deployment identity and includes portable build commands. The original application's published content is unaffected.
