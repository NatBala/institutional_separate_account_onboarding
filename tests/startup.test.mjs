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
  // Retired views from earlier releases must fall back to the first tab.
  const views=['system','run','workflow','live','riskmap','brief'];
  for(const scenario of ['initial','clarified','cash'])for(const view of views){
    const w=openWorkspace({view,scenario});assert.match(w.app.innerHTML,/Separate Account/);
    assert.match(w.app.innerHTML,/Multi-agent system/);assert.doesNotMatch(w.app.innerHTML,/Requirements evidence|Live agent workspace/);
    w.click(w.document,{view:'system'});assert.match(w.app.innerHTML,/Operational risk agent/);assert.match(w.app.innerHTML,/Investment risk agent/);
    w.click(w.document,{view:'run'});assert.match(w.document.getElementById('agent-runner-root').innerHTML,/Run agents/);
    w.click(w.document,{view:'workflow'});const root=w.document.getElementById('wr-root');
    assert.match(root.querySelector('#wr-flow').innerHTML,/Accept mandate annexes/);
    assert.match(root.querySelector('#wr-sticky').innerHTML,/Projected funding date/);
    assert.match(root.querySelector('#wr-body-reporting').innerHTML,/Why/);
  }
});

test('workflow business-day model uses the longest workstream, not the sum',()=>{
  const {context}=openWorkspace();const W=context.window.SA_WORKFLOW;
  const at=id=>W.compute(W.PRESETS.find(p=>p.id===id).levels);
  assert.deepEqual([...at('standard').total],[45,46]);
  assert.deepEqual([...at('initial').total],[50,58]);
  assert.deepEqual([...at('clarified').total],[50,58]);
  assert.deepEqual([...at('cash').total],[49,54]);
  for(const p of W.PRESETS){const c=W.compute(p.levels);assert(c.add[1]<=c.naive[1]+3);assert(c.total[0]<=c.total[1]);}
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
  assert.match(root.innerHTML,/Agent outputs · 6 of 6 ready/);
});

test('playback pauses after each agent and keeps its output',()=>{
  const w=openWorkspace();w.click(w.document,{start:''});
  const root=w.document.getElementById('agent-runner-root');
  const drain=()=>{for(let i=0;i<40;i++){const [id,fn]=[...w.timers][0]||[];if(!id)return;w.timers.delete(id);fn();}};
  drain();assert.match(root.innerHTML,/Operations confirms the client context/);
  w.click(root,{runAction:'confirm-context'});drain();
  assert.match(root.innerHTML,/Precedent agent finished/);assert.match(root.innerHTML,/Agent outputs · 2 of 6 ready/);
  w.click(root,{runAction:'play'});drain();assert.match(root.innerHTML,/risk agent finished/);
});
