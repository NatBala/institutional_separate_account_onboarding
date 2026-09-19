import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual shipped scripts with a small DOM adapter. This catches
// startup/interaction exceptions; it does not substitute for visual browser QA.
function openWorkspace(saved={}) {
  class Element {
    constructor(){this.innerHTML='';this.textContent='';this.dataset={};this.style={};this.listeners={};this.children=new Map();this.isConnected=true;}
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
  const records=new Map([['sa-corpus-demo-v1',JSON.stringify(saved)]]);
  const timers=new Map();let timerId=0;
  const context=vm.createContext({window:{scrollTo(){}},document,
    localStorage:{getItem:k=>records.get(k),setItem:(k,v)=>records.set(k,v)},
    setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),
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
  const views=['brief','run','riskmap','corpus','agents','cases','risks','rules','workflow','review','presenter'];
  for(const scenario of ['initial','clarified','cash'])for(const view of views){
    const w=openWorkspace({view,scenario});assert.match(w.app.innerHTML,/Separate Account/);
    assert.match(w.app.innerHTML,/Run agents/);
    w.click(w.document,{view:'run'});assert.match(w.document.getElementById('agent-runner-root').innerHTML,/Run agents/);
    w.click(w.document,{view:'riskmap'});assert.match(w.document.getElementById('sa-route-risk').querySelector('#rr-columns').innerHTML,/Clarify restriction intent/);
    w.click(w.document,{view:'brief'});assert.match(w.app.innerHTML,/Alpenridge Pension Foundation/);
  }
});

test('Run agents progresses to context and planning checkpoints',()=>{
  const w=openWorkspace();w.click(w.document,{start:''});
  const root=w.document.getElementById('agent-runner-root');
  for(let i=0;i<12&&!root.innerHTML.includes('Operations confirms the client context');i++)w.click(root,{runAction:'step'});
  assert.match(root.innerHTML,/Operations confirms the client context/);
  w.click(root,{runAction:'confirm-context'});
  for(let i=0;i<40&&!root.innerHTML.includes('Review the working planning draft');i++)w.click(root,{runAction:'step'});
  assert.match(root.innerHTML,/Review the working planning draft/);
});
