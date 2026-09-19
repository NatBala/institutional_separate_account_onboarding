# Connected onboarding demo

This implementation preserves the prepared replay and adds a separate Live agent workspace. All client documents remain synthetic.

## Runtime

- Cloudflare Worker-compatible backend using native fetch calls to the OpenAI Responses and Embeddings APIs.
- Six logical model roles with strict structured-output schemas, original source IDs, and validation. The Risk and Restriction calls run concurrently.
- Exact cosine similarity over OpenAI passage embeddings, BM25-style keyword ranking, and reciprocal-rank fusion. This small 157-passage corpus needs no external vector database. Embedding indexes are cached by corpus hash, model, and evidence snapshot.
- R2 stores run records, events, accepted outputs, model-call metadata, prior revisions, decisions, and embedding indexes. Conditional ETag writes prevent concurrent run updates from overwriting each other.
- Private Sites authentication scopes every run to the authenticated user. Same-origin JSON requests are required for writes. The browser never receives model credentials.
- The browser polls saved backend events while model calls run. Animations reflect actual recorded agent start/completion events. It pauses after context extraction and before accepting the working plan.

## Configuration

Use the OpenAI Developers plugin's supported API-key setup. Configure the resulting key as the hosted `OPENAI_API_KEY` secret. Optional runtime values are `OPENAI_MODEL` (default `gpt-6-astra`) and `OPENAI_EMBEDDING_MODEL` (default `text-embedding-3-small`). Verify entitlement before live demonstration. Do not place secrets in source or public assets.

OpenAI Developers was confirmed installed during implementation, but its credential skill and tools were not exposed in the current running session. No key was created, and no live OpenAI call was made during preparation. Network-stub tests validate plumbing and controls, not model quality. Until credentials are configured, the workspace explicitly reports connection required and does not serve prepared output as a live result.

## Scope and limitations

- Starts from the supplied synthetic corpus plus optional hypothetical client amendments entered in the app. It does not ingest enterprise repositories or arbitrary uploaded files.
- Source eligibility follows the three demo snapshots and explicit supersession. New human amendments have `Uxx` evidence IDs. Historical cases are searched by issue, not filtered to Switzerland.
- Every revision reruns all six roles. Selective recomputation is a future optimization; the UI states the current behavior.
- Human decisions are recorded with identity, exact output hash and revision. Acceptance is a working-plan decision, not Legal, investment or execution approval.
- Search results and all evidence expansions are visible. No private chain-of-thought is requested or displayed.
- Structural validation, source-ID checks, dependency checks, rule-boundary calculations and a model evidence critic are implemented. Model judgments and source support still require human review.
- The cohort calculation uses the complete eligible synthetic case table. It does not estimate a calibrated risk probability or launch date.
- A disconnected browser may leave a step temporarily marked running. A bounded lease allows a later retry; responses arriving after a conflicting save are rejected. Run records survive browser reloads.
- No account, investment-system, messaging or asset-movement integrations are connected.

## Verification

Run the build script before the Node test suite. Tests use an in-memory R2 substitute and explicit OpenAI network stubs. They cover source cutoffs, supersession, hybrid ranking, arithmetic, dependency cycles, citation validity, authentication, origin checking, saved run ownership, real API request construction, concurrent analysis roles, mandatory review gates, and stale-decision rejection.

After the OpenAI connection is configured, complete a real initial run, challenge Rhinebridge's relevance, and introduce N07/N08. Inspect actual response IDs, search results and generated outputs before declaring the demonstration live-tested.


## Graph-only publication, 15 September 2026
The current publication uses `prepared-release/`, preserving the prepared demo while its graph is improved. Live Worker source remains under `public/` and `server/`. After secure OpenAI configuration, restore the root hosting manifest to project_id plus r2: BUCKET, then build and publish the live workspace. The graph fix is included in both trees.
