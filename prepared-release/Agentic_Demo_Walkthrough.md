# Separate-account onboarding: evidence, judgment and a tailored route

Prepared for a Capital Group discussion. All clients, people, prior events, operating capabilities, policies, contracts and numerical outcomes in this package are synthetic. They do not represent Capital Group records or commitments.

The demonstration focuses on the call’s specific use case: use historical onboarding evidence and current client constraints to anticipate watch areas, recommend preventive actions, and propose a client-specific workflow with human review. It ends with an accepted **working planning draft**, not an opened account or an authorized investment instruction.

## What you are demonstrating

“A new client does not fit one previous onboarding. Different precedents help with different decisions. The assistant finds those precedents, explains where the analogy holds and breaks, checks current capabilities, and proposes a route that changes as people supply new evidence.”

The hosted walkthrough contains prepared AI-authored analysis and six logical agent roles. It does **not** call a live model or run autonomous agents. Source search, date/version filtering, cohort calculations, illustrative rule tests, review actions and exports run locally. Semantic comparisons and scenario-specific recommendations are prepared outputs. Use the included live-session prompts with the initial corpus to demonstrate fresh model reasoning in an AI workspace; do not describe the hosted replay as live generation.

No Capital Group systems, SharePoint, Appian, Salesforce, investment platform, regulation database or client communications are connected. References to those systems describe the supplied operating process or a proposed production design.

## The client and the interacting constraints

Alpenridge Pension Foundation is a fictional Swiss pension client planning a USD-equivalent 250m global investment-grade bond separate account. Its target funding date is 23 November 2026. The demo begins at a fictional evidence snapshot of 14 September 2026.

| Dimension | New-client request | Why it matters |
|---|---|---|
| Reporting | Weekly CHF performance, attribution and ESG analytics, Monday 08:00 Zurich | Current synthetic capability supports Tuesday holdings and monthly validated analytics; the custodian supplies positions, not attribution inputs. |
| Investment restrictions | Policy says tobacco ≥5%; draft IMA says >5%; “no thermal coal” is undefined | The same security can receive different results. Coal activity, operator, threshold and data treatment require interpretation. |
| Funding | 200m of existing bonds and 50m cash | Three 10m positions expose threshold, activity-definition and missing-data questions. |
| Instruments | FX forwards and interest-rate futures at inception | No dated current readiness commitment is supplied. A staged route is an option, subject to PM/client approval. |
| Domicile | Switzerland | Route applicable-requirement questions to Legal; do not invent a statutory reporting obligation. |
| Governance | Opportunity won; prerequisite briefs and applicable approvals recorded complete in this scenario | Focus the demo on tailored planning. Returned briefs still contain open watch areas. |

The complexity comes from the interactions. A restriction interpretation changes the transfer screen. Transfer dispositions affect funding instructions. Reporting scope affects the annex and feed validation. Derivative readiness can change the launch route. None of these decisions is resolved by extracting a few fields from a PDF.

## The corpus you can actually inspect

The complete package has **54 documents, 157 individually identified passages, and 12 closed historical cases**:

| Corpus group | Documents | Examples |
|---|---:|---|
| New client | 8 | RM handover, draft IMA, trustee policy, transfer note, prerequisite register, custodian email, two later client clarifications |
| Historical cases | 41 | Intake emails, exception/preventive-action records, retrospectives, accepted service annexes, restriction redlines and transition decisions |
| Current/archived operating guidance | 5 | Current reporting capability, superseded pilot note, rule dictionary, transition/readiness note and Swiss-client review routing |

Each document has an ID, case, owner, date, type, version, status and downloadable original Markdown or email file. Every passage has an identifier such as `H05-S§1`. The manifest includes file hashes. These IDs are source locators, not model confidence scores.

The initial live-session corpus contains 52 documents: it withholds N07 and N08, but includes the explicitly superseded O02 to test authority handling. The hosted initial search excludes both future documents and superseded guidance, leaving 51 eligible documents. Inspecting archives can be enabled separately. The complete corpus is suitable for presenter preparation; use the initial snapshot for an unscripted first run so later answers cannot leak into the initial analysis.

## Run of show: approximately 20 minutes

### 1. Open the client brief — minutes 0–2

**Action:** Reset the demo. Select “14 Sep · Initial request.” Open N01’s reporting passage, then N02’s tobacco clause and N03’s policy clause.

**Say:**

> “Our task is to suggest a workable route for this specific client. The request sounds familiar, but familiarity can be misleading. Another Swiss pension client received weekly reporting; that does not yet tell us what the service contained. Even the draft investment terms disagree at an exact numerical boundary.”

**Ask the assistant in a live run:**

> “Read the current-client documents. Separate established facts, ambiguous requirements, document conflicts and missing evidence. What distinct questions should the historical search answer? Cite each point.”

**Expected output:** Three main evidence searches—reporting service definitions; restriction interpretation; transfer/derivative dependencies—plus an explicit country-requirements evidence gap. It should recognize that the target date is proposed, not a demonstrated feasible completion date.

**Human checkpoint:** The Operations reviewer confirms the interpreted context. An incorrect client profile should be corrected before precedent selection.

### 2. Retrieve actual source passages — minutes 2–5

**Action:** Open Evidence corpus. Run the reporting query: `weekly CHF attribution Monday reporting holdings`. Click a result to inspect the full source and the highlighted cited passage. Then open Agent workbench → Precedent agent to compare lexical candidates with the prepared semantic selection.

**Say:**

> “Search returns candidate passages. The useful judgment comes next: what was requested, what was finally accepted, what failed, and whether today’s capability matches the historical situation. The assistant should not equate every occurrence of ‘weekly reporting.’”

**Concrete evidence chain:**

| Source | What the passage establishes | Use in the recommendation |
|---|---|---|
| N01§2 | New client asks for Monday weekly attribution, performance and ESG analytics | Defines the requested service |
| O01§1 | Current synthetic service supports Tuesday holdings and monthly analytics | Establishes a present capability mismatch |
| N06§1 | Current custodian feed is positions-only on Tuesday | Explains an upstream data dependency |
| H01-S§1 | Alpinecrest ultimately accepted holdings/monthly analytics | Prevents confusing initial request with delivered service |
| H05-S§1 | Rhinebridge agreed that narrower service in week 1 and tested a sample | Supplies a preventive action that worked |

Enable “Include superseded documents” and search `weekly CHF pilot`. Open O02. Its broad pilot wording looks promising, but the retirement notice and current O01 prevent reuse as a capability commitment. Turn archives off before continuing.

**AI capability:** Semantic comparison, version/authority assessment and evidence synthesis across documents. The browser’s search itself is lexical; the semantic selection is prepared AI analysis, explicitly labeled.

### 3. Find a different precedent for each issue — minutes 5–8

**Action:** Open Comparable cases. Contrast H01, H02, H03, H05 and H11.

**Say:**

> “There is no single nearest client that provides the whole workflow. Alpinecrest helps explain reporting rework. Northbridge is a US endowment, but it has the exact same tobacco wording conflict. Seabrook suggests a conditional staged route. Rhinebridge provides counterevidence and a successful preventive action. The equity case remains searchable, but is a weak primary analogue.”

| Case | Useful similarity | Difference that must remain visible |
|---|---|---|
| H01 Alpinecrest | Swiss pension, CHF weekly attribution request, mixed funding | Different custodian/platform; its service was narrowed |
| H02 Northbridge | Exact >5% versus ≥5% tobacco conflict | US cash-funded mandate; no Swiss or coal precedent |
| H03 Seabrook | Transfer exceptions and derivative readiness affected launch scope | Insurance investment objectives differ; staging requires new approval |
| H04 Lakeshore | Multiple interacting workstreams | Historical rework intervals overlap and cannot be summed |
| H05 Rhinebridge | Similar initial reporting request; no reporting rework | Success followed early scope narrowing, not weekly attribution delivery |
| H08 Cedar Vale | ESG mapping, unknown data and a negotiated coal definition | Its ≥10% extraction-only rule cannot be assumed for Alpenridge |
| H11 Eastgate | Institutional separate-account onboarding | Equities, USD monthly reporting, cash and standard guidelines provide weak explanatory overlap |

**Ask in a live run:**

> “Which case looks relevant at first but is misleading? Which geographically different case is useful? Give the supporting passages and explain the limitation of each analogy.”

**Expected output:** Useful similarities and dissimilarities, not a list of high-confidence match percentages. In this curated corpus, the five most useful cases are selected by issue; no calibrated semantic similarity score is claimed.

### 4. Derive risks and preventive recommendations — minutes 8–11

**Action:** Open Risk recommendations. Show R1’s source facts, inference, counterevidence, uncertainty and human decision. Then show R2 and R4.

**Say:**

> “The reporting mismatch is established by current documents. The risk of repeated negotiation and configuration work is an inference supported by historical events. A proposed mitigation is early service definition and sample acceptance. We can show why we believe the action is useful without inventing a probability or promising a launch date.”

**Numerical evidence you can defend:** The reporting cohort contains H01, H04, H05, H06 and H10: global IG bond mandates with CHF reporting and an initial weekly-attribution request. Recorded reporting rework is 12, 9, 0, 7 and 11 business days. Four of five recorded rework. Among the four affected cases, the sorted values are 7, 9, 11, 12 and the median is 10 business days.

This is a selected synthetic sample, not a representative population or a model validation set. Do not call 4/5 an 80% new-client risk probability. Do not use the conditional median as a forecast of launch delay. H05 belongs in the initial-request cohort even though it accepted a narrower final service; removing successful mitigation cases would distort that question.

**A realistic risk register entry:**

> R1 — High attention. The proposed service exceeds current documented capability. Without early agreement, annex and reporting setup may need to be repeated. Client Reporting and the RM should offer the supported Tuesday holdings/monthly analytics service or seek separate bespoke feasibility assessment. Client acceptance, Legal annex alignment and feed validation remain human-owned. No launch-date impact is quantified.

R4 is more cautious: the current corpus does not establish that derivatives will be late. It establishes a readiness dependency without a dated commitment. The correct recommendation is to obtain current readiness dates and assess scope options, not predict a delay as a fact.

**AI capability:** Contextual inference from failure mechanisms, counterexamples and present constraints; explicit abstention when the evidence does not support a claim.

### 5. Translate restriction intent into reviewable implementation — minutes 11–14

**Action:** Open Restriction analysis. Read the side-by-side clauses and the illustrative rule tests. Expand the locally executed test results.

**Say:**

> “The assistant can find a clause precedent and propose a precise implementation discussion. It must not silently resolve legal intent. ‘More than 5%’ and ‘5% or more’ behave differently for a real position in this synthetic portfolio.”

**Example:** Alder Tobacco Holdings is valued at 10m and has exactly 5.0% tobacco-production revenue. A `>5` operator does not exclude it under that clause; `>=5` does. Northbridge’s precedent shows how its team resolved that conflict, not what Alpenridge has authorized.

**Example of a useful draft:**

> “If the client confirms the policy’s threshold, propose ‘5% or more of annual revenue from tobacco production,’ with the approved issuer/parent mapping, provider, date and unknown-data treatment specified in the implementation schedule. Please confirm whether this is the intended interpretation.”

For coal, the assistant should ask whether the exclusion concerns extraction, generation, any involvement, a revenue threshold or a named list. Cedar Vale’s ≥10% extraction-only rule is an option for discussion. It cannot be inferred from “no thermal coal.”

The illustrative screen assumes tobacco ≥5%, coal extraction ≥10%, missing data to review and a >30-calendar-day stale-data review boundary. Ten executable local tests cover below/at/above thresholds, nulls, freshness and unresolved mapping. The code is demonstration pseudocode, not native CSTAR configuration.

Under those explicitly unapproved assumptions: Alder 10m and Granite Basin 10m are excluded; Meridian 10m requires data review. The potentially affected 30m is 12% of proposed 250m NAV. It is not an expected loss. If the client and PM chose to retain all 30m externally and replace it with cash, the illustrative mix is 170m securities plus 80m cash. No disposition is automatic.

**Human checkpoint:** Client/Legal confirms intent; FI PC confirms implementability and tests; client/PM decides disposition; Transition Management validates instructions.

### 6. Build the tailored workflow and challenge it — minutes 14–17

**Action:** Open Tailored workflow. Show evidence and dependencies on T02, T03, T06, T07, T09 and T11. Edit one owner or planning window with a rationale. Open Evidence reviewer to inspect unsupported claims it rejects.

**Say:**

> “We retain the five broad phases from the call, but the evidence changes the work within them. Reporting definition and investment interpretation move into intake. The sample feed and readiness discovery proceed in parallel. The definitive transfer screen depends on approved restriction semantics. A launch-scope decision waits on the relevant evidence.”

| Task | Why it belongs in this plan |
|---|---|
| T02 service-scope agreement during intake | Current reporting mismatch and Rhinebridge’s successful preventive action |
| T03 early Legal/FI PC/client interpretation | Exact tobacco conflict and undefined coal scope |
| T06 sample and benchmark-input reconciliation | A positions feed cannot establish attribution support |
| T07 boundary/data validation | Prior clause implementation and known null/mapping failure modes |
| T09 derivative readiness discovery | Current readiness dates are missing and a staged precedent exists |
| T11 in-kind screen and disposition decision | Three indicative holdings require approved interpretation/data |

The workflow includes paperwork, operational setup, funding and first-cycle post-funding checks, but the demo does not execute those tasks. Timing labels are illustrative windows for review. It does not predict staffing capacity or external response times.

The evidence-review role rejects five tempting claims: a past Swiss client proves current weekly attribution capability; 4/5 means an 80% forecast; Swiss law requires weekly reporting; a prior coal rule can be copied; workstream rework days can be added into launch delay.

### 7. Let human input change the answer — minutes 17–20

**Action A:** In Human review, challenge the risk with “Rhinebridge did this successfully.” Open H05-S§1. The answer should preserve both its success and its narrower service definition.

**Action B:** Accept revision 1 as a working planning draft using a demonstration reviewer name and rationale. Then apply the 15 September reporting clarification N07.

**Say:**

> “The client now says that weekly means Tuesday holdings; attribution and ESG can be monthly. The route changes because the requirement changed. The original mismatch is reduced, but the draft annex and the account-specific feed still require work.”

**Expected change:** R1 reduces; T02 becomes recording/aligning the clarified service. Sample validation and Legal/client annex acceptance remain. Restriction, transfer and derivative concerns remain. Previous planning acceptance is invalidated.

**Action C:** Apply N08 on 16 September: all-cash inception and proposed later derivatives.

**Say:**

> “The client has changed the constraints again. In-kind screening no longer gates inception, because the legacy securities will stay with the outgoing manager. ESG validation still governs future purchases. Derivatives follow a separately reviewed readiness route, with day 30 only a proposal.”

**Expected change:** T11 leaves the inception route. T12 becomes confirmation of 250m cash funding. T10 no longer depends on T09 for derivative activation, although PM/client acceptance of bond-only scope remains necessary. T14 provides later activation review with T09 and funding dependencies. The same five broad phases remain.

**Action D:** Review and accept the updated planning draft; export the review packet. It contains the scenario revision, risk rationale, source references, tasks, reviewer edits and decision history. It does not authorize the unresolved legal, service, investment or operational decisions.

## Questions the client may ask

**“Where exactly is the AI?”**

In interpreting ambiguous intent, decomposing the search into decision-specific questions, identifying semantic analogies across differently worded documents, explaining material differences, joining current capability with prior outcomes, drafting implementation options, composing task dependencies and checking unsupported conclusions. The hosted UI replays prepared versions of these outputs. The live-session prompts let a model perform those tasks afresh against the supplied corpus.

**“Why agents rather than one prompt?”**

Each logical role has a distinct contract, evidence inputs and output schema. That makes retrieval, interpretation, drafting and critique separately inspectable. These roles can be implemented by one model with staged prompts; six roles do not inherently require six independently running services. Whether a multi-agent architecture improves quality needs evaluation, not an assumption.

**“Are the forecasts trustworthy?”**

The demo makes evidence-based watch-area predictions, not calibrated probabilities. Production calibration would require sufficiently representative outcomes, a consistent definition of rework/delay, dated snapshots to avoid future leakage, known coverage, and held-out evaluation. Owner-reviewed schedule inputs are necessary before estimating completion dates.

**“Can it find legal requirements for a Swiss pension?”**

This package deliberately contains no authoritative regulation corpus. The correct result is an applicability-review request and an explicit evidence gap. A production assistant would need permissioned, current authoritative sources and Legal review. Domicile alone cannot determine every requirement.

**“How would we evaluate it?”**

Use the included evaluation checks: retrieve the exact conflicting clauses; prefer O01 over O02; preserve H05 as preventive counterevidence; do not import the coal threshold; distinguish null from zero; do not infer current derivative delay; explain task dependencies; and revise only affected conclusions after N07/N08. Score source validity, relevance, unsupported claims and plan consistency separately.

**“What should we conclude from this demo?”**

> “The proposed assistant makes onboarding judgment reviewable: it shows which past experiences matter, why a risk applies, which action could prevent rework, and what changes when a person supplies new information.”
