import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual shipped scripts with a small DOM adapter. This catches
// startup/interaction exceptions; it does not substitute for visual browser QA.
function openWorkspace(saved={}) {
  class Element {
    constructor(){this.innerHTML='';this.textContent='';this.dataset={};this.style={};this.listeners={};this.children=new Map();this.isConnected=true;this.classList={toggle(){},add(){},remove(){}};}
    addEventListener(name,fn){(this.listeners[name]??=new Set()).add(fn);}
    removeEventListener(name,fn){this.listeners[name]?.delete(fn);}
    querySelector(selector){if(!this.children.has(selector))this.children.set(selector,new Element());return this.children.get(selector);}
    querySelectorAll(){return [];}
    contains(){return true;}
    setAttribute(){}
    focus(){}
    scrollIntoView(){}
    showModal(){}
    close(){}
  }
  const document=new Element();document.getElementById=id=>document.querySelector('#'+id);
  document.createElement=()=>new Element();document.activeElement=null;
  const records=new Map([['sa-corpus-demo-v1',JSON.stringify(saved.view?{liveSeen:true,...saved}:saved)]]);
  const timers=new Map();let timerId=0;
  const context=vm.createContext({window:{scrollTo(){}},document,
    localStorage:{getItem:k=>records.get(k),setItem:(k,v)=>records.set(k,v)},
    setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),
    setInterval:fn=>{timers.set(++timerId,fn);return timerId;},clearInterval:id=>timers.delete(id),
    requestAnimationFrame:fn=>fn(),ResizeObserver:class {observe(){}disconnect(){}},
    Blob,URL,console,FormData
  });
  const html=fs.readFileSync('prepared-release/index.html','utf8');
  for(const [,file] of html.matchAll(/<script src="([^"]+)"/g))
    vm.runInContext(fs.readFileSync('prepared-release/'+file,'utf8'),context,{filename:file});
  function click(target,dataset){const button=new Element();button.dataset=dataset;button.closest=()=>button;
    for(const fn of [...(target.listeners.click||[])])fn({target:button});}
  return {document,context,timers,click,app:document.getElementById('app')};
}

test('published scripts start for new and returning users and every saved view',()=>{
  // Views from earlier releases map onto the three steps or fall back to the portfolio.
  const views=['portfolio','agents','output','framework','status','requirements','plan','whatif','system','run','workflow','live','riskmap','brief'];
  for(const scenario of ['initial','clarified','cash'])for(const view of views){
    const w=openWorkspace({view,scenario});
    for(const tab of [/Onboarding portfolio/,/Multi-agent system/,/Agent output/,/One framework, many variations/])assert.match(w.app.innerHTML,tab);
    assert.doesNotMatch(w.app.innerHTML,/Requirements evidence|Live agent workspace|Operator view|data-st-tab|How the plan was built/);
    w.click(w.document,{view:'portfolio'});const st=w.document.getElementById('st-root');
    assert.match(st.innerHTML,/Onboardings in flight/);assert.match(st.innerHTML,/Risk concentration/);assert.match(st.innerHTML,/data-view="framework">See how we plan it/);
    w.click(w.document,{view:'agents'});assert.match(w.app.innerHTML,/Key players agent/);assert.match(w.app.innerHTML,/Investment risk agent/);assert.match(w.app.innerHTML,/data-start/);
    assert.match(w.document.getElementById('agent-runner-root').innerHTML,/Run agents/);
    w.click(w.document,{view:'output'});
    // One screen: six cards with headline facts, no detail until a card is opened.
    for(const part of [/Funding forecast/,/Client requirements/,/Obligations/,/Risks &amp; date impact/,/Plan &amp; status/,/Key players/,/What-if/,/Context agent/,/Key players agent/,/\+3 days<small>to onboarding/])assert.match(st.innerHTML,part);
    assert.doesNotMatch(st.innerHTML,/ob-drawer|Escalation and communication|What the client asked for/);
    const open=(id,re)=>{w.click(st,{stOpen:id});assert.match(st.innerHTML,/ob-drawer/);assert.match(st.innerHTML,re);};
    open('req',/What the client asked for/);open('oblig',/Contractual obligations/);open('risk',/Risk register handed over by the risk agents/);
    open('plan',/Escalation and communication/);w.click(st,{stStage:'3'});assert.match(st.innerHTML,/Account funded/);
    open('players',/Who acts next/);
    open('whatif',/If a task slips/);w.click(st,{stSimDays:'5'});assert.match(st.innerHTML,/Who gets notified/);
    w.click(st,{stSim:'O4'});assert.match(st.innerHTML,/Unchanged: the delay is absorbed by slack/);
    const root=st.querySelector('#wr-root');
    assert.match(root.innerHTML,/Onboarding duration/);assert.doesNotMatch(root.innerHTML,/launch date|funding date|Just added/i);
    assert.match(root.innerHTML,/What this level means/);assert.match(root.innerHTML,/Why \+/);
    w.click(root,{tab:'team'});assert.match(root.innerHTML,/Accept mandate annexes/);
    w.click(root,{highlight:'all'});assert.match(root.innerHTML,/Portfolio management/);
    w.click(root,{tab:'math'});assert.match(root.innerHTML,/Add the longest workstream, not the sum/);
    w.click(root,{tab:'area'});assert.match(root.innerHTML,/Impact:/);
    w.click(root,{levelSet:'reporting:0'});assert.match(root.innerHTML,/Reporting service: (High|Medium) → Low|Onboarding duration/);assert.doesNotMatch(root.innerHTML,/steps? added/);
    w.click(st,{stClose:''});assert.doesNotMatch(st.innerHTML,/ob-drawer/);
    // The left panel collapses and remembers it.
    assert.match(w.app.innerHTML,/data-rail/);w.click(w.document,{rail:''});w.click(w.document,{view:'output'});assert.match(w.app.innerHTML,/shell rail-min/);w.click(w.document,{rail:''});
    w.click(w.document,{view:'framework'});const fw=w.document.getElementById('fw-root');
    // Starts with an empty matrix; Alpenridge is not in it yet.
    assert.match(fw.innerHTML,/Learn the onboarding framework from history/);assert.match(fw.innerHTML,/Build the framework from onboarding history/);assert.doesNotMatch(fw.innerHTML,/data-fx-col="alpenridge"/);
    assert.match(fw.innerHTML,/fx-cell empty/);assert.doesNotMatch(fw.innerHTML,/fx-cell rep/);
    w.click(fw,{fxCol:'omnibus'});assert.doesNotMatch(fw.innerHTML,/Platform agreement draft/,'clients cannot run before the matrix exists');
    // The Framework Builder agents learn the rules and fill the matrix.
    w.click(fw,{fxAct:'build'});assert.match(fw.innerHTML,/Archive reader/);assert.match(fw.innerHTML,/closed onboardings read/);assert.match(fw.innerHTML,/fx-stream/);assert.match(fw.innerHTML,/Read <b>OB-/);
    w.click(fw,{fxAct:'bskip'});assert.match(fw.innerHTML,/Built from 146 past onboardings/);assert.doesNotMatch(fw.innerHTML,/fx-cell empty/);
    assert.match(fw.innerHTML,/51<\/b> rules learned/);assert.match(fw.innerHTML,/3,456/);assert.match(fw.innerHTML,/waiting for approval|wait for approval/);
    // Alpenridge arrives as a new client; extracting its attributes adds it to the matrix.
    assert.match(fw.innerHTML,/New client received/);assert.doesNotMatch(fw.innerHTML,/<b>Alpenridge<\/b>/);
    w.click(fw,{fxAct:'extract'});assert.match(fw.innerHTML,/<b>Alpenridge<\/b>/);assert.match(fw.innerHTML,/is extracting attributes/);assert.match(fw.innerHTML,/fx-cell pending/);
    w.click(fw,{fxAct:'skip'});assert.match(fw.innerHTML,/Attributes extracted by the Context agent/);assert.match(fw.innerHTML,/data-view="agents">Run the agents for Alpenridge/);assert.doesNotMatch(fw.innerHTML,/Ready for human review/);assert.doesNotMatch(fw.innerHTML,/fx-cell pending/);
    // When Alpenridge is extracted, the Variation map opens on it: documents → attributes → what changes against the standard.
    assert.match(fw.innerHTML,/What changes against the standard: Alpenridge/);assert.match(fw.innerHTML,/vm-e e-replaced/);assert.match(fw.innerHTML,/N08§1/);
    // Clicking a document or an attribute shows the passage itself and what it changes.
    w.click(fw,{vmDoc:'2'});assert.match(fw.innerHTML,/Evidence from N08§1/);assert.match(fw.innerHTML,/do not transfer them/);assert.match(fw.innerHTML,/Open the full document/);
    w.click(fw,{vmPick:'restrictions'});assert.match(fw.innerHTML,/Found in 3 passages/);assert.match(fw.innerHTML,/ESG \/ coal definition/);w.click(fw,{vmClose:''});assert.doesNotMatch(fw.innerHTML,/class="vm-ev"/);
    w.click(fw,{vmCol:'cit'});assert.match(fw.innerHTML,/standard: 401\(k\) plan/);assert.match(fw.innerHTML,/Recordkeeper conversion memo/);
    w.click(fw,{vmAttr:'tm',vmVal:'yes'});assert.match(fw.innerHTML,/standard: your mix/);assert.match(fw.innerHTML,/combinations to check/);assert.match(fw.innerHTML,/vm-warn/);
    w.click(fw,{fxCell:'custom|guidelines'});assert.match(fw.innerHTML,/Standard guideline<\/span>/);
    w.click(fw,{fxView:'matrix'});w.click(fw,{fxAct:'back'});assert.match(fw.innerHTML,/Alpenridge is in the matrix/);
    // The KPI tiles open the learned rules and the proposed ones.
    w.click(fw,{fxList:'learned'});assert.match(fw.innerHTML,/Rules learned, with evidence<\/h2>/);assert.match(fw.innerHTML,/\d+ of \d+ past onboardings/);
    // Each rule opens the past onboardings it was learned from, then one onboarding's record.
    w.click(fw,{fxEv:'r0'});assert.match(fw.innerHTML,/fx-ev-list/);assert.match(fw.innerHTML,/past .+ onboardings show this change/);
    w.click(fw,{fxEv:'r0',fxOb:w.context.window.SA_FRAMEWORK.MINED.rules[0].examples[0]});assert.match(fw.innerHTML,/Supports this rule/);assert.match(fw.innerHTML,/Task log/);
    // A policy owner approves a proposed rule; it applies to the matrix straight away.
    w.click(fw,{fxCell:'ocio|contract'});assert.match(fw.innerHTML,/fw-proposed/);const before=(fw.innerHTML.match(/data-fx-cell="ocio\|contract"[^>]*>([^<]+)</)||[])[1];
    w.click(fw,{fxList:'proposed'});assert.match(fw.innerHTML,/Approve and apply/);w.click(fw,{fxDecide:'0:approved'});assert.match(fw.innerHTML,/Approved by the policy owner · applied to the matrix/);w.click(fw,{fxList:''});
    const after=(fw.innerHTML.match(/data-fx-cell="ocio\|contract"[^>]*>([^<]+)</)||[])[1];assert.notEqual(after,before);assert.match(fw.innerHTML,/1 approved/);assert.doesNotMatch(fw.innerHTML,/fw-proposed/);
    w.click(fw,{fxList:'proposed'});w.click(fw,{fxDecide:'0:'});assert.match(fw.innerHTML,/Approve and apply/);w.click(fw,{fxEv:'p0'});assert.match(fw.innerHTML,/added this step by hand \(/);w.click(fw,{fxEv:''});assert.doesNotMatch(fw.innerHTML,/class="fx-ev"/);assert.match(fw.innerHTML,/Waiting for the policy owner/);w.click(fw,{fxList:''});assert.doesNotMatch(fw.innerHTML,/fx-rl /);
    w.click(fw,{fxCell:'omnibus|aml'});assert.match(fw.innerHTML,/learned from \d+ of \d+ past onboardings/);
    assert.match(fw.innerHTML,/Standard guideline<\/span>/);assert.match(fw.innerHTML,/For Platform/);assert.match(fw.innerHTML,/Does not apply to this client/);
    // The standard guideline holds every standard in one place, and links to the rules for each activity.
    w.click(fw,{fxStd:'aml'});assert.match(fw.innerHTML,/Standard onboarding guideline<\/h2>/);assert.match(fw.innerHTML,/fx-std-card sel" id="fx-std-aml"/);assert.equal((fw.innerHTML.match(/class="fx-std-card/g)||[]).length,10);
    w.click(fw,{fxRulesFor:'aml'});assert.match(fw.innerHTML,/Showing the rules that change <b>AML\/KYC/);w.click(fw,{fxList:''});
    w.click(fw,{fxCell:'ocio|contract'});assert.match(fw.innerHTML,/Proposed/);
    // The onboarding agents then use the matrix for one client.
    w.click(fw,{fxCol:'omnibus'});assert.match(fw.innerHTML,/Platform agreement draft/);assert.match(fw.innerHTML,/fx-cell pending/);
    w.click(fw,{fxAct:'skip'});assert.match(fw.innerHTML,/Ready for human review/);assert.match(fw.innerHTML,/Intermediary performs underlying-investor KYC/);
    w.click(fw,{fxAct:'back'});assert.match(fw.innerHTML,/Framework Builder agents/);
    w.click(fw,{fxCol:'custom'});w.click(fw,{fwAttr:'restrictions',fwVal:'tobacco'});assert.match(fw.innerHTML,/Check this combination/);
  }
});

test('onboarding business-day model uses the longest workstream, not the sum',()=>{
  const {context}=openWorkspace();const W=context.window.SA_WORKFLOW;
  const at=id=>W.compute(W.PRESETS.find(p=>p.id===id).levels);
  assert.deepEqual([...at('standard').total],[45,46]);
  assert.deepEqual([...at('initial').total],[50,58]);
  assert.deepEqual([...at('clarified').total],[50,58]);
  assert.deepEqual([...at('cash').total],[49,54]);
  for(const p of W.PRESETS){const c=W.compute(p.levels);assert(c.add[1]<=c.naive[1]+3);assert(c.total[0]<=c.total[1]);
    assert.deepEqual(c.phases.reduce((t,x)=>[t[0]+x[0],t[1]+x[1]],[0,0]),[...c.total],'phase days must add up to the onboarding total');}
  for(const a of W.AREAS)for(const l of a.levels){const sum=l.parts.reduce((t,x)=>[t[0]+x[1],t[1]+x[2]],[0,0]);assert.deepEqual(sum,[...l.days],a.id);}
});

test('Run agents progresses to context and planning checkpoints',()=>{
  const w=openWorkspace();w.click(w.document,{start:''});
  const root=w.document.getElementById('agent-runner-root');
  for(let i=0;i<12&&!root.innerHTML.includes('Operations confirms the client context');i++)w.click(root,{runAction:'step'});
  assert.match(root.innerHTML,/Operations confirms the client context/);
  w.click(root,{runAction:'confirm-context'});
  for(let i=0;i<40&&!root.innerHTML.includes('Review the working planning draft');i++)w.click(root,{runAction:'step'});
  assert.match(root.innerHTML,/Review the working planning draft/);
  assert.match(root.innerHTML,/Agent outputs · 7 of 7 ready/);
});

test('playback pauses after each agent and keeps its output',()=>{
  const w=openWorkspace();w.click(w.document,{start:''});
  const root=w.document.getElementById('agent-runner-root');
  const drain=()=>{for(let i=0;i<40;i++){const [id,fn]=[...w.timers][0]||[];if(!id)return;w.timers.delete(id);fn();}};
  drain();assert.match(root.innerHTML,/Operations confirms the client context/);
  w.click(root,{runAction:'confirm-context'});drain();
  assert.match(root.innerHTML,/Precedent agent finished/);assert.match(root.innerHTML,/Agent outputs · 2 of 7 ready/);
  w.click(root,{runAction:'play'});drain();assert.match(root.innerHTML,/risk agent finished/);
});

test('Alpenridge status: RAG by stage, issue impact on the funding date, delay cascade',()=>{
  const {context}=openWorkspace();const O=context.window.SA_ONBOARD;const s=O.schedule();
  assert.equal(s.stages.map(x=>x.rag).join(),'green,amber,amber,red,grey');
  assert.equal(s.funded-s.target,3,'overdue restriction confirmation moves funding three business days');
  assert.equal(O.impact('P1'),3);assert.equal(O.impact('O4'),0,'a late task with slack does not move funding');
  assert.equal(s.map.P2.status,'blocked');assert.equal(s.map.P1.status,'overdue');
  assert.equal(O.criticalChain(s).map(r=>r.id).slice(0,5).join(),'I1,I5,P1,P2,P6');
  const d=O.schedule(O.TASKS,{extra:{P6:5}});assert.equal(d.funded,s.funded+5);
  const path=O.escalation(s.map.P1,s);assert(path[0].hit&&path.find(p=>/^Head of Institutional/.test(p.who)).hit,'funding date moved, so leadership is notified');
  assert.equal(O.book().length,14);
});

test('client requests sent from the agent run show against the requirements',()=>{
  const w=openWorkspace({view:'output',sent:['tobacco','date']}),O=w.context.window.SA_ONBOARD;
  assert.equal(O.actions().length,5);
  const st=w.document.getElementById('st-root');w.click(st,{stOpen:'req'});
  assert.match(st.innerHTML,/2 requests sent today/);assert.match(st.innerHTML,/Sent today: Ask the client to confirm the tobacco threshold/);assert.match(st.innerHTML,/Sent today: Tell the client the funding-date impact/);
  // Escalation lists the steps taken first; telling the client of the date impact is now done.
  w.click(st,{stOpen:'plan'});const path=st.innerHTML.slice(st.innerHTML.indexOf('st-path'));assert.match(path,/Client informed of the date impact<\/span><small>Sent from the agent run/);assert.doesNotMatch(path.slice(0,path.indexOf('</ol>')),/class="next"/);
});

test('one framework, many variations',()=>{
  const {context}=openWorkspace();const O=context.window.SA_ONBOARD,F=context.window.SA_FRAMEWORK;
  assert.equal(F.HISTORY.length,146);assert.equal(F.MINED.learned.length,O.RULES.length,'every rule is learned from onboarding history');
  for(const r of F.MINED.learned){assert(r.n>=3&&r.support>=0.8);assert(r.examples.length>0);}
  assert.equal(F.MINED.proposals.length,2);for(const p of F.MINED.proposals)assert(p.hits>0&&p.hits<=p.n);
  for(const p of O.PROFILES){const r=O.configure(p.cfg);assert.equal(r.acts.length,10);assert(r.servicing.service);}
  const sa=O.configure(O.PROFILES[0].cfg);assert.equal(sa.conflicts.length,0);
  const cit=O.configure({...O.PROFILES[0].cfg,vehicle:'cit'});assert(cit.conflicts.some(c=>/pooled/.test(c)));
  const tm=O.configure({...O.PROFILES[0].cfg,funding:'inkind',tm:'yes'});assert(tm.acts.find(a=>a.id==='funding').changes.some(c=>/transition manager/i.test(c.text)));
});
