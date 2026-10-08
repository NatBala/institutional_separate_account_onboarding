/* Tab 1 · Explains the multi-agent system: who does what, what flows between agents, and where humans decide. */
(function(){
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const agents=[
 {id:'A1',name:'Context agent',group:'intake',question:'What is the client actually asking for?',
  role:'Reads the onboarding package and turns an ambiguous client request into structured, cited requirements.',
  does:['Inventories and parses the six current-client PDFs: request, draft IMA, investment policy, transfer list, prerequisites and custodian response.','Classifies five requirement areas: reporting, restrictions, funding route, derivatives and legal applicability.','Surfaces conflicts between documents, for example the IMA says >5% tobacco while the policy says ≥5%.','Re-reads only the changed requirement when a new client email (N07, N08) arrives.'],
  inputs:'N01–N06 client documents; N07/N08 when they arrive',output:'Structured client context with source citations',to:'Operations review (H1), then the Precedent agent',
  guard:'Flags conflicts and open questions. It does not decide what the client meant.'},
 {id:'A2',name:'Precedent agent',group:'intake',question:'Which past clients teach us something useful?',
  role:'Searches the 54-document corpus and 12 closed cases issue by issue, not by overall client similarity.',
  does:['Runs three focused searches: reporting service, restriction wording and launch dependencies.','Explains what is similar and what is materially different for each historical case.','Keeps successful counterexamples, such as Rhinebridge (H05), next to the failures.','Rejects weak analogues, such as Eastgate (H11), even when they look similar at first glance.'],
  inputs:'Reviewed client context; evidence corpus',output:'Issue-level precedent set with passages',to:'Operational risk agent and Investment risk agent (in parallel)',
  guard:'A precedent shows a mechanism. It is not proof of what the firm can deliver today.'},
 {id:'A3',name:'Operational risk agent',group:'risk',question:'Can we deliver, fund and launch this account as requested?',
  role:'Assesses whether operations, reporting, funding and legal readiness can support the requested route.',
  does:['R1 · Reporting: compares the requested Monday CHF analytics with the supported Tuesday holdings / monthly analytics service.','R3 · Funding route: classifies cash versus in-kind funding and the transfer-screening dependencies it creates.','R4 · Derivatives: checks whether documentation, broker and operations readiness can support day-one FX forwards and futures.','R5 · Legal applicability: detects that no authoritative Swiss determination exists and routes it to Legal.','Rates each area Low, Medium or High operational attention and names the preventive action and owner.'],
  inputs:'Client context, precedents, operating guidance O01, O04 and O05',output:'Operational risk register with actions and owners',to:'Playbook agent',
  guard:'Historical counts are described, never turned into probabilities or launch forecasts.'},
 {id:'A4',name:'Investment risk agent',group:'risk',question:'Will the portfolio follow the client’s investment intent?',
  role:'Translates restriction language into testable rules and shows what each interpretation does to the portfolio.',
  does:['R2 · Policy intent: compares the tobacco threshold (>5% versus ≥5%) and the undefined “no thermal coal” clause.','Drafts the interpretation questions: activity, threshold, issuer-parent mapping, data provider, freshness and missing data.','Runs deterministic boundary tests locally (4.99 / 5.00 / 5.01%, missing data, 30 / 31-day freshness).','Shows the portfolio consequence: 20m conditionally excluded and 10m needing data review, 12% of proposed NAV.'],
  inputs:'Draft IMA, investment policy, transfer list, guideline precedents H02 and H08, O03',output:'Interpretation options, boundary-test evidence and investment risk register',to:'Playbook agent; open questions go to Legal, FI PC and the client',
  guard:'Never chooses the client’s intent. Illustrative rules stay unapproved until humans sign off.'},
 {id:'A5',name:'Playbook agent',group:'plan',question:'What is the right route through onboarding for this client?',
  role:'Combines both risk assessments into a tailored five-phase workflow with owners, dependencies and evidence.',
  does:['Keeps the familiar phases: Intake, Paperwork, Operational setup, Funding and Post-funding.','Pulls blocking decisions (reporting scope, restriction intent, legal applicability) forward into intake.','Runs independent work in parallel and records why every task exists and what it depends on.','Re-plans when new evidence changes a requirement and marks unchanged analysis as reused.'],
  inputs:'Client context, operational risk register, investment risk handoff',output:'Proposed task plan (T01–T14)',to:'Key players agent',
  guard:'Timing windows are planning proposals. No tasks are created in Appian or any other system.'},
 {id:'A6',name:'Key players agent',group:'plan',question:'Who is actually involved, and who must act next?',
  role:'Turns the proposed route into an accountability map: for every responsibility, the internal owner, the external contact and the escalation point.',
  does:['Names the internal owner and external counterpart for contracting, restrictions, reporting, funding, billing, AML/KYC and servicing.','Reads names and roles only from the package: Maya Shah (RM), Elena Weber (client investment office), Orion Custody, the consultant and trustees.','Lists who must act now, who is blocked and what they wait on.','Flags contacts missing from the package, such as client legal counsel and client finance, so the RM can request them.'],
  inputs:'Client context, proposed task plan, N01, N03, N05, N06 and N07/N08 when they arrive',output:'Responsibility matrix with owners, contacts, escalation points and blockers',to:'Evidence reviewer',
  guard:'Does not contact anyone or assign work in Appian. Missing contacts are requested, never guessed.'},
 {id:'A7',name:'Evidence reviewer',group:'plan',question:'Is every conclusion actually supported?',
  role:'Challenges the draft before a person sees it: checks source authority, dates, counterexamples and dependency logic.',
  does:['Strikes tempting shortcuts, for example treating “4 of 5 cases” as an 80% forecast.','Stops a historical service (Rhinebridge) being presented as current capability.','Stops another client’s coal definition (Cedar Vale) being reused as Alpenridge’s intent.','Checks the workflow dependencies are complete and consistent.'],
  inputs:'All agent handoffs and their cited passages',output:'Review findings and a draft ready for human judgment',to:'Planning review (H2)',
  guard:'Cannot approve anything; it only clears the draft for human review.'}
];
const humans=[
 {id:'H1',name:'Operations confirms the client context',when:'After the Context agent',detail:'GCS Operations checks the extracted requirements and open questions before any historical search starts.'},
 {id:'H2',name:'Planning review',when:'After the Evidence reviewer',detail:'A reviewer can challenge a precedent, introduce new client evidence, edit ownership and accept a working draft. Legal, FI PC, PM, Client Reporting and the client keep their decisions.'}
];
const groupLabel={intake:'Understand the request',risk:'Assess risk in parallel',plan:'Plan and verify'};
function node(a){return `<a class="sys-node sys-${a.group}" href="#sys-${a.id}"><b>${a.id}</b><span>${esc(a.name)}</span></a>`;}
function gate(h){return `<div class="sys-gate" title="${esc(h.name)}"><i>◇</i><span>${h.id} · Human</span></div>`;}
function pipeline(){const [a1,a2,a3,a4,a5,a6,a7]=agents;return `<div class="sys-flow" aria-label="Agent pipeline">
 <div class="sys-stage"><div class="sys-stage-label">${groupLabel.intake}</div><div class="sys-row">${node(a1)}<span class="sys-arrow">↓</span>${gate(humans[0])}<span class="sys-arrow">↓</span>${node(a2)}</div></div>
 <span class="sys-arrow sys-arrow-big">→</span>
 <div class="sys-stage"><div class="sys-stage-label">${groupLabel.risk}</div><div class="sys-parallel">${node(a3)}${node(a4)}</div><div class="sys-stage-note">Same evidence snapshot, run side by side</div></div>
 <span class="sys-arrow sys-arrow-big">→</span>
 <div class="sys-stage"><div class="sys-stage-label">${groupLabel.plan}</div><div class="sys-row">${node(a5)}<span class="sys-arrow">↓</span>${node(a6)}<span class="sys-arrow">↓</span>${node(a7)}<span class="sys-arrow">↓</span>${gate(humans[1])}</div></div>
</div>`;}
function card(a){return `<article class="sys-card sys-${a.group}" id="sys-${a.id}"><header><span class="sys-id">${a.id}</span><div><div class="eyebrow">${groupLabel[a.group]}</div><h2>${esc(a.name)}</h2></div></header><p class="sys-question">“${esc(a.question)}”</p><p>${esc(a.role)}</p><h3>Responsibilities</h3><ul>${a.does.map(d=>`<li>${esc(d)}</li>`).join('')}</ul><dl class="sys-io"><div><dt>Reads</dt><dd>${esc(a.inputs)}</dd></div><div><dt>Produces</dt><dd>${esc(a.output)}</dd></div><div><dt>Hands off to</dt><dd>${esc(a.to)}</dd></div></dl><p class="sys-guard"><b>Boundary:</b> ${esc(a.guard)}</p></article>`;}
function frame(){return `<div class="pagehead"><div><div class="eyebrow">How the system works</div><h1>A multi-agent system for client onboarding</h1><p>Seven specialist agents turn the Alpenridge onboarding package into a tailored, evidence-backed plan. Each agent has one job and passes a structured, cited handoff to the next. People make every decision that matters.</p></div><div class="actions"><button class="btn primary" data-view="run">Watch the agents run</button><button class="btn" data-view="workflow">Explore workflow & risk</button></div></div>
<div class="metrics"><div class="metric"><strong>7</strong><span>Specialist agents</span></div><div class="metric"><strong>2</strong><span>Human checkpoints</span></div><div class="metric"><strong>54</strong><span>Source documents · 157 passages</span></div><div class="metric"><strong>12</strong><span>Closed historical cases</span></div></div>
<section class="panel"><div class="split"><h2>How work flows between agents</h2><span class="legend">Select an agent to read its role</span></div>${pipeline()}<div class="sys-legend"><span><i class="sys-dot sys-intake"></i>Understand the request</span><span><i class="sys-dot sys-risk"></i>Risk assessment</span><span><i class="sys-dot sys-plan"></i>Planning and verification</span><span><i class="sys-diamond">◇</i>Human decision · playback stops</span></div></section>
<section class="sys-split-explainer panel"><h2>Why two risk agents?</h2><div class="grid equal"><div><h3 class="sys-op">Operational risk agent</h3><p>Asks whether the firm can <b>deliver</b> what was requested: the reporting service, the funding route, derivative readiness and country-specific legal requirements. Its findings change <b>who does what, and when</b>.</p></div><div><h3 class="sys-inv">Investment risk agent</h3><p>Asks whether the portfolio will <b>behave as the client intends</b>: what the tobacco and coal restrictions mean, how they are coded and tested, and which holdings they affect. Its findings change <b>what the portfolio may hold</b>.</p></div></div></section>
<div class="sys-cards">${agents.map(card).join('')}</div>
<section class="panel"><h2>Where people decide</h2><div class="grid equal">${humans.map(h=>`<div class="sys-human"><span class="sys-diamond">◇</span><div><div class="eyebrow">${h.id} · ${esc(h.when)}</div><h3>${esc(h.name)}</h3><p>${esc(h.detail)}</p></div></div>`).join('')}</div><div class="notice"><b>What the system never does:</b> approve contract terms, decide investment intent, create accounts, place trades or move assets. Accepting a working plan coordinates the work; it does not authorize any of these.</div></section>`;}
window.SA_SYSTEM={frame,agents};
})();
