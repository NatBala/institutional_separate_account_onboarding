/* Tab 2 · Onboarding framework. One set of shared activities; client attributes layer variations on top. */
(function(){
const O=window.SA_ONBOARD;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// External counterpart for an activity, by client structure. Falls back to the activity default.
const EXT={
 consultant:{reporting:'Client reporting contact; consultant copied',service:'Client; consultant advises'},
 ocio:{service:'OCIO relationship lead',reporting:'OCIO reporting team',contract:'OCIO and plan sponsor counsel',aml:'OCIO compliance + plan sponsor',funding:'OCIO + custodian',servicing:'OCIO relationship lead'},
 subadv:{contract:'Primary adviser legal',aml:'Primary adviser compliance',ubo:'Primary adviser compliance',billing:'Primary adviser finance',reporting:'Primary adviser',service:'Primary adviser',servicing:'Primary adviser',guidelines:'Primary adviser portfolio team'},
 omnibus:{aml:'Intermediary compliance',ubo:'Intermediary compliance',service:'Intermediary platform team',account:'Intermediary operations',servicing:'Intermediary operations',funding:'Intermediary trading desk',contract:'Intermediary legal'},
 mep:{contract:'Pooled plan provider counsel',aml:'Pooled plan provider',ubo:'Pooled plan provider',service:'Pooled plan provider + recordkeeper',funding:'Recordkeeper',servicing:'Recordkeeper',billing:'Pooled plan provider'}
};
const VEH_EXT={cit:{account:'CIT trustee + recordkeeper'},mf:{account:'Transfer agent',billing:'— (share class)'}};
const TAG={added:'Added',replaced:'Replaced',adjusted:'Adjusted'};
const markup='<div id="fw-root" class="fw"></div>';
function mount(root,opt={}){
 const state={profile:'alpenridge',cfg:JSON.parse(JSON.stringify(O.PROFILES[0].cfg))};
 const match=()=>O.PROFILES.find(p=>JSON.stringify({...p.cfg,restrictions:[...p.cfg.restrictions].sort()})===JSON.stringify({...state.cfg,restrictions:[...state.cfg.restrictions].sort()}));
 function controls(){return `<aside class="fw-controls panel"><h3>Client attributes</h3><p class="smalltext">The activities never change. These attributes change how each one is done.</p>${O.ATTRS.map(a=>`<div class="fw-attr"><span class="wr-label">${esc(a.name)}</span><div class="fw-opts" role="${a.multi?'group':'radiogroup'}" aria-label="${esc(a.name)}">${a.options.map(([v,l])=>{const on=a.multi?state.cfg[a.id].includes(v):state.cfg[a.id]===v;return `<button type="button" ${a.multi?`aria-pressed="${on}"`:`role="radio" aria-checked="${on}"`} class="${on?'active':''}" data-fw-attr="${a.id}" data-fw-val="${v}">${esc(l)}</button>`;}).join('')}${a.multi?`<button type="button" aria-pressed="${!state.cfg[a.id].length}" class="${!state.cfg[a.id].length?'active':''}" data-fw-attr="${a.id}" data-fw-val="">None</button>`:''}</div></div>`).join('')}</aside>`;}
 function lens(r){const v=O.ATTRS[0].options.find(o=>o[0]===state.cfg.vehicle)[1],c=O.ATTRS[1].options.find(o=>o[0]===state.cfg.relationship)[1],s=r.servicing;
  return `<section class="fw-lens"><div class="fw-tree" aria-label="Client structure"><div class="eyebrow">Client structure lens</div><b>${esc(v)}</b><ul>${O.ATTRS[1].options.map(([k,l])=>`<li class="${k===state.cfg.relationship?'on':''}"><button type="button" data-fw-attr="relationship" data-fw-val="${k}">${esc(l)}</button></li>`).join('')}</ul></div>
  <dl class="fw-serv"><div><dt>Who services the account</dt><dd>${esc(s.service)}</dd></div><div><dt>Channel</dt><dd>${esc(s.channel)}</dd></div><div><dt>Intermediary</dt><dd>${esc(s.intermediary)}</dd></div><div><dt>Instructing party</dt><dd>${esc(s.instructing)}</dd></div></dl>
  <div class="fw-count"><strong>${r.touched}<em> of ${r.acts.length}</em></strong><span>shared activities changed for ${esc(c.toLowerCase())} · ${esc(v.toLowerCase())}</span></div></section>`;}
 function card(a){const ext=(VEH_EXT[state.cfg.vehicle]||{})[a.id]||(EXT[state.cfg.relationship]||{})[a.id]||(a.id==='funding'&&state.cfg.tm==='yes'?'Transition manager + custodian':a.ext),changed=a.changes.some(c=>c.effect!=='adjusted'||c.effort>0);
  return `<article class="fw-act ${changed?'changed':''}"><div class="fw-act-name"><b>${esc(a.name)}</b><span class="fw-effort fw-e${a.effort}">${O.EFFORT[a.effort]}</span><p>${esc(a.base)}</p></div><dl><div><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])}</dd></div><div><dt>External contact</dt><dd>${esc(ext)}</dd></div></dl>${a.changes.length?`<ul>${a.changes.map(c=>`<li class="fw-${c.effect}"><span>${TAG[c.effect]}</span>${esc(c.text)}<small>${esc(c.by)}</small></li>`).join('')}</ul>`:'<p class="fw-std">Standard activity, no variation.</p>'}</article>`;}
 function render(){const r=O.configure(state.cfg),m=match();
  root.innerHTML=`<div class="fw-profiles"><span class="wr-label">Start from</span>${O.PROFILES.map(p=>`<button type="button" class="${m?.id===p.id?'active':''}" data-fw-profile="${p.id}" title="${esc(p.note)}">${esc(p.label)}</button>`).join('')}${m?'':'<span class="fw-custom">Custom combination</span>'}</div>
  <div class="fw-layout">${controls()}<div class="fw-main">${lens(r)}${r.conflicts.length?`<div class="notice warn fw-conflicts"><b>Check this combination</b><ul>${r.conflicts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>`:''}
  <div class="fw-stages"><div class="fw-cols" aria-hidden="true"><span>Shared activity</span><span>Who is involved</span><span>Variation for this client</span></div>${O.STAGES.map((st,i)=>`<section class="fw-stage"><h3><span>${String(i+1).padStart(2,'0')}</span>${esc(st.name)}</h3>${r.acts.filter(a=>a.stage===i).map(card).join('')}</section>`).join('')}</div>
  <p class="legend">Illustrative framework built on synthetic data. Variations describe typical differences between structures; confirm each against firm policy before use. Effort shows how much the attributes add to the activity, not elapsed days.</p></div></div>`;}
 function onClick(e){const b=e.target.closest('button');if(!b||!root.contains(b))return;const d=b.dataset;
  if(d.fwProfile){const p=O.PROFILES.find(x=>x.id===d.fwProfile);state.cfg=JSON.parse(JSON.stringify(p.cfg));render();return;}
  if(d.fwAttr){const a=O.ATTRS.find(x=>x.id===d.fwAttr);if(a.multi){const cur=state.cfg[a.id];state.cfg[a.id]=d.fwVal===''?[]:cur.includes(d.fwVal)?cur.filter(x=>x!==d.fwVal):[...cur,d.fwVal];}else state.cfg[a.id]=d.fwVal;render();}}
 render();root.addEventListener('click',onClick);
 return ()=>root.removeEventListener('click',onClick);
}
window.SA_FRAMEWORK={markup,mount};
})();
