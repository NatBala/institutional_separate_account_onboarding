# Institutional Onboarding

An institutional separate-account onboarding workspace built around the fictional Alpenridge Pension Foundation case. It shows how source evidence, relevant historical cases, risk analysis and human decisions produce a tailored onboarding plan.

## Included

- The current browser experience: client context, corpus search, historical cases, restriction analysis, workflow and risk views, and the **Run agents** sequence.
- Six agent roles: Context, Precedent, Risk, Restriction, Playbook and Evidence Review.
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
