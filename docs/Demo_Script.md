# Onboarding Navigator: demo script

The full walkthrough takes about 25 minutes. A 10-minute cut is near the end. The script is for the `clean-ui` build, which has six tabs and seven agents.

**The story follows the left rail, top to bottom:**

| Group | Tab | Question it answers |
|---|---|---|
| Portfolio | 01 Onboarding portfolio | How are all our onboardings doing? |
| Alpenridge Pension Foundation | 02 Status & next actions | Where is this one, and who has to act? |
| | 03 Requirements & obligations | What did the client ask for, and what are we committed to? |
| | 04 How the plan was built | How did the agents get from documents to this plan? |
| | 05 What-if | What if a task slips, or the client changes their mind? |
| Across all clients | 06 One framework, many variations | How does this work for CITs, funds, OCIO, omnibus…? |

Each scene has three parts. **Click** says what to do on screen. **Say** is suggested wording, which you can adapt. **Point to** says what the audience should notice.

---

## Before you start (2 minutes, off camera)

1. Run `npm run build`, then `python3 -m http.server 8000 --directory dist`, and open <http://localhost:8000>.
2. Click **Reset workspace** at the bottom of the left rail. The app opens on **01 Onboarding portfolio**.
3. Set the browser zoom so the five KPI tiles sit on one row. 90% works on a 1440px laptop.
4. Have these two points ready to say:
   - Everything is synthetic. Alpenridge, the 13 other onboardings, the people and the documents are all fictional and are not Capital Group records.
   - No live model or production system is connected. The agent outputs are prepared in advance. The search, the scheduling and the date maths run locally.

---

## Scene 1 · Opening (1 minute)

**Screen:** 01 Onboarding portfolio.

**Say:**
> "The feedback last time was clear. Start with where we are, not just what the risks are. Make it obvious who is involved. And show how one approach covers CITs, separate accounts and funds. So the story starts where leadership starts: the whole book. Then we drill into one client, Alpenridge. After that we look at how the plan was built, then at what-ifs. We finish with how the same framework applies to every client structure."

---

## Scene 2 · Onboarding portfolio (3 minutes)

**Say:**
> "We have 14 onboardings in flight, about $3.9bn. Eight are behind schedule: four are off track and four are at risk. Nine are due to fund in the next 30 business days."

**Point to, from left to right:**

- **By vehicle and By client type.** These cover separate account, CIT and mutual fund, and direct, consultant-advised, OCIO, sub-advisory, omnibus and MEP/PEP. Each bar is split into off track, at risk and on track.
- **Where onboardings sit, and the bottleneck.**
  > "Paperwork is the bottleneck. All four onboardings sitting there need attention, and Legal is the team most often waited on."
- **Risk concentration.**
  > "Our risk is in contracts and investment restrictions, mostly in separate accounts. That's what you'd expect from bespoke mandates."
- **Behind schedule.**
  > "Northfold's sub-advisory sleeve is six days late on contracts. TrueNorth's pooled employer plan is five days late, also on contracts. Alpenridge is three days late because of investment restrictions. Let's look at Alpenridge."

**Click:** **Open Alpenridge →** on the Alpenridge row.

---

## Scene 3 · Status & next actions (4 minutes)

**Screen:** 02 Status & next actions. The left rail now shows the Alpenridge group.

**Say (the 30-second read):**
> "Alpenridge is a USD 250m global bond mandate. It's a separate account, and the client is advised by a consultant. The client asked to be funded on Monday 23 November. We now forecast Thursday 26 November, three business days late. There are 14 open tasks: two overdue and two blocked."

**Point to the stage cards.** Each card shows its status, owner, team and escalation point.

| Stage | Status | Say |
|---|---|---|
| Intake | 🟢 Complete 7/7 | "Intake is done." |
| Paperwork | 🟡 At risk | "One task is overdue and one is blocked. The stage end has moved three days. The owner is mandate counsel in Legal, and it escalates to the Head of Legal, Institutional." |
| Ops setup | 🟡 At risk | "The delay carries through into setup." |
| Funding | 🔴 Off track | "Funding is red because the client's date is missed. We allow no tolerance on funding, because that date is a commitment to the client." |
| Post-funding | ⚪ Not started | "It starts after funding and moves with it." |

**Point to Issues affecting the timeline:**
> "This is where risk turns into dates. Instead of 'restrictions: high risk' we now say: *tobacco and coal restriction unclear*, which adds three onboarding days and moves funding from 23 to 26 November. Clearing it needs a Legal review, a Portfolio Control review and a client clarification."

> "Next to it: system records are three days overdue but have *no date impact*, because the work after them has enough slack. Not every late task matters, and this view tells you which ones do."

**Point to Who acts next:**
- **Must act now:** Elena Weber at the client, on P1. Mandate counsel, on the derivatives amendment. Billing, on the fee schedule. Client Reporting, on reporting setup. The onboarding lead, on system records.
- **Blocked:** mandate counsel can't finalise Schedule A until P1 comes in.
- **Must be contacted:** Elena Weber, because P1 is two days overdue.

**Point to the Paperwork drill-down and P1 detail on the right:**
> "This is the checklist the team already uses: task, owner, external contact, due date, forecast and status. P1 was due Tuesday 6 October and is two days overdue. P2 is blocked by it. P1 unblocks 15 later tasks."

> "And this is how escalation works. The task owner flagged it. The onboarding lead was told at one day overdue, and the RM is chasing the client at two days. *Next*, the client is told about the date impact. That happens tomorrow, Friday 9 October, if P1 is still open. Because the funding date has moved, the Head of Institutional Onboarding already knows."

**Optional click:** the **FUNDING** stage card shows the go-live sign-off, the cash instructions and the funded milestone, each with an owner and a date.

---

## Scene 4 · Requirements & obligations (3 minutes)

**Click:** **03 Requirements & obligations**.

**Say:**
> "This is the client requirement: what they asked for, and where each ask stands today. Every line cites its source document."

**Point to the requirements table:**
- **Reporting:** the client asked for weekly analytics on Monday at 08:00. It is now *agreed* as weekly Tuesday holdings plus a monthly pack (15 Sep).
- **Tobacco and thermal coal:** the policy says 5% or more, and the draft IMA says more than 5%. Coal is undefined. Both are *2 days overdue*, waiting on the client's written confirmation. This is the issue from the status page.
- **Funding and derivatives:** both *changed 16 Sep*. Funding is now all cash, and derivatives move to a review at day 30.

**Point to Obligations:**
> "We split obligations into two groups because their risks are judged differently."
- **Contractual** (IMA, Schedule A, service annex):
  > "Missing one of these is a contract or guideline breach. Portfolio Control monitors them, and any change needs Legal and a signed amendment."
- **Non-contractual** (trustee pack timing, a sample before acceptance, copies for the consultant, a quarterly review, a named servicing contact):
  > "Missing one of these is a service or relationship risk. The RM owns them and can renegotiate without changing the contract."

**Point to Key players:**
> "For each responsibility: the internal owner, the external contact, the escalation point and the next action. Servicing ownership is here too. After funding, Maya Shah services the account directly, the consultant is copied, and the client investment office is the instructing party."

---

## Scene 5 · How the plan was built (6 minutes)

**Click:** **04 How the plan was built**.

**Say:**
> "Everything so far is the output. Here is how it was produced. Seven agents each have one job. They hand cited work to each other, and people decide at two checkpoints."

**Point to the flow:** Context → H1 human check → Precedent → Operational risk and Investment risk in parallel → Playbook → **Key players** (new) → Evidence reviewer → H2 human review. If someone asks for detail, open *What each agent does*.

**Click:** **Run agents**. Keep *Pause after each agent* ticked and the speed at *Standard 1×*.

| When this appears | Say | Point to |
|---|---|---|
| The six PDFs, then five requirement areas | "**The client requirement.** The Context agent reads the six onboarding documents. It finds the clash between more than 5% and 5% or more for tobacco, and that 'no thermal coal' is never defined." | The facts cards, and the citations `N02§1` and `N03§1` |
| **Operations confirms the client context** | "A person confirms the context before any history is searched." | Click **Confirm context & continue** |
| Precedent searches and case comparison | "**Historical precedent.** The search runs by issue, not by client. Northbridge had exactly the same tobacco conflict. Alpinecrest shows how reporting failed. Rhinebridge is the success story." | H01, H02, H03 and H05, each with a *Limit* line |
| Risk agents | "**Risk identified.** One agent asks whether we can deliver. The other asks whether the portfolio will follow the client's intent. It tests the boundary at 4.99, 5.00 and 5.01%." | The clause cards and the test table |
| Playbook agent | "**Recommended workflow.** Decisions that block later work move into intake." | The five phases |
| **Key players agent finished** | "Who must act now and what's blocked. Also, which contacts we have to ask for: client legal counsel, client finance and the KYC signatories aren't named anywhere in the package." | *Contacts to request* and the *Missing* tags |
| Evidence reviewer | "It strikes out tempting shortcuts. Four out of five cases is not an 80% forecast. Another client's coal rule is not this client's intent." | The struck-through claims |
| **Review the working planning draft** | Optional: click **Challenge: "Rhinebridge succeeded."** Then enter a name and a rationale, and click **Accept working planning draft**. | |
| After accepting | "Now the client clarifies what 'weekly' means." Click **Receive N07 & rerun affected agents**. "Only the affected agents re-run." | The *Reused · unchanged* badges |

If time is short, stop after the first acceptance.

---

## Scene 6 · What-if (4 minutes)

**Click:** **05 What-if**.

**Part A: if a task slips.**

**Point to the chain:** Contract signed Wed 28 Oct → Funding setup Wed 11 Nov → Cash instructions Wed 25 Nov → Funded Thu 26 Nov → Trading Tue 1 Dec → Reporting Thu 3 Dec. Each step is +3 days against plan.

**Click:** the task selector already shows **P6 · IMA executed**. Click **+5 days**.

**Say:**
> "Say the trustees need five more days to sign. Funding moves from 26 November to **3 December**. Thirteen tasks move, and Paperwork and Ops setup go from at risk to off track. Here is who gets told, in order: Legal flags it, then the onboarding lead, the RM, the client's counsel, and finally the heads of Legal and Onboarding."

**Optional:** pick **O4 · Create system records** and add +5:
> "The same delay on a task with slack doesn't move the date."

**Part B: if the client's requirements change.** Scroll down.

**Say:**
> "This is the second planner question. Five requirement areas, each set to Low, Medium or High. The duration follows the longest workstream that runs in parallel, not the sum of them all."

**Point to:** *Onboarding duration* of **50–58 business days**, against a 45-day standard route, on the 14 Sep snapshot.

**Click:** **Investment restrictions** in the left list.
> "Here is the same issue-to-days line again. *Tobacco restriction unclear; thermal coal undefined.* In this snapshot it adds one to two onboarding days. It's three to six days of work, but most of that runs alongside longer workstreams. It needs Legal, Portfolio Control, the client and a PM decision."

**Click:** **Start from evidence → 16 Sep · Cash + later derivatives**.
> "All-cash funding with derivatives later takes us to **49–54 days**, and Legal applicability becomes the longest workstream."

---

## Scene 7 · One framework, many variations (4 minutes)

**Click:** **06 One framework, many variations**.

**Say:**
> "We zoom back out to every client. The feedback was not to build a separate process per product: one framework, with variations layered on top. These ten activities never change. They are AML/KYC, beneficial owner review, service model, contract review, investment guidelines, billing, account setup, reporting, funding and ongoing servicing."

**Point to:** the attributes on the left, then the **client structure lens**, which shows who services the account, the channel, the intermediary and the instructing party.

**Click through the presets:**

1. **Alpenridge · current plan** changes 6 of 10 activities.
   > "Separate account, IMA, three restriction types, a negotiated fee, and the consultant copied."
2. **401(k) plan into a CIT.**
   > "A participation agreement, pooled guidelines, the trustee and recordkeeper, and a fee class."
3. **Mutual fund omnibus** changes 9 of 10 activities.
   > "Servicing exists even where there's no obvious account relationship. AML relies on the intermediary. Beneficial owners aren't visible to us. Cash flows arrive as net trades. We service the intermediary, not the end investor."
4. **OCIO-managed endowment.**
   > "The OCIO instructs and we verify its authority. In-kind funding brings in a transition manager."

**Click:** **401(k) plan into a CIT**, then switch on **Tobacco**.
> "The framework also flags combinations that don't work. A client-specific tobacco screen can't sit inside a pooled CIT."

> "These variations show typical differences between structures. They need checking against firm policy before use."

---

## Close (1 minute)

**Click:** **01 Onboarding portfolio**.

**Say:**
> "To sum up: leadership sees the whole book in one screen and can drill into any onboarding. For each client, the team sees in 30 seconds where it stands, what is late and who has to act. Every risk is tied to days and to the reviews it needs. Agents build the plan from documents and past cases, and people decide at every gate. One framework covers separate accounts, CITs, funds, OCIO, sub-advisory, omnibus and pooled plans."

> "Next steps would be to confirm the framework variations with the policy owners, connect the status view to Appian task data, and pilot it on two live onboardings: one separate account and one CIT."

---

## 10-minute version

1. Scene 2, Onboarding portfolio: 1.5 min.
2. Scene 3, the 30-second read, the issue and who acts next: 2.5 min.
3. Scene 4, the requirements table only: 1 min.
4. Scene 5, the agent flow only, without running it: 1 min.
5. Scene 6 Part A, P6 +5 days: 1.5 min.
6. Scene 7, Alpenridge → Mutual fund omnibus: 1.5 min.
7. Close: 1 min.

---

## Likely questions

| Question | Answer |
|---|---|
| Is this live data? | No. The client, the book of onboardings and the documents are all synthetic. The status view shows the structure we would connect to Appian task data. |
| How is red, amber or green decided? | It's calculated from planned and forecast task dates. A stage is amber when a task is overdue or blocked, or when the stage end moves by up to 3 days. It is red beyond 3 days. Funding is red on any slip, because the funding date is a commitment to the client. |
| Why does a late task show "no date impact"? | It has slack, meaning other work on the path to funding takes longer. |
| Is +3 days a prediction? | It's a plan-based forecast from today's task dates, not a statistical probability. Past cases show *how* delays happen, not their odds. |
| Does the AI decide the client's tobacco rule? | No. The agents raise the conflict and test the options. Legal, Portfolio Control and the client decide. |
| Does it email the client or create tasks? | No. It shows who should be told and when. The team contacts people and creates the Appian tasks. |
| Are the CIT and omnibus variations accurate for us? | They describe typical differences between structures and need checking against firm policy. |
| Why is "Paperwork" still a stage name? | It matches the five phases the team uses today, and contract review sits inside it. Renaming it to "Contracts" is a one-line change. |

---

## Feedback → where it appears

| Feedback | Scene |
|---|---|
| Executive view, then a specific client | 2 → 3 |
| Progress, not only risk; RAG status | 3 |
| Make dependencies clear | 3 (waits on / unblocks), 6A |
| Risk tied to the timeline | 3, 6B |
| Escalation and communication | 3, 6A |
| Contractual vs non-contractual obligations | 4 |
| Key players agent | 3, 4, 5 |
| Client requirement → precedent → risk → workflow → what-if | 4 → 5 → 6 |
| One framework, many variations; beyond CITs and separate accounts | 2, 7 |
