// Workspace-wide interactions: focus a workflow task and its dependencies, smooth section jumps, and source previews on citations.
(function(){
if(typeof document==='undefined'||!document.addEventListener)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Workflow focus: highlight a task, what it waits on and what it unlocks.
function clearFocus(){document.querySelectorAll('.wf-task.is-focus,.wf-task.is-dep,.wf-task.is-next').forEach(x=>x.classList.remove('is-focus','is-dep','is-next'));document.querySelector('.wf-focusbar')?.remove();document.querySelector('.wf-phase')?.closest('.body')?.classList.remove('wf-focusing');}
function focusTask(id){
  const el=document.getElementById('wf-'+id);if(!el)return;
  clearFocus();
  const rows=[...el.querySelectorAll('.wf-links-row')],ids=row=>row?[...row.querySelectorAll('[data-focus-task]')].map(b=>b.dataset.focusTask):[];
  const deps=ids(rows.find(r=>r.querySelector('.wf-label.up'))),next=ids(rows.find(r=>r.querySelector('.wf-label.down')));
  el.classList.add('is-focus');
  deps.forEach(d=>document.getElementById('wf-'+d)?.classList.add('is-dep'));
  next.forEach(d=>document.getElementById('wf-'+d)?.classList.add('is-next'));
  el.closest('.body')?.classList.add('wf-focusing');
  el.scrollIntoView({block:'center',behavior:'smooth'});
  const title=el.querySelector('h3')?.textContent||'';
  const bar=document.createElement('div');bar.className='wf-focusbar';bar.setAttribute('role','status');
  bar.innerHTML=`<span class="wf-focusbar-id">${esc(id)}</span><span class="wf-focusbar-text"><b>${esc(title)}</b><small><i class="up"></i>${deps.length} it depends on <i class="down"></i>${next.length} it unlocks</small></span><button type="button" data-clear-focus>Clear</button>`;
  document.body.appendChild(bar);
}
document.addEventListener('click',e=>{
  const t=e.target;if(!t?.closest)return;
  const f=t.closest('[data-focus-task]');
  if(f?.dataset?.focusTask){const id=f.dataset.focusTask;if(f.dataset.view)setTimeout(()=>focusTask(id),30);else focusTask(id);return;}
  const j=t.closest('[data-scroll-to]');
  if(j?.dataset?.scrollTo){document.getElementById(j.dataset.scrollTo)?.scrollIntoView({block:'start',behavior:'smooth'});return;}
  if(t.closest('[data-view]')?.dataset?.view)document.querySelector('.wf-focusbar')?.remove?.();
  if(t.closest('[data-clear-focus]')?.hasAttribute?.('data-clear-focus'))clearFocus();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.wf-focusbar'))clearFocus();});

// Citation preview card.
let pop=null,owner=null;
function hide(){if(pop)pop.classList.remove('show');owner=null;}
function show(el){
  const id=el.dataset.source||el.dataset.mapSource,p=window.EVIDENCE_DECK?.passage(id);if(!p)return;
  if(!pop){pop=document.createElement('div');pop.className='cite-pop';pop.setAttribute('role','tooltip');document.body.appendChild(pop);}
  owner=el;
  pop.innerHTML=`<div class="cite-pop-top"><span>${esc(p.chunk.id)}</span><em>${esc(p.doc.kind)} · ${esc(p.doc.status)}</em></div><b>${esc(p.doc.title)}</b><small>${esc(p.chunk.heading)} · ${esc(p.doc.date)}</small><p>${esc(p.chunk.text)}</p>${el.dataset.source?'<i>Click to open the full source</i>':''}`;
  const r=el.getBoundingClientRect(),w=Math.min(360,innerWidth-24);pop.style.width=w+'px';
  pop.classList.add('show');
  const h=pop.offsetHeight,below=r.bottom+10+h<innerHeight;
  pop.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';
  pop.style.top=(below?r.bottom+10:r.top-10-h)+'px';
  pop.dataset.side=below?'below':'above';
}
const target=t=>t?.closest?.('.cite[data-source],[data-map-source]');
document.addEventListener('mouseover',e=>{const el=target(e.target);if(el&&el!==owner)show(el);else if(!el&&owner&&!owner.contains(e.target))hide();});
document.addEventListener('focusin',e=>{const el=target(e.target);if(el)show(el);});
document.addEventListener('focusout',hide);
window.addEventListener?.('scroll',hide,{passive:true,capture:true});
document.addEventListener('click',hide);
})();
