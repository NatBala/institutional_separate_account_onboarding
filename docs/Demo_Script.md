# Onboarding Navigator: demo script

About 25 minutes end to end, with a 10-minute cut at the end. Built for the `clean-ui` build (five tabs, seven agents).

**Story order:** where we are → what this client needs → who is involved → how the agents built the plan → what-if.
For leadership audiences, open with the Leadership view, then go to the operator view.

Each scene has three parts:

- **Click** is what you do on screen.
- **Say** is the suggested wording; adapt it freely.
- **Point to** is what the audience should notice.

---

## Before you start (2 minutes, off camera)

1. Run `npm run build`, then `python3 -m http.server 8000 --directory dist`, and open <http://localhost:8000>.
2. Click **Reset workspace** at the bottom of the left rail. This clears the saved run, scenario and what-if.
3. Set the browser zoom so the five stage cards sit on one row (90% on a 1440px laptop screen).
4. Check you are on **01 Onboarding status → Operator view**, and that the forecast funding date reads **Thu 26 Nov**. If it reads anything else, a what-if is still active: open *Dependencies & what-if* and click **No delay**.
5. Have two things ready to say:
   - **Everything is synthetic.** Alpenridge, the 13 other onboardings, the people and the documents are fictional, so this is not a Capital Group record.
   - **Nothing runs live.** No live model or production system is connected. The agent outputs are prepared, while search, scheduling and the date maths run locally in the browser.

---

## Scene 1 · Opening (1 minute)

**Screen:** Onboarding status, Operator view.

**Say:**
> "Last time the feedback was clear. The demo answered 'what are the risks?' but not 'where are we?'. It also needed a clearer view of who is involved and how one framework covers CITs, separate accounts and funds. So today I'll start where an onboarding team starts every morning: the status of an account. After that I'll show how the plan behind it was built."

---

## Scene 2 · Leadership view: the whole book (3 minutes)

**Click:** **Leadership view**, the button at the top.

**Say:**
> "This is the view for a leader. We have 14 onboardings in flight, about $3.9bn. Eight are behind schedule: four off track and four at risk. Nine are due to fund in the next 30 business days."

**Point to, left to right:**

- **By vehicle / By client type.** This answers the questions about CITs versus separate accounts. It shows separate accounts, CITs and mutual funds, and below them direct, consultant-advised, OCIO, sub-advisory, omnibus and MEP/PEP. Each bar is split into off track, at risk and on track.
- **The bottleneck.**
  > "Paperwork is the bottleneck. All four onboardings sitting there need attention, and Legal is the team most often waited on."
- **Risk concentration.**
  > "Contracts and investment restrictions are where our risk sits, mostly in separate accounts. That's what you'd expect from bespoke mandates."
- **Behind schedule table.** Read the top rows:
  > "Northfold's sub-advisory sleeve is six days late on contracts. TrueNorth's pooled employer plan is five days late, also on contracts. And here is Alpenridge: three days late, and the cause is investment restrictions."

**Click:** **Open operator view** on the Alpenridge row.

> "Let's open Alpenridge and see what the onboarding lead sees."

---

## Scene 3 · Operator view: the 30-second read (3 minutes)

**Screen:** the account header and the five stage cards.

**Say:**
> "Here's the 30-second read. Alpenridge is a USD 250m global bond mandate in a separate account, advised by a consultant. The client asked to be funded on Monday 23 November. We now forecast Thursday 26 November, three business days late."

**Point to the stage cards left to right** (each has a status, an owner, a team and an escalation point):

| Stage | Status | Say |
|---|---|---|
| Intake | 🟢 Complete, 7/7 | "Intake is done." |
| Paperwork | 🟡 At risk | "One task is overdue, one is blocked, and the stage end has moved three days." |
| Ops setup | 🟡 At risk | "The delay carries into setup." |
| Funding | 🔴 Off track | "Funding is red because the client's date is missed. For funding we have no tolerance, since that date is a commitment to the client." |
| Post-funding | ⚪ Not started | "Post-funding starts after funding and moves with it." |

> "Every stage shows who owns it and where it escalates. Paperwork is owned by mandate counsel in Legal and escalates to the Head of Legal, Institutional."

**Point to:** **Issues affecting the timeline.**

> "This line is how the demo now ties risk to dates. Before, we'd have said 'restrictions: high risk'. Now we say: *tobacco and coal restriction unclear*. That adds three onboarding days and moves funding from 23 to 26 November. Clearing it needs a Legal review, a Portfolio Control review and a clarification from the client."

> "Next to it is a counter-example: system records are three days overdue but have **no date impact**, because there's slack before funding. Not every late task is a problem, and the screen shows which ones are."

---

## Scene 4 · Drill-down, dependencies, escalation (4 minutes)

**Screen:** *Tasks & escalation* tab, Paperwork drill-down (selected by default).

**Say:**
> "Under each stage is the checklist the team already works from: task, internal owner, external contact, due date, forecast date and status."

**Point to:**

- **P1**, *Client confirms tobacco and coal intent in writing*. It was due Tue 6 Oct and is **Overdue 2d**. The external contact is Elena Weber in the client's investment office.
- **P2**, *Finalise IMA Schedule A*. It is **Blocked by P1**.
- **P6**, *IMA executed*. It is now forecast for Wed 28 Oct.

**Point to the right-hand panel (P1 detail):**
- **Unblocks** lists 15 later tasks.
- **Date impact** is +3 onboarding days.
- **Escalation and communication:**
  > "This is how escalation works. The task owner flagged P1, the onboarding lead was told at one day overdue, and the RM is chasing the client at two days. **Next**, the client is told about the date impact, which happens tomorrow, Fri 9 Oct, if P1 is still open. Because the funding date has moved, the Head of Institutional Onboarding has already been told."

**Click:** the **Dependencies & what-if** tab.

**Say:**
> "Some work can't start until earlier work finishes. This is the chain from contract to first report."

**Point to the chain:** Contract signed Wed 28 Oct → Funding setup Wed 11 Nov → Cash instructions Wed 25 Nov → Funded Thu 26 Nov → Trading Tue 1 Dec → Reporting Thu 3 Dec. Each is +3d against plan.

**Click:** the task list is already set to **P6 · IMA executed**. Click **+5 days**.

**Say:**
> "Suppose the trustees need another five days to sign. Funding moves from 26 November to **3 December**. Thirteen tasks move, and Paperwork and Ops setup both go from at risk to off track. Here's who gets notified and in what order: Legal flags it, then the onboarding lead, then the RM, then the client's counsel, then the heads of Legal and Onboarding."

**Optional click:** pick **O4 · Create system records** and add **+5 days**.
> "The same delay on a task that has slack doesn't move the date at all."

**Click:** **No delay**. This resets the what-if. Don't skip it, because the what-if carries into the other tabs.

---

## Scene 5 · Key players and obligations (3 minutes)

**Click:** the **Key players** tab.

**Say:**
> "The strongest feedback was: *who is actually involved?* So for this account, here is who must act now, who's blocked, and who we have to contact."

**Point to:**
- **Must act now:** Elena Weber on P1. Mandate counsel on the derivatives amendment. Billing on the fee schedule. Client Reporting on reporting setup. The onboarding lead on system records.
- **Blocked:** mandate counsel can't finalise Schedule A until P1 is in.
- **Must be contacted:** Elena Weber, because P1 is two days overdue.
- **The table:** each responsibility shows an internal owner, an external contact and an escalation point. That covers contracting, restrictions, AML/KYC, billing, reporting, custody, funding and ongoing servicing.
  > "Servicing ownership is in here too. After funding, Maya Shah services the account directly, the consultant is copied on reports and reviews, and the client investment office gives instructions."

**Click:** the **Obligations** tab.

**Say:**
> "We now split obligations into two groups, because their risk is judged differently."

- **Contractual** (IMA, Schedule A, service annex): the tobacco and coal exclusions, which are still waiting on P1; the 5% issuer limit; derivatives after the day-30 review; Tuesday holdings; the monthly analytics pack; the fee schedule.
  > "Missing one of these is a contract or guideline breach. Portfolio Control monitors them, and changing one needs Legal and a signed amendment."
- **Non-contractual:** material for the Monday trustee meeting, a sample before the client accepts the service, consultant copies, a quarterly review, a named servicing contact.
  > "Missing one of these is a service or relationship risk. The RM owns them and can renegotiate them without changing the contract."

---

## Scene 6 · One framework, many variations (4 minutes)

**Click:** **02 Onboarding framework**.

**Say:**
> "The feedback was not to build a separate process for each product. Instead, use one onboarding framework and layer the variations on top. These ten activities never change: AML/KYC, beneficial owner review, service model, contract review, investment guidelines, billing, account setup, reporting, funding and ongoing servicing."

**Point to:** the attribute panel on the left. It has vehicle, client type, funding method, transition manager, reporting, restrictions and billing.
**Point to:** the **client structure lens**, which shows who services the account, the channel, the intermediary and who gives instructions.

**Walk through the presets in the top row:**

1. **Alpenridge · current plan.** 6 of 10 activities change.
   > "Separate account with an IMA, three restriction types, a negotiated fee, and a consultant copied on everything."
2. **401(k) plan into a CIT.**
   > "The contract becomes a participation agreement. The guidelines are the pooled fund's, the plan is set up with the trustee and recordkeeper, and the fee is a fee class."
3. **Mutual fund omnibus.** 9 of 10 activities change.
   > "This is the case the group raised: servicing exists even where there's no obvious account relationship. AML moves to the intermediary under reliance. Beneficial owners aren't visible to us. Cash flows arrive as net trades, and we service the intermediary, not the investor."
4. **OCIO-managed endowment.**
   > "The OCIO gives instructions and we verify its authority. Funding is in kind, so a transition manager is added, with a pre-trade analysis, a T-day plan and a post-trade report."

**Click:** start from **401(k) plan into a CIT**, then switch on **Tobacco** under Investment restrictions.

> "The framework also catches combinations that don't work. A client-specific tobacco screen can't be applied inside a pooled CIT. The options are a separate account, or confirming that the pooled guidelines already meet it."

**Say (caveat):**
> "These variations show the typical differences between structures. Before we use them, they need to be checked against firm policy."

---

## Scene 7 · How the plan was built: the agents (1 minute)

**Click:** **03 Multi-agent system**.

**Say:**
> "Everything you've seen so far is the output. Here's how it's produced. Seven specialist agents each have one job, they hand cited work to each other, and people make every decision that matters."

**Point to the flow:** Context agent → H1 human check → Precedent agent → Operational risk and Investment risk agents in parallel → Playbook agent → **Key players agent** (new) → Evidence reviewer → H2 human review.

> "The Key players agent is new, and it came from your feedback. It maps owners, contacts and escalation points, and it flags contacts the documents don't name instead of guessing them."

---

## Scene 8 · Agent run: requirement → precedent → risk → workflow (6 minutes)

**Click:** **04 Agent run**, then **Run agents**. Keep *Pause after each agent* ticked and the speed at *Standard 1×*.

| When this appears | Say | Point to |
|---|---|---|
| Six PDFs listed, then five requirement areas | "**The client requirement.** The Context agent reads the six onboarding documents and pulls out five areas. It finds that the draft IMA says *more than* 5% tobacco while the trustees' policy says *5% or more*, and that 'no thermal coal' is never defined." | The facts cards and the citations (`N02§1`, `N03§1`) |
| **Operations confirms the client context** (playback stops) | "A person confirms the context before any history is searched." | Click **Confirm context & continue** |
| Precedent searches and the case comparison | "**Historical precedent.** It searches by issue, not by client. Northbridge had exactly the same tobacco conflict. Alpinecrest shows how reporting failed. Rhinebridge is the success story." | H01, H02, H03, H05 cards with a *Limit* line on each |
| Risk agents finish | "**Risk identified.** The Operational risk agent asks whether we can deliver. The Investment risk agent asks whether the portfolio will follow the client's intent. It runs boundary tests at 4.99, 5.00 and 5.01%." | The >5% vs ≥5% clause cards and the test table |
| Playbook agent finishes | "**Recommended workflow.** The decisions that block later work move into intake." | The five phases with task counts |
| **Key players agent finished** | "Who must act now, what's blocked, and which contacts we must ask for: client legal counsel, client finance and KYC signatories aren't named anywhere in the package." | The *Contacts to request* column and the *Missing* tags |
| Evidence reviewer | "Before anyone sees the plan, the evidence reviewer strikes the tempting shortcuts. Four out of five cases is not an 80% forecast. Another client's coal rule is not this client's intent." | The struck-through claims |
| **Review the working planning draft** | Optional: click **Challenge: "Rhinebridge succeeded."** and let it re-run. "Rhinebridge is kept as a counter-example, but it doesn't prove we can deliver weekly attribution." Then type a name and a reason, and click **Accept working planning draft**. | |
| After you accept | "**What-if.** Now the client clarifies what 'weekly' means." Click **Receive N07 & rerun affected agents**. "Only the affected agents re-run. The restriction analysis is reused." | The *Reused · unchanged* badges and the risk changes |

If time is short, stop after the first acceptance. If not, accept again and click **Receive N08**: the client moves to all-cash funding with derivatives at day 30.

---

## Scene 9 · Workflow & risk: what-if on days (3 minutes)

**Click:** **05 Workflow & risk**. If you ran N08, the console opens on *16 Sep · Cash + later derivatives*. Use **Start from evidence** to choose **14 Sep · Initial request**.

**Say:**
> "This is the what-if for planners. Five requirement areas, each set to Low, Medium or High. The onboarding duration uses the longest workstream that runs in parallel, not the sum of all of them."

**Point to:** *Onboarding duration* is **50–58 business days**, against a 45-day standard route.

**Click:** **Investment restrictions** in the left list.

**Point to the impact line:**
> "Same pattern as the status page. *Tobacco restriction unclear; thermal coal undefined*. In this snapshot it adds one to two onboarding days. It's three to six days of work, but most of that runs alongside longer workstreams. It needs Legal, Portfolio Control, the client and a portfolio manager decision."

**Click:** **Start from evidence → 16 Sep · Cash + later derivatives**.

> "With all-cash funding and derivatives later, we drop to **49–54 days**, and Legal applicability becomes the longest workstream."

**Optional:** click **How the days add up**:
> "Adding up every area would overstate it. Lakeshore had four rework streams at the same time, and its timeline moved only five days."

---

## Close (1 minute)

**Click:** back to **01 Onboarding status**.

**Say:**
> "To sum up: the team can see in 30 seconds where an onboarding is, what's late, and who has to act. Every risk is tied to days and to the reviews it needs. One framework covers separate accounts, CITs, funds, OCIO, sub-advisory, omnibus and pooled plans. And underneath, the agents build the plan from the documents and past cases, with people deciding at every gate."

> "Next steps would be: confirm the framework variations with policy owners, connect the status view to Appian task data instead of a synthetic plan, and pilot it on two live onboardings: one separate account and one CIT."

---

## 10-minute version

1. Scene 2, Leadership view: 1.5 min.
2. Scene 3, the 30-second read and the issue: 2 min.
3. Scene 4, the P6 +5 what-if only: 1.5 min.
4. Scene 5, Key players only: 1 min.
5. Scene 6, Alpenridge → Mutual fund omnibus: 1.5 min.
6. Scene 7, the agent flow, no run: 1 min.
7. Close: 1 min.

---

## Likely questions

| Question | Answer |
|---|---|
| Is this live data? | No. It's a synthetic client, a synthetic book and synthetic documents. The status view shows the structure we'd connect to Appian task data. |
| How is red, amber or green decided? | It's calculated, not typed in. Each task has a planned date and a forecast date. A stage is amber when something is overdue or blocked, or when its end moves by up to 3 days. It is red beyond 3 days. Funding is red on any slip, because the funding date is a commitment to the client. |
| Why does a 3-day-late task show "no date impact"? | It has slack: other work on the path to funding takes longer, so the delay is absorbed. |
| Is the +3 days a prediction? | It's a plan-based forecast from today's task dates. It isn't a statistical probability. The past cases tell us *how* delays happen, not their odds. |
| Does the AI decide the client's tobacco rule? | No. The agents raise the conflict and test options. Legal, Portfolio Control and the client decide. |
| Does the system email the client or create tasks? | No. It shows who should be notified and when. Contacting people and creating Appian tasks stay with the team. |
| Are the CIT and omnibus rules accurate for us? | They describe typical structural differences and need to be checked against firm policy before use. |
| Why is "Paperwork" still a stage name? | It matches the five phases the team uses today. Contract review sits inside it, and renaming it "Contracts" is a one-line change. |

---

## Feedback → where it appears

| Feedback | Where to show it |
|---|---|
| One framework, many variations | Scene 6 |
| Beyond CITs and separate accounts (client-structure lens) | Scenes 2 and 6 |
| Key players agent | Scenes 5, 7 and 8 |
| Contractual vs non-contractual obligations | Scene 5 |
| Progress, not only risk | Scene 3 |
| RAG status | Scenes 2 and 3 |
| Dependencies | Scene 4 |
| Risk tied to timeline | Scenes 3 and 9 |
| Escalation and communication | Scene 4 |
| Executive and operator views | Scenes 2 and 3 |
