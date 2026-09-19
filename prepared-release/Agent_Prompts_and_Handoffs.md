# Live-session prompts and agent handoff contracts

All sources are synthetic. These prompts are a portable script for fresh model analysis; the hosted walkthrough does not have a live model connection. Running these sequentially in one AI conversation demonstrates logical agent roles, not independently deployed agents. Model outputs may vary; citations and human review are required.

## Session setup

Attach `Corpus_Initial_Snapshot.md` only. It contains the initial-date documents and explicitly superseded O02, but withholds N07/N08. Keep `Corpus_All_Documents.md` and prepared traces out of the live model’s initial context to avoid future-answer leakage. Do not attach this presenter answer key as evidence for the model’s conclusions.

If the workspace supports document search, require the model to use it and return retrieved passage IDs. If the entire file is supplied directly as context, describe that honestly as reasoning over supplied context, not proof of a production retrieval index. The deterministic browser search and the model’s semantic judgment are separate mechanisms.

Paste the operating contract, then each role prompt. Review each output before moving to the next role. If an evidence citation is wrong, require correction rather than carrying the unsupported assertion forward.

## Operating contract

```text
We are demonstrating a fictional institutional separate-account onboarding planning assistant. All documents are synthetic. Use the attached corpus as the source of case facts and operational capabilities; do not invent Capital Group policies or claim actual client history.

Initial evidence cutoff: 2026-09-14. Separate current-client evidence, current operating guidance, historical outcomes, superseded material and missing evidence. Respect explicit supersession. Historical contracts demonstrate what another client agreed; they cannot authorize this client’s interpretation. The latest unsigned document does not automatically override a signed or approved source. When authority or meaning conflicts, identify the human decision required.

For every material claim, provide source document and passage IDs (example: H05-S§1), the smallest supporting quote, and a concise rationale. Quote the supplied text accurately. Separate FACT, INFERENCE, PROPOSED ACTION and UNKNOWN. Do not expose or invent private chain-of-thought; provide an auditable decision summary.

Never treat missing ESG values as zero. Never silently select an investment restriction meaning, infer a law from domicile, equate holdings with attribution, use an obsolete capability as a commitment, add overlapping workstream days, or turn a selected case frequency into a calibrated probability. Do not claim a forecast is validated without evaluation evidence.

Your output is a reviewable proposed onboarding route across intake, paperwork, operational setup, funding and post-funding. Humans own applicability, legal intent, investment suitability, contractual commitments, readiness and any execution. Do not send messages, open accounts, change systems, instruct trades or move assets. Stop after producing each requested handoff for human inspection.
```

## A1 — Context agent

```text
Read N01–N06. Build the new-client context. Identify what is requested, what is agreed, what is only proposed and what is missing. Resolve nothing by assumption.

Return:
1. A compact client profile with evidence for each material field.
2. The reporting service components and timing, separated from each other.
3. A conflict/ambiguity register for contract language and policy.
4. Three focused historical-retrieval questions, each with search terms and the decision it could influence.
5. Questions that require a human or evidence beyond this corpus.

Use handoff fields: context_id, as_of, facts[{field,value,sources}], unresolved[{issue,why_it_matters,sources,decision_owner}], search_questions[{question,terms,decision}].
```

Human checkpoint: verify the client request and the ambiguous terms. Correct any field with a citation before continuing.

## A2 — Precedent agent

```text
Using the reviewed context, retrieve relevant passages from prior intake emails, exception records, accepted service definitions, guideline reviews and retrospectives. Include successful cases and weak/distractor cases, not just failures.

For each decision area, show the retrieval question, candidate source passages, selected cases and selection rationale. Compare requested versus finally accepted service. Distinguish an issue-level analogy from whole-client similarity. Do not assign arbitrary confidence percentages.

Find at least one geographically different useful analogue, one successful preventive-action case, and one superficially relevant case that should not drive the recommendation. Identify current or superseded operating documents that affect whether a precedent can be reused.

Use handoff fields: retrievals[{question,query,candidates[{passage_id,quote}],selected[{case_id,shared_mechanism,material_difference,usable_action,sources}],rejected[{case_id_or_doc_id,reason,sources}]}.
```

Human checkpoint: “Rhinebridge had no reporting rework. Does that invalidate the reporting watch area? Check its accepted service before answering.”

## A3 — Risk agent

```text
Combine the reviewed case comparisons with current client requirements and current operating guidance. Propose a short risk/watch-area register.

For every item, return current triggering fact, historical mechanism, counterevidence, inferred consequence, recommended preventive action, uncertainty, human owner and source citations. Distinguish an established mismatch from a possible readiness risk.

Compute the reporting-rework statistic only for historical global IG bond cases with CHF reporting and an initial weekly-attribution request. Show included case IDs and raw outcomes. If a median is useful, state exactly which observations it summarizes. Explain why neither the frequency nor the median is a calibrated new-client launch forecast.

Do not infer a present derivative delay from historical delays. Do not infer regulatory requirements not contained in authoritative evidence. Do not assign a coal threshold.

Use handoff fields: risks[{id,status,trigger_facts,inference,counterevidence,action,uncertainty,decision_owner,sources}], descriptive_statistics[{selection_rule,case_ids,raw_values,calculation,limits}].
```

Human checkpoint: confirm whether each inference is useful and whether the evidence is sufficient. Challenge any categorical prediction.

## A4 — Restriction interpretation agent

```text
Compare N02/N03 with relevant prior contractual wording and implementation reviews. Produce proposed implementation language and explicit interpretation questions, not an approved rule.

For tobacco, explain the >5 versus >=5 difference and identify the affected indicative holding. For coal, enumerate unresolved meanings and show what prior evidence can and cannot settle. Address issuer/parent mapping, activity fields, provider, data date, missing values, stale data and scope.

Create a candidate pseudocode illustration ONLY under explicitly named unapproved assumptions. Give below/at/above tests, null/freshness tests and scope/mapping checks. State that it is not native CSTAR code. Calculate the conditional portfolio consequence using the indicative source values, preserving the total funding arithmetic and separating excluded from review.

Use handoff fields: comparisons[{current_clause,prior_clause,semantic_difference,sources}], proposed_wording, unresolved_decisions, candidate_assumptions, pseudocode, test_cases[{input,expected,reason}], conditional_impact, approvers.
```

Human checkpoint: “No thermal coal might mean zero tolerance including generation. How does that change your questions and why can’t you simply reuse Cedar Vale?” The desired behavior is to revisit scope and required data, not insist on the prior threshold.

## A5 — Playbook agent

```text
Using the reviewed context, risk register and interpretation questions, generate an onboarding route through the five broad phases. Use the supplied operating roles. Preserve process prerequisites and existing system ownership, but focus on the new-client watch areas.

For every task give its owner, reason, evidence, dependencies, proposed relative timing and human decision. Explain what moves earlier compared with starting all reviews in their usual late workstream windows. Separate work that can run in parallel from decisions that must precede another activity.

Do not fabricate a completion-date prediction. Treat the client target and relative planning windows as proposals. Do not execute tasks. Ensure that any staged route requires PM/client suitability and scope decisions plus controls preventing early activation.

Use handoff fields: tasks[{id,phase,action,owner,depends_on,proposed_window,risk_ids,evidence,human_gate}], route_options, unresolved_decisions, schedule_limits.
```

Human checkpoint: edit one owner or proposed window with a reason. Require a revised plan version showing the change.

## A6 — Evidence reviewer

```text
Review the previous outputs critically against the source text. Check every material citation for existence, support, date, status and applicability. Look specifically for unsupported current capability claims, ignored counterevidence, imported coal definitions, legal assumptions, future information, null-to-zero conversion, unsupported probabilities and additive rework estimates.

Check the workflow graph for missing or circular dependencies and confirm that human decisions remain with accountable roles. List supported conclusions, required corrections and unresolved items. Do not rubber-stamp the draft because another role produced it.

Use handoff fields: findings[{claim,verdict,evidence,correction}], dependency_checks, unresolved_human_decisions, draft_readiness. End with a concise review request to GCS Operations; no external action.
```

## Human update 1 — N07

Now attach `corpus/N07.eml`, or paste its complete content. Then ask:

```text
Advance the evidence cutoff to 2026-09-15. The client supplied N07. Update only conclusions affected by this evidence. Show a before/after table for the risk register and workflow, with citations and the causal reason for each change. Keep unaffected restrictions, funding and derivative questions intact. Identify which prior review decisions need revalidation and which contract/sample checks remain.
```

## Human update 2 — N08

Attach `corpus/N08.eml`, or paste its complete content. Then ask:

```text
Advance the cutoff to 2026-09-16. N08 proposes all-cash inception and later derivatives. Revise the dependency plan. Identify tasks removed from the inception route, tasks retained for new purchases, and a separate later activation decision. Do not treat day 30 as a guarantee or client email as an executed IMA amendment. Produce a review packet with current risks, evidence, plan version, human edits, unresolved approvals and the changes from the initial proposal.
```

## An unscripted robustness challenge

After the planned sequence, ask one question not answered by a prepared scenario:

```text
Assume the client now clarifies that thermal coal means any extraction or power-generation involvement, with a zero-revenue threshold, and that unknown provider data must block purchases pending review. What evidence and tests need changing? Which previous case remains useful, which assumption no longer applies, and which parts of the current workflow remain unchanged? Distinguish new hypothetical instructions from source facts, and do not invent generation data for Granite Basin.
```

Evaluate whether the model identifies the missing power-generation field, updates the interpretation and validation tasks, keeps reporting conclusions intact, and requests human confirmation of exact operator semantics for “any involvement” versus a numerical threshold. This demonstrates fresh reasoning; the static hosted replay does not implement this free-form change.

## Production design boundary

These prompts specify logical responsibilities and handoffs. A connected implementation could combine permission-aware document retrieval, lexical plus embedding candidates, model reranking, source-version checks, schema validation, deterministic calculations, an evidence critic, durable human review, and approved workflow-system actions. The design does not require a particular vendor or an assumed six-service architecture.

Before making accuracy or time-saving claims, evaluate on held-out real cases with appropriate access, snapshot dates and outcome definitions. Measure passage retrieval, source support, missed watch areas, unnecessary escalations, rule-interpretation errors, workflow dependencies and reviewer usefulness separately. Synthetic outcomes are a demonstration fixture, not a benchmark of actual performance.
