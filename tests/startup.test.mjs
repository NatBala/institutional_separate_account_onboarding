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
    assert.match(st.innerHTML,/Onboardings in flight/);assert.match(st.innerHTML,/Risk concentration/);assert.match(st.innerHTML,/See how the agents build its plan/);
    w.click(w.document,{view:'agents'});assert.match(w.app.innerHTML,/Key players agent/);assert.match(w.app.innerHTML,/Investment risk agent/);assert.match(w.app.innerHTML,/data-start/);
    assert.match(w.document.getElementById('agent-runner-root').innerHTML,/Run agents/);
    w.click(w.document,{view:'output'});
    for(const part of [/Produced by/,/PAPERWORK/,/Issues affecting the timeline/,/Who acts next/,/Escalation and communication/,/What the client asked for/,/Contractual obligations/,/Key players/,/What-if: if a task slips/])assert.match(st.innerHTML,part);
    assert.match(w.app.innerHTML,/What-if: if the client’s requirements change/);
    w.click(st,{stStage:'3'});assert.match(st.innerHTML,/Account funded/);
    w.click(st,{stSimDays:'5'});assert.match(st.innerHTML,/Who gets notified/);assert.match(st.innerHTML,/Thu 26 Nov<\/strong>/,'the plan & status section ignores the what-if');
    w.click(st,{stSim:'O4'});assert.match(st.innerHTML,/Unchanged: the delay is absorbed by slack/);
    const root=w.document.getElementById('wr-root');
    assert.match(root.innerHTML,/Onboarding duration/);assert.doesNotMatch(root.innerHTML,/launch date|funding date|Just added/i);
    assert.match(root.innerHTML,/What this level means/);assert.match(root.innerHTML,/Why \+/);
    w.click(root,{tab:'team'});assert.match(root.innerHTML,/Accept mandate annexes/);
    w.click(root,{highlight:'all'});assert.match(root.innerHTML,/Portfolio management/);
    w.click(root,{tab:'math'});assert.match(root.innerHTML,/Add the longest workstream, not the sum/);
    w.click(root,{tab:'area'});assert.match(root.innerHTML,/Impact:/);
    w.click(root,{levelSet:'reporting:0'});assert.match(root.innerHTML,/Reporting service: (High|Medium) → Low|Onboarding duration/);assert.doesNotMatch(root.innerHTML,/steps? added/);
    w.click(w.document,{view:'framework'});const fw=w.document.getElementById('fw-root');
    assert.match(fw.innerHTML,/Client structure lens/);assert.match(fw.innerHTML,/Beneficial owner review/);
    w.click(fw,{fwProfile:'omnibus'});assert.match(fw.innerHTML,/Intermediary performs underlying-investor KYC/);
    w.click(fw,{fwAttr:'restrictions',fwVal:'tobacco'});assert.match(fw.innerHTML,/Check this combination/);
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
  const path=O.escalation(s.map.P1,s);assert(path[0].hit&&path.at(-1).hit,'funding date moved, so leadership is notified');
  assert.equal(O.book().length,14);
});

test('one framework, many variations',()=>{
  const {context}=openWorkspace();const O=context.window.SA_ONBOARD;
  for(const p of O.PROFILES){const r=O.configure(p.cfg);assert.equal(r.acts.length,10);assert(r.servicing.service);}
  const sa=O.configure(O.PROFILES[0].cfg);assert.equal(sa.conflicts.length,0);
  const cit=O.configure({...O.PROFILES[0].cfg,vehicle:'cit'});assert(cit.conflicts.some(c=>/pooled/.test(c)));
  const tm=O.configure({...O.PROFILES[0].cfg,funding:'inkind',tm:'yes'});assert(tm.acts.find(a=>a.id==='funding').changes.some(c=>/transition manager/i.test(c.text)));
});
