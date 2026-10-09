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
const has=(cfg,a,v)=>Array.isArray(cfg[a])?cfg[a].includes(v):cfg[a]===v;
/* ---------- Onboarding history the Framework Builder learns from ----------
   Closed onboardings: the client's attributes, which activity variations the team actually carried out, and
   steps the team added by hand. Generated once from a fixed seed so every run reads the same history. */
function rng(seed){return ()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const pick=(r,items)=>{let x=r()*items.reduce((a,[,w])=>a+w,0);for(const [v,w] of items)if((x-=w)<0)return v;return items[items.length-1][0];};
const HISTORY=(()=>{const r=rng(20260914),out=[];
 for(let i=0;i<146;i++){
  const vehicle=pick(r,[['sa',50],['cit',30],['mf',20]]);
  const relationship=vehicle==='mf'?pick(r,[['omnibus',55],['direct',20],['consultant',15],['ocio',10]]):vehicle==='cit'?pick(r,[['consultant',45],['mep',25],['direct',15],['ocio',15]]):pick(r,[['direct',25],['consultant',30],['ocio',20],['subadv',25]]);
  const funding=vehicle==='sa'?pick(r,[['cash',40],['inkind',30],['mixed',30]]):pick(r,[['cash',85],['inkind',15]]);
  const tm=funding!=='cash'&&r()<0.5?'yes':'no';
  const reporting=vehicle==='sa'?(r()<0.45?'custom':'standard'):(r()<0.12?'custom':'standard');
  const restrictions=vehicle==='sa'?['tobacco','esg','derivs'].filter(()=>r()<0.35):[];
  const billing=vehicle==='mf'?'standard':(r()<(vehicle==='sa'?0.6:0.25)?'negotiated':'standard');
  const year=2019+Math.floor(r()*8),cfg={vehicle,relationship,funding,tm,reporting,restrictions,billing};
  const observed=new Set();O.RULES.forEach(([a,v],k)=>{if(has(cfg,a,v)&&r()<0.94)observed.add(k);});
  const manual=[];if(relationship==='ocio'&&r()<0.8)manual.push('ocio-authority');if(relationship==='omnibus'&&r()<0.72)manual.push('omni-recon');
  out.push({id:`OB-${year}-${String(i+1).padStart(3,'0')}`,year,cfg,observed,manual,docs:10+Math.floor(r()*12),tasks:24+Math.floor(r()*18)});}
 return out.sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));})();
// Steps teams kept adding by hand: candidates for new rules, which need a policy owner before they are used.
const PROPOSED=[['relationship','ocio','contract','added','Obtain the OCIO’s authority letter for the plan before signing.','ocio-authority'],['relationship','omnibus','reporting','added','Test the intermediary’s sub-accounting reconciliation before the first trade.','omni-recon']];
const POLICY_DOCS=14,CONFLICT_CHECKS=['Client-specific restrictions inside a pooled CIT or fund','Custom reporting on a pooled vehicle','A transition manager on an all-cash funding','A negotiated fee on a mutual fund share class'];
const attrLabel=(a,v)=>`${ATTR(a).name}: ${label(a,v)}`;
// Learn a rule when an attribute value and an activity variation appear together in at least 3 onboardings and 80% of cases.
const MINED=(()=>{const rules=O.RULES.map(([a,v,act,effect,text],k)=>{const pool=HISTORY.filter(r=>has(r.cfg,a,v)),hit=pool.filter(r=>r.observed.has(k));return {k,a,v,act,effect,text,n:pool.length,hits:hit.length,support:pool.length?hit.length/pool.length:0,examples:hit.slice(-2).map(r=>r.id)};});
 const learned=rules.filter(x=>x.n>=3&&x.support>=0.8);
 const proposals=PROPOSED.map(([a,v,act,effect,text,tag])=>{const pool=HISTORY.filter(r=>has(r.cfg,a,v)),hit=pool.filter(r=>r.manual.includes(tag));return {a,v,act,effect,text,n:pool.length,hits:hit.length,support:hit.length/pool.length,examples:hit.slice(-2).map(r=>r.id)};});
 const sup=learned.map(x=>x.support).sort((a,b)=>a-b);
 return {rules,learned,proposals,median:sup[Math.floor(sup.length/2)],docs:HISTORY.reduce((n,r)=>n+r.docs,0),tasks:HISTORY.reduce((n,r)=>n+r.tasks,0)};})();
const ruleFor=(a,v,act,text)=>MINED.rules.find(x=>x.a===a&&x.v===v&&x.act===act&&x.text===text);
const BUILDER=[['F1','Archive reader','Reads every closed onboarding file: checklists, task logs and exception notes'],['F2','Attribute tagger','Tags each past onboarding with the seven client attributes'],['F3','Pattern miner','Learns how each activity varied by attribute, with the evidence'],['F4','Policy checker','Checks the learned rules against policy and adds forbidden combinations'],['H','Policy owner','Approves any new rule before it is used'],['F5','Matrix builder','Applies the approved rules to every client type']];
// Builder timeline: F1 reads in six batches, F2 tags, F3 learns in eight batches, F4 checks, H reviews, F5 fills one column at a time.
const B={f1:0,f2:6,f3:7,f4:15,h:16,f5:17,done:17+COLS.length};
const bdur=i=>i<B.f2?380:i===B.f2?1300:i<B.f4?380:i===B.f4?1400:i===B.h?1300:i<B.done?600:0;
const pct=x=>Math.round(x*100)+'%';
const markup='<div id="fw-root" class="fx"></div>';
function mount(root,opt={}){
 const state={col:null,cell:null,step:-1,custom:JSON.parse(JSON.stringify(O.PROFILES.find(p=>p.id==='cit').cfg)),playing:false,bstep:-1,building:false};
 const built=()=>state.bstep>=B.done,colIx=c=>COLS.findIndex(x=>x[0]===c),shown=c=>state.bstep>=B.f5+colIx(c);
 let timer=null;
 const cfgFor=col=>col==='custom'?state.custom:O.PROFILES.find(p=>p.id===col).cfg;
 const resultFor=col=>O.configure(cfgFor(col));
 const nDocs=col=>col==='custom'?0:DOCS[col].length;
 // Event timeline for one client: each document, the human check, ten activities, then one event per downstream agent.
 const startOf=col=>{const d=nDocs(col);return {docs:0,h1:d,fw:d+1,a2:d+11,risk:d+12,a5:d+13,a6:d+14,a7:d+15,done:d+16};};
 const lastStep=col=>startOf(col).done;
 function cell(col,a,i,result){if(!shown(col))return `<td class="fx-cell empty"><span></span></td>`;const s=startOf(col),pending=state.col===col&&state.step<s.fw+i;if(pending)return `<td class="fx-cell pending" aria-label="Waiting for the agents"><span>…</span></td>`;
  const ch=result.acts[i].changes,rep=ch.some(c=>c.effect==='replaced'),add=ch.filter(c=>c.effect==='added').length,adj=ch.some(c=>c.effect==='adjusted');
  const [cls,txt]=rep?['rep','Replaced'+(add?` +${add}`:'')]:add?['add',`+${add} added`]:adj?['adj','Adjusted']:['std','Standard'];
  const fresh=(state.col===col&&state.playing&&state.step===s.fw+i)||(state.building&&state.bstep===B.f5+colIx(col));
  return `<td class="fx-cell ${cls} ${fresh?'fresh':''} ${state.cell===col+'|'+a.id?'sel':''}"><button type="button" data-fx-cell="${col}|${a.id}" title="${esc(a.name)}: ${esc(ch.map(c=>TAG[c.effect]+' · '+c.text).join(' | ')||'Standard activity')}">${txt}</button></td>`;}
 function matrix(){const results=Object.fromEntries(COLS.map(([c])=>[c,resultFor(c)]));
  return `<section class="panel fx-matrix"><div class="fx-mhead"><h3>Ten shared activities × every client type</h3><p class="smalltext">${built()?'Built from onboarding history. Click a cell for the rule and its evidence, or a client to run the onboarding agents.':state.bstep<0?'Empty until the Framework Builder learns the rules from onboarding history.':'The Framework Builder is learning the rules…'}</p></div>
  <div class="fx-table-wrap"><table class="fx-table"><thead><tr><th class="fx-corner">Shared activity</th>${COLS.map(([c,name,sub])=>`<th class="${state.col===c?'sel':''} ${c==='custom'?'custom':''} ${c==='alpenridge'?'current':''}"><button type="button" data-fx-col="${c}" aria-pressed="${state.col===c}" ${built()?'':'disabled'}>${c==='alpenridge'?'<i>Current client</i>':''}<b>${esc(name)}</b><small>${esc(sub)}</small></button></th>`).join('')}</tr></thead>
  <tbody>${O.STAGES.map((st,si)=>O.ACTIVITIES.map((a,i)=>a.stage!==si?'':`<tr><th scope="row" title="${esc(st.name)}"><span>${esc(a.name)}</span></th>${COLS.map(([c])=>cell(c,a,i,results[c])).join('')}</tr>`).join('')).join('')}</tbody>
  <tfoot><tr><th scope="row">Activities that vary</th>${COLS.map(([c])=>`<td>${!shown(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.filter(a=>a.changes.length).length+'/10'}</td>`).join('')}</tr><tr><th scope="row">Rules reused</th>${COLS.map(([c])=>`<td>${!shown(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.reduce((n,a)=>n+a.changes.length,0)}</td>`).join('')}</tr><tr><th scope="row">New process steps</th>${COLS.map(([c])=>`<td class="zero">${shown(c)?0:'—'}</td>`).join('')}</tr></tfoot></table></div>
  <div class="fx-legend"><span class="std">Standard</span><span class="adj">Adjusted</span><span class="rep">Replaced</span><span class="add">+ Added</span><em>Hover or click a cell for the detail</em></div>
  ${cellDetail()}</section>`;}
 function cellDetail(){if(!state.cell)return '';const [col,aid]=state.cell.split('|'),cfg=cfgFor(col),r=resultFor(col),a=r.acts.find(x=>x.id===aid),name=COLS.find(c=>c[0]===col)[1];
  return `<div class="fx-detail"><div class="split"><b>${esc(a.name)} · ${esc(name)}</b><button type="button" class="ob-x" data-fx-cell="" aria-label="Close">×</button></div><p class="smalltext">${esc(a.base)}</p><dl><div><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])}</dd></div><div><dt>External contact</dt><dd>${esc(extFor(cfg,a))}</dd></div></dl>${a.changes.length?`<ul>${a.changes.map(c=>{const m=ruleFor(c.attr,c.val,aid,c.text);return `<li class="fw-${c.effect}"><span>${TAG[c.effect]}</span>${esc(c.text)}<small>Rule: if ${esc(c.by)}${m?` · learned from ${m.hits} of ${m.n} past onboardings (${pct(m.support)}), e.g. ${m.examples.join(', ')}`:''}</small></li>`;}).join('')}</ul>`:'<p class="fw-std">Standard activity: no rule changes it for this client.</p>'}${MINED.proposals.filter(p=>p.act===aid&&has(cfg,p.a,p.v)).map(p=>`<ul><li class="fw-proposed"><span>Proposed</span>${esc(p.text)}<small>Teams added this by hand in ${p.hits} of ${p.n} ${esc(label(p.a,p.v))} onboardings · waiting for a policy owner to approve</small></li></ul>`).join('')}</div>`;}
 const chip=([id,v])=>`<span class="fx-attr"><em>${esc(ATTR(id).name)}</em>${v==='none'?'None':esc(label(id,v))}</span>`;
 function stage(key,i,body){const s=startOf(state.col),[id,name,desc]=AGENTS[i],from=s[key];
  const st=key==='docs'?(state.step>=s.h1?'done':state.step>=0?'active':'wait'):key==='fw'?(state.step>=s.a2?'done':state.step>=s.fw?'active':'wait'):state.step>=from?'done':'wait';
  return stepHtml(st,id,name,desc||'',st==='wait'?'':body());}
 function runPanel(){if(!state.col||!built())return builderPanel();
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
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><button type="button" class="fx-back" data-fx-act="back">← How the matrix was built</button><span class="eyebrow">Onboarding agents using the framework</span><h3>${esc(name)}</h3></div><div class="run-buttons">${state.playing?'<button type="button" class="btn small" data-fx-act="skip">Skip ⏭</button>':`<button type="button" class="btn small primary" data-fx-act="replay">${done?'Replay':'Run'} ▶</button>`}</div></div>
  ${col==='custom'?customControls():''}<ol class="fx-pipe">${steps.join('')}</ol></aside>`;}
 function customControls(){const c=state.custom;return `<div class="fx-custom">${O.ATTRS.map(a=>`<div class="fw-attr"><span class="wr-label">${esc(a.name)}</span><div class="fw-opts">${a.options.map(([v,l])=>{const on=a.multi?c[a.id].includes(v):c[a.id]===v;return `<button type="button" class="${on?'active':''}" aria-pressed="${on}" data-fw-attr="${a.id}" data-fw-val="${v}">${esc(l)}</button>`;}).join('')}${a.multi?`<button type="button" class="${!c[a.id].length?'active':''}" data-fw-attr="${a.id}" data-fw-val="">None</button>`:''}</div></div>`).join('')}</div>`;}
 function profile(){const cfg=O.PROFILES.find(p=>p.id==='alpenridge').cfg,src={};for(const d of DOCS.alpenridge)for(const [a,v] of d.attrs)src[a+'|'+v]=d.src;
  const srcs=list=>[...new Set(list.filter(Boolean))].map(x=>/§/.test(x)?`<button type="button" class="cite" data-source="${esc(x)}">${esc(x)}</button>`:`<i>${esc(x)}</i>`).join('');
  const tiles=O.ATTRS.map(a=>{const vals=a.multi?cfg[a.id]:[cfg[a.id]];return `<div class="fx-pf"><span>${esc(a.name)}</span><b>${vals.length?vals.map(v=>esc(label(a.id,v))).join(' · '):'None'}</b><em>${srcs(vals.map(v=>src[a.id+'|'+v]))}</em></div>`;}).join('');
  const cta=state.building?`<button type="button" class="btn" data-fx-act="bskip">Building… skip to result ⏭</button>`:built()?`<span class="fx-built">✓ Built from ${HISTORY.length} past onboardings</span><button type="button" class="btn small" data-fx-act="build">Rebuild ↻</button>`:`<button type="button" class="btn primary fx-build" data-fx-act="build">Build the framework from onboarding history ▶</button>`;
  return `<section class="fx-profile"><header><div><span class="eyebrow">Current client</span><h3>Alpenridge Pension Foundation</h3><small>Attributes found by the Context agent (A1) and confirmed by Operations (H1)</small></div><div class="fx-profile-cta">${cta}</div></header><div class="fx-pf-grid">${tiles}</div></section>`;}
 function scale(){const b=state.bstep,read=b<0?null:Math.round(HISTORY.length*Math.min(1,(b+1)/6)),learned=b<B.f3?null:Math.round(MINED.learned.length*Math.min(1,(b-B.f3+1)/8)),v=x=>x==null?'—':x;
  const k=(cls,val,lab)=>`<div class="fx-kpi ${cls}"><span>${lab}</span><strong>${val}</strong></div>`;
  return `<div class="fx-scale">${k('blue',v(read),'Past onboardings learned from')}${k('green',v(learned),'Rules learned, with evidence')}${k('amber',b>=B.h?MINED.proposals.length:'—','New rules proposed')}${k('hero',built()?combos.toLocaleString('en-US'):'—','Client set-ups covered')}${k('slate',7,'Onboarding agents, same for every client')}${k('green',built()?0:'—','New processes designed')}</div>`;}
 const pill=st=>`<em class="fx-pill ${st}">${st==='done'?'Done':st==='active'?'Running':'Queued'}</em>`;
 const stepHtml=(st,id,name,desc,body)=>`<li class="fx-step ${st}"><span class="fx-badge">${id}</span><div><div class="fx-step-head"><b>${esc(name)}</b>${pill(st)}</div>${st==='wait'?`<small class="fx-desc">${esc(desc)}</small>`:`<div class="fx-out">${body}</div>`}</div></li>`;
 function bstage(i,from,to,body){const [id,name,desc]=BUILDER[i],b=state.bstep,st=b>to?'done':b>=from?'active':'wait';return stepHtml(st,id,name,desc,st==='wait'?'':body(st));}
 function builderPanel(){const b=state.bstep,H=HISTORY,M=MINED;
  const read=Math.round(H.length*Math.min(1,(b+1)/6)),batch=H.slice(Math.max(0,read-4),read);
  const byV=O.ATTRS[0].options.map(([v,l])=>[l,H.filter(r=>r.cfg.vehicle===v).length]),byC=O.ATTRS[1].options.map(([v,l])=>[l,H.filter(r=>r.cfg.relationship===v).length]);
  const nLearn=Math.round(M.learned.length*Math.min(1,(b-B.f3+1)/8)),recent=M.learned.slice(Math.max(0,nLearn-3),nLearn).reverse();
  const actName=id=>O.ACTIVITIES.find(a=>a.id===id).name;
  const steps=[
   bstage(0,B.f1,B.f2-1,st=>`<small><b>${st==='done'?H.length:read}</b> of ${H.length} closed onboardings read${st==='done'?` · ${H[0].year}–${H[H.length-1].year} · ${M.docs.toLocaleString('en-US')} documents · ${M.tasks.toLocaleString('en-US')} task records`:''}</small>${st==='active'?`<ul class="fx-feed">${batch.map(r=>`<li><b>${r.id}</b> ${esc(label('vehicle',r.cfg.vehicle))} · ${esc(label('relationship',r.cfg.relationship))} · ${r.docs} documents</li>`).join('')}</ul>`:''}`),
   bstage(1,B.f2,B.f2,()=>`<small>Every past onboarding tagged with the 7 attributes.</small><div class="fx-dist">${byV.map(([l,n])=>`<span>${esc(l)} <b>${n}</b></span>`).join('')}</div><div class="fx-dist">${byC.map(([l,n])=>`<span>${esc(l)} <b>${n}</b></span>`).join('')}</div>`),
   bstage(2,B.f3,B.f4-1,st=>st==='done'?`<small><b>${M.learned.length}</b> rules learned. Each one held in at least 3 past onboardings, at a median ${pct(M.median)} consistency. Also found <b>${M.proposals.length}</b> steps teams kept adding by hand.</small>`:`<small><b>${nLearn}</b> rules learned so far</small><ul class="fx-feed">${recent.map(x=>`<li>If <b>${esc(attrLabel(x.a,x.v))}</b> → ${esc(actName(x.act))} ${x.effect} · ${x.hits}/${x.n} (${pct(x.support)})</li>`).join('')}</ul>`),
   bstage(3,B.f4,B.f4,()=>`<small>All ${M.learned.length} rules checked against ${POLICY_DOCS} policy documents. ${CONFLICT_CHECKS.length} combinations policy does not allow became checks:</small><ul class="fx-list">${CONFLICT_CHECKS.map(c=>`<li class="heavy">${esc(c)}</li>`).join('')}</ul>`),
   bstage(4,B.h,B.h,()=>`<small>${M.proposals.length} new rules wait for approval and are <b>not</b> applied yet:</small><ul class="fx-list">${M.proposals.map(p=>`<li><b>If ${esc(attrLabel(p.a,p.v))}</b> → ${esc(actName(p.act))}: ${esc(p.text)} <em class="fx-ev">added by hand in ${p.hits} of ${p.n} (${pct(p.support)})</em></li>`).join('')}</ul>`),
   bstage(5,B.f5,B.done-1,st=>`<small>${st==='done'?`Matrix built for ${COLS.length} client types from the ${M.learned.length} approved rules. Alpenridge first.`:`Filling column ${Math.min(COLS.length,b-B.f5+1)} of ${COLS.length}…`}</small>`)
  ];
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><span class="eyebrow">How the matrix is built</span><h3>Framework Builder agents</h3></div>${state.building?'<button type="button" class="btn small" data-fx-act="bskip">Skip ⏭</button>':''}</div>
  ${b<0?`<p class="fx-lead">The framework is not written by hand. These agents learn it from ${HISTORY.length} closed onboardings, check it against policy, and send anything new to a policy owner.</p>`:''}
  <ol class="fx-pipe">${steps.join('')}</ol>
  ${built()?`<div class="fx-next"><b>Next:</b> the seven onboarding agents use this matrix for a new client.<button type="button" class="btn small primary" data-fx-col="alpenridge">Run the onboarding agents for Alpenridge ▶</button><small>Or click any client column.</small></div>`:''}</aside>`;}
 function render(){root.innerHTML=`${profile()}${scale()}<div class="fx-layout">${matrix()}${runPanel()}</div><p class="legend">Illustrative framework on synthetic data. Variations describe typical differences between structures; confirm each against firm policy before use. The onboarding history and the agent steps for clients other than Alpenridge are synthetic.</p>`;
  // Keep the agent that is working in view inside the panel.
  const panel=root.querySelector?.('.fx-run');
  // Fit the panel to the space left on screen so it scrolls inside itself and the working agent stays visible.
  if(panel?.getBoundingClientRect&&window.innerHeight){const top=Math.max(12,panel.getBoundingClientRect().top);panel.style.maxHeight=Math.max(320,window.innerHeight-top-12)+'px';}
  const active=panel?.querySelector?.('.fx-step.active');
  if(panel&&typeof panel.scrollTop==='number'){const target=active?active.offsetTop-70:built()&&!state.col?panel.scrollHeight:0;panel.scrollTop=Math.max(0,target);}}
 function cancel(){if(timer!==null)clearTimeout(timer);timer=null;}
 const dur=(col,step)=>{const s=startOf(col);return step<s.h1?900:step===s.h1?700:step<s.a2?200:850;};
 function tick(){timer=null;state.step++;if(state.step>=lastStep(state.col)){state.step=lastStep(state.col);state.playing=false;}render();if(state.playing)timer=setTimeout(tick,dur(state.col,state.step+1));}
 function btick(){timer=null;state.bstep++;if(state.bstep>=B.done){state.bstep=B.done;state.building=false;}render();if(state.building)timer=setTimeout(btick,bdur(state.bstep+1));}
 function startBuild(){cancel();state.col=null;state.cell=null;state.playing=false;state.bstep=-1;state.building=true;btick();}
 function play(col){cancel();state.col=col;state.cell=null;state.step=col==='custom'?startOf(col).h1-1:-1;state.playing=true;tick();}
 function onClick(e){const b=e.target.closest('button');if(!b||!root.contains(b)||b.dataset.source||b.dataset.view)return;const d=b.dataset;
  if(d.fxAct==='build'){startBuild();return;}
  if(d.fxAct==='bskip'){cancel();state.building=false;state.bstep=B.done;render();return;}
  if(d.fxAct==='back'){cancel();state.playing=false;state.col=null;render();return;}
  if(d.fxCol){if(built())play(d.fxCol);return;}
  if(d.fxAct==='skip'){cancel();state.playing=false;state.step=lastStep(state.col);render();return;}
  if(d.fxAct==='replay'){play(state.col);return;}
  if(d.fxCell!==undefined){if(!built())return;state.cell=d.fxCell&&state.cell!==d.fxCell?d.fxCell:null;render();return;}
  if(d.fwAttr){const a=ATTR(d.fwAttr),cur=state.custom[a.id];if(a.multi)state.custom[a.id]=d.fwVal===''?[]:cur.includes(d.fwVal)?cur.filter(x=>x!==d.fwVal):[...cur,d.fwVal];else state.custom[a.id]=d.fwVal;cancel();state.playing=false;state.col='custom';state.step=lastStep('custom');render();}}
 render();root.addEventListener('click',onClick);
 return ()=>{cancel();root.removeEventListener('click',onClick);};
}
window.SA_FRAMEWORK={markup,mount,DOCS,COLS,HISTORY,MINED};
})();
