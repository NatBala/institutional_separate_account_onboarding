# Institutional Onboarding

An institutional separate-account onboarding workspace built around the fictional Alpenridge Pension Foundation case. It shows how source evidence, relevant historical cases, risk analysis and human decisions produce a tailored onboarding plan.

## Included

- The current browser experience, in five tabs:
  1. **Onboarding status**: an operator view and a leadership view. The operator view shows Alpenridge as of Thu 8 Oct 2026: RAG status for each stage (Intake, Paperwork, Operational setup, Funding, Post-funding), with owner, team and escalation point; the root-cause issues that move the funding date and the reviews each needs; a task drill-down with due and forecast dates; the dependency chain (contract signed → funding setup → asset transfer → trading → reporting) with a delay what-if; escalation and communication paths; key players; and contractual versus non-contractual obligations. The leadership view shows the synthetic book of onboardings in flight: volume, split by vehicle and client type, the bottleneck stage, risk concentration and accounts behind schedule.
  2. **Onboarding framework**: one set of shared activities (AML/KYC, beneficial owner review, service model, contract review, investment guidelines, billing, account and system setup, reporting, funding, ongoing servicing). Configurable attributes add variations on top: vehicle (separate account, CIT, mutual fund), client type (direct, consultant-advised, OCIO, sub-advisory, omnibus, MEP/PEP), funding method, transition manager, reporting, restrictions and billing. Includes a client-structure lens and servicing ownership.
  3. **Multi-agent system**: what each agent does, what it hands off and where people decide.
  4. **Agent run**: an animated run that pauses after each agent and keeps every agent's output on the same screen.
  5. **Workflow & risk**: a single-screen console for the onboarding team. Set five requirement areas to Low, Medium or High and see the onboarding duration in business days (by phase), each issue's impact in onboarding days and the reviews it needs, and which team does what. Onboarding days use the longest parallel workstream, not the sum.
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
| `prepared-release/status-view.js`, `framework-view.js` | Onboarding status and Onboarding framework tabs |
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
