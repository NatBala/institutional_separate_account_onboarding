# Onboarding Navigator: demo script

The full walkthrough takes about 25 minutes. A 10-minute version is near the end. The script is written for the `clean-ui` build.

**The story has three steps, with the multi-agent system at the centre:**

| Step | Tab | What the audience sees | Time |
|---|---|---|---|
| 1 | 01 Onboarding portfolio | The whole book, and why Alpenridge needs help | 3 min |
| 2 | 02 Multi-agent system | The seven agents, then running them live | 10 min |
| 3 | 03 Agent output | What the agents produced, and how the plan is tracking | 8 min |
| + | 04 One framework, many variations | How the same approach covers every client structure | 3 min |

Each scene has three parts:
- **Click** is what to do on screen.
- **Say** is suggested wording; adapt it freely.
- **Point to** is what the audience should notice.

---

## Before you start (2 minutes, off camera)

1. Run `npm run build`, then `python3 -m http.server 8000 --directory dist`, and open <http://localhost:8000>.
2. Click **Reset workspace** at the bottom of the left rail. The app opens on **01 Onboarding portfolio**, and the evidence snapshot is *14 Sep · Initial request*.
3. Zoom the browser until the five KPI tiles fit on one row. On a 1440px laptop that's about 90%.
4. Be ready to say two things up front:
   - Everything is synthetic. Alpenridge, the 13 other onboardings, the people and the documents are all fictional, and none of it comes from Capital Group records.
   - No live model or production system is connected. The agent outputs were prepared in advance. Search, scheduling and the date calculations all run locally in the browser.

---

## Scene 1 · Opening (1 minute)

**Screen:** 01 Onboarding portfolio.

**Say:**
> "Last time you asked three things: where are we with onboarding, who is involved, and does this work beyond separate accounts? So today has three steps. First, a quick look at the whole book. Then we let the multi-agent system build the plan for our hardest client, Alpenridge. Then we look at what it produced."

---

## Scene 2 · Onboarding portfolio (3 minutes)

**Say:**
> "We have 14 onboardings in flight, about $3.9bn in total. Eight are behind schedule: four off track and four at risk. Nine are due to fund in the next 30 business days."

**Point to:**
- **By vehicle and by client type.** The vehicles are separate accounts, CITs and mutual funds. The client types are direct, consultant-advised, OCIO, sub-advisory, omnibus and MEP/PEP.
- **Bottleneck:**
  > "Paperwork is the bottleneck, and Legal is the team people wait on most."
- **Risk concentration:**
  > "Most of our risk is in contracts and investment restrictions, and mostly in separate accounts, because those mandates are bespoke."
- **Behind schedule, the Alpenridge row:**
  > "Alpenridge is the hardest case in the book. It's a Swiss pension foundation with its own tobacco and coal restrictions. It asked for reporting we don't support as written. It wants derivatives. And its funding plan changed twice. Plans like this are where onboarding goes wrong. So let's see how the agents build it."

**Click:** **See how the agents build its plan →** on the Alpenridge row.

---

## Scene 3 · Meet the agents (2 minutes)

**Screen:** 02 Multi-agent system, with the agent diagram at the top.

**Say:**
> "There are seven specialist agents and two human checkpoints. Each agent has one job and passes its work, with sources cited, to the next. People make every decision that matters."

**Point to the three columns, left to right:**
1. **Understand the request.**
   - The **Context agent** reads the client's documents.
   - A person confirms what it found at checkpoint **H1**.
   - The **Precedent agent** then searches 12 past onboardings, one issue at a time.
2. **Assess risk in parallel.**
   - The **Operational risk agent** asks whether we can deliver this. It looks at reporting, funding, derivatives and legal requirements.
   - The **Investment risk agent** asks whether the portfolio will follow the client's intent. It looks at what the restrictions mean and which holdings they affect.
3. **Plan and verify.**
   - The **Playbook agent** builds the five-stage plan.
   - The **Key players agent** is new. It names who owns each piece of work, who is blocked and who we need to contact.
   - The **Evidence reviewer** challenges anything the sources don't support, before a person reviews the plan at checkpoint **H2**.

**Optional:** open **What each agent does** to show each agent's job, inputs, outputs and limits.

> "And here's what the system never does: approve contract terms, decide what the client meant, create accounts, place trades or move money."

---

## Scene 4 · Run the agents (8 minutes)

**Click:** **Run agents ▶** at the top right of the diagram. The page scrolls down to the run.

Leave *Pause after each agent* ticked and the speed at *Standard 1×*. The run pauses after each agent so you can talk through its output. Click **Continue to …** to move on.

| When this appears | Say | Point to |
|---|---|---|
| Six documents listed, then **five requirement areas** | "**Client requirement.** The Context agent reads the six onboarding documents. It finds that the draft IMA says *more than* 5% tobacco, but the trustees' policy says *5% or more*. And 'no thermal coal' is never defined." | The facts cards and the citations `N02§1` and `N03§1` |
| **Operations confirms the client context** (playback stops) | "A person checks what the agent extracted before any past cases are searched." | Click **Confirm context & continue** |
| Three searches, then **case comparison** | "**Historical precedent.** It searches by issue, not by similar client. Northbridge had exactly the same tobacco conflict. Alpinecrest shows how reporting went wrong. Rhinebridge is the success story. Each case comes with its limits stated." | Cases H01, H02, H03 and H05, each with a *Limit* line |
| **Operational risk** register | "**Risk identified.** The Operational risk agent compares what was asked for with what we can deliver. We can't support analytics every Monday. We can support holdings every Tuesday and a monthly pack." | The R1 reporting risk card |
| **Investment risk** clause cards and tests | "The Investment risk agent shows that the same holding gets two different answers at exactly 5%. It runs tests at 4.99, 5.00 and 5.01%. It never decides what the client intended." | The *> 5%* vs *≥ 5%* cards and the test table |
| **Playbook agent** | "**Recommended workflow.** Decisions that block later work are moved up into intake." | The five phases filling in |
| **Key players agent** | "Who must act now, who is blocked, and which contacts we have to ask for. Client legal counsel, client finance and the KYC signatories aren't named anywhere in the documents. The agent asks for them; it doesn't guess." | *Must act now*, *Blocked*, *Contacts to request*, and the *Missing* tags |
| **Evidence reviewer** | "It strikes out tempting shortcuts. Four out of five past cases is not an 80% forecast. Another client's coal rule is not this client's intent." | The struck-through claims |
| **Review the working planning draft** (playback stops) | Optional: click **Challenge: "Rhinebridge succeeded."** The agents re-run and keep Rhinebridge as a counter-example. Then enter a name and a reason and click **Accept working planning draft**. | |
| **Working planning draft accepted** | Optional, about 1 minute: "Now the client clarifies what they meant by 'weekly'." Click **Receive N07 & rerun affected agents**. "Only the affected agents run again; the restriction analysis is reused." Then accept again. | The *Reused · unchanged* badges |

**Say:**
> "That's the run: documents go in, and a reviewed plan comes out, with people deciding at both checkpoints. Now let's look at what it produced."

**Click:** **See the agent output →**.

---

## Scene 5 · Agent output (8 minutes)

**Screen:** 03 Agent output. Jump links at the top take you to each section. Each section is tagged *Produced by …* with the agent that made it.

**Say (bridge):**
> "The agents built this plan in mid-September, and the team has worked it since. This is where it stands on Thursday 8 October."

### 5a · Plan & status *(Playbook agent + Key players agent)*

> "Here's the 30-second read. The client asked for funding on Monday 23 November. We now forecast Thursday 26 November, three business days late. There are 14 open tasks: two overdue and two blocked."

**Stage cards** (each shows the owner, team and escalation point):

| Stage | Status |
|---|---|
| Intake | 🟢 Complete |
| Paperwork | 🟡 At risk |
| Ops setup | 🟡 At risk |
| Funding | 🔴 Off track |
| Post-funding | ⚪ Not started |

> "Funding is red because the client's date will be missed. We allow no tolerance on funding, because that date is a commitment to the client."

**Issues affecting the timeline:**
> "This is the issue the agents flagged on day one. The tobacco and coal restriction is still unclear. It adds three onboarding days, and clearing it needs a Legal review, a Portfolio Control review and a clarification from the client. Next to it, system records are three days overdue but have no effect on the date, because there's slack in the work that follows."

**Who acts next:**
- Elena Weber at the client needs to act on P1.
- Mandate counsel is blocked on Schedule A until P1 comes in.
- Elena Weber is also the person we need to contact.

**Drill-down, with P1 on the right:**
> "P1 was due on 6 October, and 15 later tasks are waiting on it. Here's the escalation so far. The owner flagged it. The onboarding lead was told when it was one day overdue. The RM is chasing at two days. Next, the client is told about the date impact on Friday 9 October. The Head of Onboarding already knows, because the funding date has moved."

### 5b · Requirements & obligations *(Context agent + Evidence reviewer)*

> "This is the client requirement the Context agent extracted: what the client asked for, and where each request stands now. Every line has a source."

**Point to:**
- Reporting: agreed on 15 Sep.
- Tobacco and coal: 2 days overdue.
- Funding and derivatives: both changed on 16 Sep.

**Obligations:**
> "Contractual obligations are the ones written into the IMA, Schedule A and the service annex. Missing one is a breach. Portfolio Control monitors them, and changing one needs Legal. Non-contractual expectations are a relationship risk instead. The RM owns those and can renegotiate them."

### 5c · Key players *(Key players agent)*

> "For each responsibility you can see the internal owner, the external contact, the escalation point and the next action. Servicing ownership is here too. After funding, Maya Shah services the account, the consultant is copied in, and the client's investment office gives instructions."

### 5d · What-if: if a task slips *(Playbook agent)*

**Point to the chain:**

| Milestone | Forecast |
|---|---|
| Contract signed | Wed 28 Oct |
| Funding setup | Wed 11 Nov |
| Cash instructions | Wed 25 Nov |
| Funded | Thu 26 Nov |
| Trading | Tue 1 Dec |
| Reporting | Thu 3 Dec |

**Click:** the task is already set to **P6 · IMA executed**. Click **+5 days**.
> "If the trustees need five more days to sign, funding moves to 3 December. Thirteen tasks move, and Paperwork and Ops setup turn red. And this shows who gets told, in what order."

**Optional:** choose **O4 · Create system records**, then click **+5 days**.
> "The same delay on a task with slack after it doesn't move the date."

### 5e · What-if: if the client's requirements change *(Operational + Investment risk agents)*

**Click:** **Start from evidence → 14 Sep · Initial request**. This matters if you ran N07 in Scene 4.
> "This is the risk agents' view. Each requirement area is set to Low, Medium or High. The areas run in parallel, so the total follows the longest one: 50 to 58 business days, against a 45-day standard route."

**Click:** **Investment restrictions**.
> "Tobacco restriction unclear, thermal coal undefined. That adds one to two onboarding days. It's three to six days of work, but most of it runs alongside longer workstreams. Clearing it needs Legal, Portfolio Control, the client and a decision from the portfolio manager."

**Click:** **Start from evidence → 16 Sep · Cash + later derivatives**.
> "With all-cash funding and derivatives later, it's 49 to 54 days."

---

## Scene 6 · One framework, many variations (3 minutes)

**Click:** **04 One framework, many variations**.

**Say:**
> "Alpenridge is one client. These ten activities are the same for every client: AML/KYC, beneficial owner review, service model, contract review, investment guidelines, billing, account setup, reporting, funding and ongoing servicing. The client's attributes change how each activity is done and who is involved. Those attributes are what the agents read from the documents."

**Click through:**
1. **Alpenridge · current plan.** 6 of the 10 activities change.
2. **Mutual fund omnibus.** 9 of the 10 change.
   > "Servicing still exists here, even with no direct account relationship. AML checks rely on the intermediary, and we service the intermediary, not the investor."
3. **401(k) plan into a CIT**, then switch on **Tobacco**.
   > "It flags combinations that don't work. A client-specific screen can't sit inside a pooled CIT."

> "These variations need checking against firm policy before we use them."

---

## Close (1 minute)

**Click:** **02 Multi-agent system**.

**Say:**
> "To recap. Leadership sees the whole book. For the hard cases, seven agents turn documents and past cases into a plan, and people decide at every checkpoint. The plan tells the team where they stand, who acts next and what a delay costs. And the same framework covers separate accounts, CITs, funds, OCIO, sub-advisory, omnibus and pooled plans."

> "Next steps: confirm the framework with the policy owners, connect the agents and the status view to Appian, and pilot it on two live onboardings, one separate account and one CIT."

---

## 10-minute version

1. Scene 2, portfolio ending on Alpenridge: 1 minute.
2. Scene 3, meet the agents, diagram only: 1 minute.
3. Scene 4, run to the first acceptance at 2× speed, skipping the challenge and N07: 4 minutes.
4. Scene 5a, the 30-second read and the tobacco issue: 2 minutes.
5. Scene 5d, delay P6 by 5 days: 1 minute.
6. Close: 1 minute.

---

## Likely questions

| Question | Answer |
|---|---|
| Is the model running live? | No. The agent outputs were prepared in advance and are replayed in order. Search, rule tests and date calculations run locally. A separate live version exists, but it isn't used in this demo. |
| Is this real data? | No. The client, the book and the documents are all synthetic. The status view shows the structure we would connect to Appian. |
| Why is the run in mid-September but the status on 8 October? | The agents built the plan when the documents arrived. The status shows how that plan has tracked since. |
| How is red, amber or green decided? | It's calculated from planned and forecast dates. A stage is amber if something is overdue or blocked, or if the stage end moves by up to 3 days. It's red if it moves by more. Funding is red on any slip, because the date is a commitment to the client. |
| Is +3 days a prediction? | It's a forecast based on today's task dates, not a probability. The past cases show how delays happen, not how likely they are. |
| Does the AI decide the tobacco rule? | No. The agents raise the conflict and test the options. Legal, Portfolio Control and the client decide. |
| Does it email the client or create tasks? | No. It shows who should be told and when. People do the contacting and create the tasks in Appian. |
| Are the CIT and omnibus variations right for us? | They show typical differences between structures and need checking against firm policy. |

---

## Feedback → where it appears

| Feedback | Scene |
|---|---|
| Executive view first, then a specific client | 2 → 4 → 5 |
| Client requirement → precedent → risk → workflow → what-if | 4, then 5b, 5d, 5e |
| Key players agent | 3, 4, 5c |
| Progress, not only risk; RAG status | 5a |
| Dependencies and timeline impact | 5a, 5d, 5e |
| Escalation and communication | 5a, 5d |
| Contractual vs non-contractual obligations | 5b |
| One framework, many variations; beyond CITs and separate accounts | 2, 6 |
