**Separate Account Navigator — revised demo: institutional memory, risk anticipation and tailored workflows**

The call's primary use case is to use prior onboarding conversations, contracts, implementation records and operational outcomes to advise on a new client. Extraction provides inputs. The useful output is a reasoned proposal: relevant precedents, potential problems, preventive tasks and accountable human decisions.

The new Onboarding intelligence view makes this the primary journey. It uses 12 fictional historical clients, explainable match scoring, calculated historical cohorts and a context-dependent workflow draft. It does not call a live LLM or a trained predictive model. All histories and outcomes are synthetic; the counts are not Capital Group statistics.

**1. Find comparable clients — 2 minutes**

Open Onboarding intelligence → Comparable cases. The current planning snapshot is Alpenridge: Swiss pension foundation, global IG bonds, CHF weekly attribution, mixed funding, bespoke restrictions and derivatives requested in ten weeks.

Say:

> “For this new client, the assistant should first ask: which previous onboardings teach us something useful? It searches for similarities in the operational requirements, rather than simply matching the client's name or country.”

Inspect H01 Alpinecrest and H04 Lakeshore. Both match the scored dimensions. Show the historical intake, exception review, resolution and limitation. Then inspect H02 Northbridge: it is a weaker overall match but contains a highly relevant restriction-interpretation pattern.

> “A prior client can be useful for one problem and inappropriate for another. Northbridge helps us understand the tobacco threshold issue. It does not establish Swiss legal requirements or this client's custody arrangements.”

Match points are not confidence probabilities. The score uses strategy 20, reporting 15, funding 15, derivatives 15, bespoke guidelines 15, domicile 10, currency 5 and client type 5. Size is contextual; setup window also selects the derivative-risk cohort.

**2. Anticipate potential problems — 2 minutes**

Open Risk forecast. These are hypotheses about problems that may occur later, separate from confirmed conflicts already found in the new client's documents.

| Potential problem | Synthetic comparable-case observations | Earlier action proposed |
|---|---|---|
| Reporting-service renegotiation | 4 of 5 same-strategy CHF weekly-attribution cases | Validate service capability during intake, before commitment |
| Guideline interpretation/recoding | 5 of 7 same-strategy bespoke-guideline cases | Resolve scope, thresholds and mapping before coding |
| Late change to in-kind funding | 5 of 8 same-strategy mixed-funding cases | Obtain and screen the custody file before agreeing the funding mix |
| Derivative setup misses requested launch | 5 of 6 same-strategy derivative cases with <=10-week windows | Validate dependencies before committing the date; prepare a staged option |
| CHF benchmark/data mapping rework | 3 of 5 same-strategy CHF cases | Rehearse the mappings before the first reporting rehearsal |

Say:

> “We have not yet reached the reporting setup stage. However, the historical cases suggest this could become a problem. Four of five matching synthetic cases recorded reporting rework. The assistant therefore proposes a reporting feasibility review now, before a service promise becomes a late negotiation.”

Inspect supporting cases and cases with no recorded issue. H05 Rhinebridge completed capability validation in week 1 and had no recorded reporting rework. It supports the proposed preventive action; it does not prove that the action caused the outcome or that the same service is feasible today.

> “The prediction needs evidence and limits. This count is historical incidence in a small invented sample, not an 80% validated probability for Alpenridge. A real predictive model would require enough labelled cases, held-out evaluation and calibration.”

Median reporting rework in the affected fictional cases is 10 business days (7, 9, 11, 12). This is a workstream observation, not a ten-day forecast of launch delay. Workstreams overlap; do not add these medians.

**3. Generate a tailored workflow — 2 minutes**

Open Generated workflow. Each task is linked to a potential risk and its historical evidence. It includes an owner, timing, steps, completion evidence and a human gate.

Show the reporting task:

- Trigger: weekly CHF attribution requested; relevant prior cases recorded reporting rework.
- Timing: information intake, before service commitment.
- Owner: Client Reporting + RM.
- Work: validate output/cutoff, inspect a sample, confirm upstream data, obtain client agreement.
- Completion evidence: capability assessment, sample output and accepted service decision.
- Human gate: Reporting confirms feasibility; client and Legal accept the schedule.

Say:

> “The output is now a proposed route through this particular onboarding. The assistant recommends bringing the reporting review forward because of the historical pattern. It also proposes early custody screening and derivative dependency checks for the requirements in this case.”

Explain that the seven operational workstreams still exist. These are tailored preventive tasks inside that structure, not permission to bypass normal controls.

**4. Show the human changing the recommendation — 1 minute**

Use Edit owner, timing or applicability on a task. Change its timing to “Before CORG condition closure” and add a rationale such as “Validate the service before the case's commercial conditions are closed.” A reviewer can also omit a proposed task with a reason; omission does not waive a mandatory operational control.

Select GCS Operations and Review workflow draft. Enter:

> “Reviewed the precedents and limitations. Accept the proposed early reporting, guideline, transfer and derivative reviews for this planning context. Specialist and funding approvals remain separate.”

Acknowledge the review and accept the draft.

**5. Prove that client context changes the route — 1 minute**

Choose Try cash-only, monthly reporting, no derivatives. This is a what-if scenario; it does not amend the operational Alpenridge account.

Show the changes:

- Comparable-case ranking changes.
- The reporting-renegotiation, in-kind-transfer and derivative-readiness hypotheses no longer apply under the selected criteria.
- The related three preventive tasks are removed from this draft.
- Bespoke-guideline and CHF-mapping tasks remain.
- Previous workflow-draft acceptance is reopened because the context changed.

Say:

> “The client context determines the advice. When these requirements disappear, their exception-specific tasks disappear too. The standard onboarding controls remain. The reviewer can inspect the revised proposal before accepting it.”

Optionally restore Alpenridge, then exclude H01 with the reason “Different provider dependency; remove this analogue for comparison.” The reporting cohort changes from 4/5 to 3/4 and the closest case becomes H04. Show that the historical evidence selection changes the analysis, rather than leaving a hard-coded answer in place.

**6. Continue into the operational demonstration — optional 5–8 minutes**

Restore Alpenridge context. Open Case overview and continue the previously built scenes: missing governance evidence, restriction clarification, USD 30m transfer issue, reporting agreement, earlier launch request and independent funding release. These scenes demonstrate execution and controls after the history-informed planning discussion.

The original PDF presenter guide supports that operational portion. This new script should be the lead narrative for the transcript's use case.

**Where live AI belongs**

| Step | Live AI responsibility | Deterministic / human responsibility |
|---|---|---|
| Prior-case discovery | Understand current context, semantically retrieve and rerank prior conversations, contracts and cases | Enforce access rights and retrieve source versions |
| Case comparison | Explain relevant similarities, differences, root-cause patterns and transfer limits | Reviewer accepts or excludes analogues |
| Risk anticipation | Form evidence-backed risk hypotheses; use a validated statistical predictor where available | Compute observed statistics; label uncertainty; specialist validation |
| Workflow proposal | Synthesize tasks, dependencies, owners and completion criteria from requirements, history and constraints | Validate mandatory gates; human edits and accepts draft |
| Changes | Reassess affected risks and propose a revised route when new information arrives | Invalidate affected approvals; preserve audit; owners reapprove |
| Contract-to-rule assistance | Compare precedent wording and suggest interpretation questions and candidate implementation language | Legal and FI PC decide and test before production release |

**What the current prototype actually implements**

The interface recalculates structured similarity, cohort counts and context-selected task proposals. Historical narratives and preventive-action descriptions are authored simulation fixtures. It does not perform live semantic retrieval or language-model synthesis, and it does not prove calibrated prediction quality. This is a concrete demonstration of the target interaction and evidence chain, ready to be connected to approved histories and models in a pilot.
