// Evidence presented as tiles: pick a tile to open it in the detail box, then step through with previous/next or the arrow keys.
(function(){
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function passage(id){for(const d of window.CORPUS?.documents||[]){const c=d.chunks.find(c=>c.id===id);if(c)return {doc:d,chunk:c};}return null;}
const statusTone={current:'teal','new evidence':'amber',superseded:'red',historical:''};
const docIcon=d=>`<span class="ev-doc"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M3 1.5h12l6.5 6.5v18.5H3z" fill="#fff" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15 1.5V8h6.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg><b>${esc(d.id)}</b></span>`;
function meta(d){return `<span class="ev-chip">${esc(d.kind)}</span><span class="ev-chip ${statusTone[d.status]||''}">${esc(d.status)}</span><span class="ev-meta-text">${esc(d.owner)} · ${esc(d.date)} · v${esc(d.version)}</span>`;}
// One slide per cited passage.
function sourceSlide(id){
  const p=passage(id);
  if(!p)return {tab:id,tile:{title:'Source record',excerpt:''},html:`<div class="ev-slide-body"><p class="ev-quote">Source passage unavailable in this snapshot.</p></div>`};
  const {doc,chunk}=p;
  return {tab:id,tile:{title:doc.title,kind:doc.kind,excerpt:chunk.text},html:`<header class="ev-slide-head">${docIcon(doc)}<div><div class="ev-kicker">${esc(chunk.id)} · ${esc(chunk.heading)}</div><h4>${esc(doc.title)}</h4><div class="ev-meta">${meta(doc)}</div></div></header><blockquote class="ev-quote">${esc(chunk.text)}</blockquote><footer class="ev-slide-foot"><button type="button" class="btn small" data-source="${esc(chunk.id)}">Open full source document</button></footer>`};
}
// One slide per evidence finding, listing the passages that support it.
function findingSlide([label,refs,text]){
  return {tab:label,tile:{title:text,kind:`${refs.length} source${refs.length===1?'':'s'}`,excerpt:''},html:`<div class="ev-kicker">${esc(label)}</div><p class="ev-finding">${esc(text)}</p><div class="ev-passages">${refs.map(id=>{const p=passage(id);return `<button type="button" class="ev-passage" data-source="${esc(id)}"><span class="ev-passage-id">${esc(id)}</span><span class="ev-passage-text"><b>${esc(p?p.doc.title:'Source record')}</b>${p?`<em>${esc(p.chunk.heading)}</em><span>${esc(p.chunk.text)}</span>`:''}</span><i aria-hidden="true">↗</i></button>`;}).join('')}</div>`};
}
function deck(slides,{label='Evidence',compact=false}={}){
  if(!slides.length)return '';
  const n=slides.length;
  return `<div class="ev-deck ${compact?'compact':''}" data-deck data-index="0" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(label)}">
    <div class="ev-deck-top"><span class="ev-deck-label">${esc(label)}</span><span class="ev-count" aria-live="polite"><b>1</b> of ${n}</span></div>
    ${n>1?`<div class="ev-tiles" role="tablist">${slides.map((s,i)=>`<button type="button" role="tab" class="ev-tile ${i?'':'active'}" data-deck-go="${i}" aria-selected="${!i}"><span class="ev-tile-top"><span class="ev-tile-num">${i+1}</span><b>${esc(s.tab)}</b>${s.tile?.kind?`<em>${esc(s.tile.kind)}</em>`:''}</span><span class="ev-tile-title">${esc(s.tile?.title||'')}</span>${s.tile?.excerpt?`<span class="ev-tile-excerpt">${esc(s.tile.excerpt)}</span>`:''}</button>`).join('')}</div>`:''}
    <div class="ev-viewport"><div class="ev-track">${slides.map((s,i)=>`<article class="ev-slide" aria-roledescription="slide" aria-label="${i+1} of ${n}" ${i?'aria-hidden="true" inert':''}>${s.html}</article>`).join('')}</div></div>
    ${n>1?`<div class="ev-nav"><button type="button" class="ev-step" data-deck-step="-1" aria-label="Previous evidence" disabled><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>Previous</button><div class="ev-dots">${slides.map((s,i)=>`<button type="button" class="ev-dot ${i?'':'active'}" data-deck-go="${i}" aria-label="Show evidence ${i+1}"></button>`).join('')}</div><button type="button" class="ev-step next" data-deck-step="1" aria-label="Next evidence">Next<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></button></div>`:''}
  </div>`;
}
function go(el,i){
  const slides=el.querySelectorAll('.ev-slide'),n=slides.length;if(!n)return;
  i=Math.max(0,Math.min(n-1,i));el.dataset.index=i;
  el.querySelector('.ev-track').style.transform=`translateX(${-100*i}%)`;
  slides.forEach((s,k)=>{const on=k===i;s.toggleAttribute('inert',!on);s.setAttribute('aria-hidden',String(!on));});
  el.querySelectorAll('[data-deck-go]').forEach(b=>{const on=Number(b.dataset.deckGo)===i;b.classList.toggle('active',on);if(b.getAttribute('role')==='tab')b.setAttribute('aria-selected',String(on));});
  const count=el.querySelector('.ev-count b');if(count)count.textContent=i+1;
  el.querySelectorAll('[data-deck-step]').forEach(b=>b.disabled=Number(b.dataset.deckStep)<0?i===0:i===n-1);
}
if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-deck-step],[data-deck-go]');if(!b||(b.dataset?.deckStep===undefined&&b.dataset?.deckGo===undefined))return;const el=b.closest('[data-deck]');if(!el)return;go(el,b.dataset.deckGo!==undefined?Number(b.dataset.deckGo):Number(el.dataset.index)+Number(b.dataset.deckStep));});
  document.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;const el=e.target?.closest?.('[data-deck]');if(!el||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;e.preventDefault();go(el,Number(el.dataset.index)+(e.key==='ArrowRight'?1:-1));});
  let startX=null;
  document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('.ev-viewport'))startX=e.clientX;});
  document.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;const el=e.target?.closest?.('[data-deck]');if(el&&Math.abs(dx)>50)go(el,Number(el.dataset.index)+(dx<0?1:-1));});
}
// Sync a freshly rendered deck's controls with its current index.
function settle(scope){scope?.querySelectorAll?.('[data-deck]').forEach(el=>go(el,Number(el.dataset.index)||0));}
window.EVIDENCE_DECK={deck,sourceSlide,findingSlide,settle,passage};
})();
