/* Tab 4 · One framework, many variations. A matrix shows the same ten activities across client types (scale at a
   glance); picking a client replays how the agents adapt the framework to it: documents → attributes → rules →
   precedent → risk → plan → owners → evidence review. Outputs are prepared; rule matching runs locally. */
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
const extFor=(cfg,a)=>(VEH_EXT[cfg.vehicle]||{})[a.id]||(EXT[cfg.relationship]||{})[a.id]||(a.id==='funding'&&cfg.tm==='yes'?'Transition manager + custodian':a.ext);
const TAG={added:'Added',replaced:'Replaced',adjusted:'Adjusted'};
const ATTR=id=>O.ATTRS.find(a=>a.id===id),label=(id,v)=>ATTR(id).options.find(o=>o[0]===v)?.[1]||v;
// Columns: the client types shown in the matrix, plus a configurable one.
const COLS=[['alpenridge','Alpenridge','SA · consultant'],['cit','401(k) plan','CIT · consultant'],['ocio','Endowment','SA · OCIO'],['subadv','Adviser fund','SA · sub-advisory'],['omnibus','Platform','Fund · omnibus'],['mep','Pooled plan','CIT · MEP/PEP'],['custom','Your mix','Set it yourself']];
// What the Context agent reads for each client, and the attributes it finds. Alpenridge quotes the corpus; the rest are synthetic.
const DOCS={
 alpenridge:[
  {src:'N01§1',cite:true,text:'…selected us for a USD-equivalent 250 million global investment-grade bond separate account.',attrs:[['vehicle','sa']]},
  {src:'N01§2',cite:true,text:'The consultant says another Swiss pension client receives weekly reporting.',attrs:[['relationship','consultant']]},
  {src:'N08§1',cite:true,text:'Use USD-equivalent 250 million cash at inception. We will retain the legacy securities with the outgoing manager.',attrs:[['funding','cash'],['tm','no']]},
  {src:'N07§1',cite:true,text:'Weekly CHF holdings on Tuesday by 12:00 is acceptable. Performance, attribution and ESG analytics can be monthly.',attrs:[['reporting','standard']]},
  {src:'N02§1',cite:true,text:'…shall not purchase securities of companies deriving more than 5% of annual revenue from tobacco production.',attrs:[['restrictions','tobacco']]},
  {src:'N02§2',cite:true,text:'Investment in companies involved in thermal coal is prohibited.',attrs:[['restrictions','esg']]},
  {src:'N02§3',cite:true,text:'FX forwards and interest-rate futures are within the proposed permitted instruments.',attrs:[['restrictions','derivs']]},
  {src:'RM fee note',text:'Client asked for a fee schedule with a breakpoint above USD 200 million.',attrs:[['billing','negotiated']]}],
 cit:[
  {src:'Consultant search report',text:'We recommend the collective investment trust class for the 401(k) core line-up.',attrs:[['vehicle','cit'],['relationship','consultant']]},
  {src:'Recordkeeper conversion memo',text:'Assets move in cash from the current recordkeeper on the conversion date.',attrs:[['funding','cash'],['tm','no']]},
  {src:'Plan sponsor email',text:'Standard trust reporting is fine; the committee reviews it quarterly.',attrs:[['reporting','standard']]},
  {src:'Investment policy statement',text:'The plan relies on the fund’s own guidelines. No plan-specific exclusions.',attrs:[['restrictions','none']]},
  {src:'Fee exhibit',text:'The plan will use the standard CIT fee class.',attrs:[['billing','standard']]}],
 ocio:[
  {src:'OCIO mandate letter',text:'Acting under delegated discretion for the endowment, we appoint you to manage a separate account.',attrs:[['vehicle','sa'],['relationship','ocio']]},
  {src:'Transition plan',text:'Legacy holdings move in kind. A transition manager will run the T-day trade.',attrs:[['funding','inkind'],['tm','yes']]},
  {src:'OCIO reporting request',text:'Monthly data in our aggregation template by business day 3.',attrs:[['reporting','custom']]},
  {src:'Endowment ESG policy',text:'Exclude issuers with more than 10% of revenue from thermal coal.',attrs:[['restrictions','esg']]},
  {src:'Fee proposal',text:'Tiered fee schedule with a performance component.',attrs:[['billing','negotiated']]}],
 subadv:[
  {src:'Sub-advisory agreement draft',text:'The adviser appoints you as sub-adviser for a separately managed sleeve of its fund.',attrs:[['vehicle','sa'],['relationship','subadv']]},
  {src:'Funding note',text:'The sleeve will be funded with cash at inception.',attrs:[['funding','cash'],['tm','no']]},
  {src:'Adviser operations email',text:'We need a daily holdings file for our risk system.',attrs:[['reporting','custom']]},
  {src:'Sleeve guidelines',text:'Currency forwards are permitted for hedging.',attrs:[['restrictions','derivs']]},
  {src:'Term sheet',text:'Sub-advisory fee as agreed, paid by the adviser.',attrs:[['billing','negotiated']]}],
 omnibus:[
  {src:'Platform agreement draft',text:'The platform will buy fund shares for its advisory clients through one omnibus account.',attrs:[['relationship','omnibus']]},
  {src:'Fund account application',text:'Application for an institutional share class of the fund. The prospectus governs.',attrs:[['vehicle','mf'],['restrictions','none']]},
  {src:'Trading set-up',text:'Purchases settle by daily net wire through the transfer agent.',attrs:[['funding','cash'],['tm','no']]},
  {src:'Platform operations email',text:'Standard fund statements and fact sheets are enough.',attrs:[['reporting','standard']]},
  {src:'Pricing note',text:'The share-class expense ratio applies; no separate fee.',attrs:[['billing','standard']]}],
 mep:[
  {src:'Pooled plan provider RFP',text:'As pooled plan provider for 40 participating employers, we are adding your CIT to the plan menu.',attrs:[['vehicle','cit'],['relationship','mep']]},
  {src:'Recordkeeper memo',text:'Contributions arrive as cash through the recordkeeper.',attrs:[['funding','cash'],['tm','no']]},
  {src:'RFP reporting section',text:'Standard trust-level reporting.',attrs:[['reporting','standard']]},
  {src:'Plan investment policy',text:'No plan-specific exclusions.',attrs:[['restrictions','none']]},
  {src:'Fee exhibit',text:'Standard CIT fee class.',attrs:[['billing','standard']]}]
};
// Similar onboardings the Precedent agent finds: the book in flight and the closed-case history.
const PRECEDENT={
 alpenridge:[['H02 Northbridge','Same >5% vs ≥5% tobacco clash'],['H05 Rhinebridge','Weekly CHF reporting agreed in week 1'],['H03 Seabrook','Bond-only start, derivatives later']],
 cit:[['Corbel Health 401(k) Plan','CIT via consultant · funding on track'],['Harrow County Retirement System','CIT · in operational setup']],
 ocio:[['Pinecrest University Endowment','OCIO · funding at risk'],['Kestrel Insurance General Account','OCIO · intake']],
 subadv:[['Northfold Advisors sleeve','Sub-advisory · contracts 6 days late']],
 omnibus:[['Atlas Brokerage Omnibus','Omnibus · funding on track'],['Meridian Wealth Platform','Omnibus · AML/KYC at risk']],
 mep:[['TrueNorth Pooled Employer Plan','MEP/PEP · contracts 5 days late']],
 custom:[]
};
const AGENTS=[['A1','Context agent','Reads the documents and finds the client’s attributes'],['H1','Human check','Operations confirms the attributes'],['FW','Framework','Matching rules applied to the ten activities'],['A2','Precedent agent','Finds onboardings with the same variations'],['A3·A4','Risk agents','Flags heavy variations and combinations that don’t work'],['A5','Playbook agent','Turns activities and variations into tasks'],['A6','Key players agent','Names the external contact for each activity'],['A7','Evidence reviewer','Checks every variation traces to a source'],['H2','Ready for human review','']];
const totalRules=O.RULES.length,combos=O.ATTRS.reduce((n,a)=>n*(a.multi?2**a.options.length:a.options.length),1);
const markup='<div id="fw-root" class="fx"></div>';
function mount(root,opt={}){
 const state={col:null,cell:null,step:-1,custom:JSON.parse(JSON.stringify(O.PROFILES.find(p=>p.id==='cit').cfg)),playing:false};
 let timer=null;
 const cfgFor=col=>col==='custom'?state.custom:O.PROFILES.find(p=>p.id===col).cfg;
 const resultFor=col=>O.configure(cfgFor(col));
 const nDocs=col=>col==='custom'?0:DOCS[col].length;
 // Event timeline for one client: each document, the human check, ten activities, then one event per downstream agent.
 const startOf=col=>{const d=nDocs(col);return {docs:0,h1:d,fw:d+1,a2:d+11,risk:d+12,a5:d+13,a6:d+14,a7:d+15,done:d+16};};
 const lastStep=col=>startOf(col).done;
 function cell(col,a,i,result){const s=startOf(col),pending=state.col===col&&state.step<s.fw+i;if(pending)return `<td class="fx-cell pending" aria-label="Waiting for the agents"><span>…</span></td>`;
  const ch=result.acts[i].changes,rep=ch.some(c=>c.effect==='replaced'),add=ch.filter(c=>c.effect==='added').length,adj=ch.some(c=>c.effect==='adjusted');
  const [cls,txt]=rep?['rep','Replaced'+(add?` +${add}`:'')]:add?['add',`+${add} added`]:adj?['adj','Adjusted']:['std','Standard'];
  const fresh=state.col===col&&state.playing&&state.step===s.fw+i;
  return `<td class="fx-cell ${cls} ${fresh?'fresh':''} ${state.cell===col+'|'+a.id?'sel':''}"><button type="button" data-fx-cell="${col}|${a.id}" title="${esc(a.name)}: ${esc(ch.map(c=>TAG[c.effect]+' · '+c.text).join(' | ')||'Standard activity')}">${txt}</button></td>`;}
 function matrix(){const results=Object.fromEntries(COLS.map(([c])=>[c,resultFor(c)]));
  return `<section class="panel fx-matrix"><div class="fx-mhead"><h3>Ten shared activities × every client type</h3><p class="smalltext">Rows never change; each cell shows how one activity varies for one client. Click a client to watch the agents adapt it.</p></div>
  <div class="fx-table-wrap"><table class="fx-table"><thead><tr><th class="fx-corner">Shared activity</th>${COLS.map(([c,name,sub])=>`<th class="${state.col===c?'sel':''} ${c==='custom'?'custom':''}"><button type="button" data-fx-col="${c}" aria-pressed="${state.col===c}"><b>${esc(name)}</b><small>${esc(sub)}</small></button></th>`).join('')}</tr></thead>
  <tbody>${O.STAGES.map((st,si)=>O.ACTIVITIES.map((a,i)=>a.stage!==si?'':`<tr><th scope="row" title="${esc(st.name)}"><span>${esc(a.name)}</span></th>${COLS.map(([c])=>cell(c,a,i,results[c])).join('')}</tr>`).join('')).join('')}</tbody>
  <tfoot><tr><th scope="row">Activities that vary</th>${COLS.map(([c])=>`<td>${state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.filter(a=>a.changes.length).length+'/10'}</td>`).join('')}</tr><tr><th scope="row">Rules reused</th>${COLS.map(([c])=>`<td>${state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.reduce((n,a)=>n+a.changes.length,0)}</td>`).join('')}</tr><tr><th scope="row">New process steps</th>${COLS.map(()=>`<td class="zero">0</td>`).join('')}</tr></tfoot></table></div>
  <div class="fx-legend"><span class="std">Standard</span><span class="adj">Adjusted</span><span class="rep">Replaced</span><span class="add">+ Added</span><em>Hover or click a cell for the detail</em></div>
  ${cellDetail()}</section>`;}
 function cellDetail(){if(!state.cell)return '';const [col,aid]=state.cell.split('|'),cfg=cfgFor(col),r=resultFor(col),a=r.acts.find(x=>x.id===aid),name=COLS.find(c=>c[0]===col)[1];
  return `<div class="fx-detail"><div class="split"><b>${esc(a.name)} · ${esc(name)}</b><button type="button" class="ob-x" data-fx-cell="" aria-label="Close">×</button></div><p class="smalltext">${esc(a.base)}</p><dl><div><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])}</dd></div><div><dt>External contact</dt><dd>${esc(extFor(cfg,a))}</dd></div></dl>${a.changes.length?`<ul>${a.changes.map(c=>`<li class="fw-${c.effect}"><span>${TAG[c.effect]}</span>${esc(c.text)}<small>Rule: if ${esc(c.by)}</small></li>`).join('')}</ul>`:'<p class="fw-std">Standard activity: no rule changes it for this client.</p>'}</div>`;}
 const chip=([id,v])=>`<span class="fx-attr"><em>${esc(ATTR(id).name)}</em>${v==='none'?'None':esc(label(id,v))}</span>`;
 function stage(key,i,body){const s=startOf(state.col),[id,name,desc]=AGENTS[i],from=s[key];
  const st=key==='docs'?(state.step>=s.h1?'done':state.step>=0?'active':'wait'):key==='fw'?(state.step>=s.a2?'done':state.step>=s.fw?'active':'wait'):state.step>=from?'done':'wait';
  return `<li class="fx-step ${st}"><span class="fx-badge">${id}</span><div><b>${esc(name)}</b>${st==='wait'?`<small>${esc(desc)}</small>`:body()}</div></li>`;}
 function runPanel(){if(!state.col)return `<aside class="panel fx-run fx-intro"><h3>How the agents adapt the framework</h3><p>Pick a client column. The agents read that client’s documents, work out its attributes, apply the matching rules, and turn the result into a plan with owners. Same agents, same ten activities, every time.</p><ol class="fx-pipe">${AGENTS.slice(0,8).map(([id,name,desc])=>`<li><span class="fx-badge">${id}</span><div><b>${esc(name)}</b><small>${esc(desc)}</small></div></li>`).join('')}</ol><div class="fx-pick">${COLS.slice(0,6).map(([c,name])=>`<button type="button" class="btn small" data-fx-col="${c}">${esc(name)}</button>`).join('')}</div></aside>`;
  const col=state.col,name=COLS.find(c=>c[0]===col)[1],cfg=cfgFor(col),r=resultFor(col),s=startOf(col),docs=col==='custom'?[]:DOCS[col],done=state.step>=s.done;
  const shownDocs=docs.filter((d,i)=>state.step>=i),found=[...new Map(shownDocs.flatMap(d=>d.attrs).map(x=>[x[0]+x[1],x])).values()];
  const actsShown=Math.max(0,Math.min(10,state.step-s.fw+1)),varied=r.acts.slice(0,actsShown).filter(a=>a.changes.length),rules=r.acts.slice(0,actsShown).reduce((n,a)=>n+a.changes.length,0);
  const heavy=r.acts.flatMap(a=>a.changes.filter(c=>c.effort===2).map(c=>({a,c})));
  const tasks=r.acts.map(a=>1+a.changes.filter(c=>c.effect==='added').length),byStage=O.STAGES.map((st,si)=>r.acts.reduce((n,a,i)=>n+(a.stage===si?tasks[i]:0),0)),maxS=Math.max(...byStage);
  const contacts=[...new Map(r.acts.map(a=>[extFor(cfg,a),a.name])).entries()].filter(([c])=>c&&!c.startsWith('—'));
  const steps=[
   stage('docs',0,()=>col==='custom'?`<small>No documents: the attributes below are set by hand. In production the Context agent sets them from the client’s documents.</small>`:state.step>=s.h1?`<details class="fx-docs-done"><summary>Read ${docs.length} documents · found ${found.length} attributes</summary><div class="fx-docs">${docs.map(d=>`<div class="fx-doc"><span class="fx-src">${d.cite?`<button type="button" class="cite" data-source="${esc(d.src)}">${esc(d.src)}</button>`:esc(d.src)}</span><q>${esc(d.text)}</q><span class="fx-to">→ ${d.attrs.map(chip).join(' ')}</span></div>`).join('')}</div></details>`:`<div class="fx-docs">${shownDocs.map((d,i)=>`<div class="fx-doc ${state.playing&&state.step===i?'fresh':''}"><span class="fx-src">${d.cite?`<button type="button" class="cite" data-source="${esc(d.src)}">${esc(d.src)}</button>`:esc(d.src)}</span><q>${esc(d.text)}</q><span class="fx-to">→ ${d.attrs.map(chip).join(' ')}</span></div>`).join('')}</div>`),
   stage('h1',1,()=>`<small>${col==='custom'?'You set the attributes; a person confirms them.':'Operations confirmed the attributes.'}</small><div class="fx-attrs">${(col==='custom'?O.ATTRS.map(a=>a.multi?(cfg[a.id].length?cfg[a.id].map(v=>[a.id,v]):[[a.id,'none']]):[[a.id,cfg[a.id]]]).flat():found).map(chip).join('')}</div>`),
   stage('fw',2,()=>`<div class="fx-meter"><i style="width:${actsShown*10}%"></i></div><small><b>${varied.length}</b> of ${actsShown} activities vary so far · <b>${rules}</b> rules reused · <b>0</b> new process steps</small>`),
   stage('a2',3,()=>(PRECEDENT[col]||[]).length?`<ul class="fx-list">${PRECEDENT[col].map(([n,d])=>`<li><b>${esc(n)}</b> — ${esc(d)}</li>`).join('')}</ul>`:'<small>No onboarding with this exact mix yet, so each variation is matched rule by rule.</small>'),
   stage('risk',4,()=>`<ul class="fx-list">${r.conflicts.map(c=>`<li class="warn"><b>Check this combination.</b> ${esc(c)}</li>`).join('')}${heavy.slice(0,3).map(({a,c})=>`<li class="heavy"><b>${esc(a.name)}:</b> ${esc(c.text)}</li>`).join('')}${!r.conflicts.length&&!heavy.length?'<li>No heavy variations and no conflicts.</li>':''}</ul>`),
   stage('a5',5,()=>`<small><b>${tasks.reduce((a,b)=>a+b,0)}</b> tasks across five stages</small><div class="fx-stages">${O.STAGES.map((st,si)=>`<span><i style="height:${byStage[si]/maxS*100}%"></i><em>${byStage[si]}</em><small>${esc(st.short.replace('POST FUNDING','POST'))}</small></span>`).join('')}</div>`),
   stage('a6',6,()=>`<ul class="fx-list">${contacts.slice(0,5).map(([c,a])=>`<li><b>${esc(c)}</b> — ${esc(a)}</li>`).join('')}</ul>`),
   stage('a7',7,()=>`<small>${col==='custom'?'Attributes were set by hand, so there is no source to check. A person must confirm them.':`All <b>${r.acts.reduce((n,a)=>n+a.changes.length,0)}</b> variations trace back to a line in the client’s documents.`}</small>`),
   stage('done',8,()=>`<small>Plan, owners and risks ready for the second human checkpoint.</small>${col==='alpenridge'?'<button type="button" class="btn small primary" data-view="output">See Alpenridge’s full agent output →</button>':''}`)
  ];
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><span class="eyebrow">Agents adapting the framework</span><h3>${esc(name)}</h3></div><div class="run-buttons">${state.playing?'<button type="button" class="btn small" data-fx-act="skip">Skip ⏭</button>':`<button type="button" class="btn small primary" data-fx-act="replay">${done?'Replay':'Run'} ▶</button>`}</div></div>
  ${col==='custom'?customControls():''}<ol class="fx-pipe">${steps.join('')}</ol></aside>`;}
 function customControls(){const c=state.custom;return `<div class="fx-custom">${O.ATTRS.map(a=>`<div class="fw-attr"><span class="wr-label">${esc(a.name)}</span><div class="fw-opts">${a.options.map(([v,l])=>{const on=a.multi?c[a.id].includes(v):c[a.id]===v;return `<button type="button" class="${on?'active':''}" aria-pressed="${on}" data-fw-attr="${a.id}" data-fw-val="${v}">${esc(l)}</button>`;}).join('')}${a.multi?`<button type="button" class="${!c[a.id].length?'active':''}" data-fw-attr="${a.id}" data-fw-val="">None</button>`:''}</div></div>`).join('')}</div>`;}
 function scale(){const used=new Set();for(const [c] of COLS.slice(0,6))for(const a of resultFor(c).acts)for(const ch of a.changes)used.add(ch.attr+':'+ch.val+':'+a.id);
  return `<div class="fx-scale"><div><strong>10</strong><span>shared activities</span></div><div><strong>7</strong><span>agents, same for every client</span></div><div><strong>${totalRules}</strong><span>rules, each written once</span></div><div><strong>${combos.toLocaleString('en-US')}</strong><span>client set-ups covered</span></div><div><strong>${used.size}</strong><span>rules reused by these 6 clients</span></div><div><strong>0</strong><span>new processes designed</span></div></div>`;}
 function render(){root.innerHTML=`${scale()}<div class="fx-layout">${matrix()}${runPanel()}</div><p class="legend">Illustrative framework on synthetic data. Variations describe typical differences between structures; confirm each against firm policy before use. The agent steps for clients other than Alpenridge use short synthetic documents.</p>`;
  // Keep the agent that is working in view inside the panel.
  const panel=root.querySelector?.('.fx-run'),active=panel?.querySelector?.('.fx-step.active')||(state.step>=0&&!state.playing?null:null);
  if(panel&&active&&typeof active.offsetTop==='number')panel.scrollTop=Math.max(0,active.offsetTop-90);}
 function cancel(){if(timer!==null)clearTimeout(timer);timer=null;}
 const dur=(col,step)=>{const s=startOf(col);return step<s.h1?900:step===s.h1?700:step<s.a2?200:850;};
 function tick(){timer=null;state.step++;if(state.step>=lastStep(state.col)){state.step=lastStep(state.col);state.playing=false;}render();if(state.playing)timer=setTimeout(tick,dur(state.col,state.step+1));}
 function play(col){cancel();state.col=col;state.cell=null;state.step=col==='custom'?startOf(col).h1-1:-1;state.playing=true;tick();}
 function onClick(e){const b=e.target.closest('button');if(!b||!root.contains(b)||b.dataset.source||b.dataset.view)return;const d=b.dataset;
  if(d.fxCol){play(d.fxCol);return;}
  if(d.fxAct==='skip'){cancel();state.playing=false;state.step=lastStep(state.col);render();return;}
  if(d.fxAct==='replay'){play(state.col);return;}
  if(d.fxCell!==undefined){state.cell=d.fxCell&&state.cell!==d.fxCell?d.fxCell:null;render();return;}
  if(d.fwAttr){const a=ATTR(d.fwAttr),cur=state.custom[a.id];if(a.multi)state.custom[a.id]=d.fwVal===''?[]:cur.includes(d.fwVal)?cur.filter(x=>x!==d.fwVal):[...cur,d.fwVal];else state.custom[a.id]=d.fwVal;cancel();state.playing=false;state.col='custom';state.step=lastStep('custom');render();}}
 render();root.addEventListener('click',onClick);
 return ()=>{cancel();root.removeEventListener('click',onClick);};
}
window.SA_FRAMEWORK={markup,mount,DOCS,COLS};
})();
