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
/* ---------- Evidence behind a rule: the past onboardings it was learned from ----------
   key 'r12' is learned rule 12, 'p0' is proposed rule 0. Names and log lines are synthetic, generated per record. */
const NAMES=['Alder','Birchwood','Cobalt','Dunmore','Elmstead','Fairhaven','Glenrock','Hartwell','Ironbridge','Juniper Ridge','Kingsmere','Lakemont','Marlow','Northgate','Oakhurst','Pembroke','Quarry Hill','Redfern','Stonebridge','Thornbury','Upland','Valemont','Westbury','Yarrow'];
const obNum=r=>Number(r.id.slice(-3));
function obName(r){const n=obNum(r),c=r.cfg,pickN=xs=>xs[n%xs.length];
 const kind=c.relationship==='mep'?'Pooled Employer Plan':c.relationship==='omnibus'?pickN(['Wealth Platform','Brokerage']):c.relationship==='subadv'?'Advisors fund sleeve':c.relationship==='ocio'?pickN(['University Endowment','Foundation (via OCIO)','Hospital Endowment']):c.vehicle==='cit'?pickN(['401(k) Plan','Retirement Plan']):c.vehicle==='mf'?pickN(['Family Office','Credit Union']):pickN(['Pension Fund','Insurance Company','Pension Foundation','County Retirement System']);
 const place=['','Valley','County','Harbor','Metro','Lake','Bay'][Math.floor(n/NAMES.length)%7];return `${NAMES[n%NAMES.length]}${place?' '+place:''} ${kind}`;}
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],closedOn=r=>`${MONTHS[obNum(r)*7%12]} ${r.year}`;
function evidence(key){const i=Number(key.slice(1));
 if(key[0]==='p'){const [a,v,act,,text,tag]=PROPOSED[i];return {a,v,act,effect:'proposed',text,k:null,pool:HISTORY.filter(r=>has(r.cfg,a,v)).map(r=>({r,hit:r.manual.includes(tag)}))};}
 const [a,v,act,effect,text]=O.RULES[i];return {a,v,act,effect,text,k:i,pool:HISTORY.filter(r=>has(r.cfg,a,v)).map(r=>({r,hit:r.observed.has(i)}))};}
// What a past onboarding's own records say about this activity.
function recordLines(e,r){const act=O.ACTIVITIES.find(x=>x.id===e.act),tid=`T-${String((obNum(r)+(e.k??7)*3)%38+1).padStart(2,'0')}`,team=O.TEAMS[act.team]||act.team;
 if(e.effect==='proposed')return [['Task log',`${tid} · added by hand by ${team}: “${e.text}”`],['Closure note',`Step is not in the ${act.name} checklist. The team added it for this ${label(e.a,e.v)} client.`]];
 return [['Task log',`${tid} · ${act.name}: “${e.text}” · completed by ${team}`],['Closure note',`${act.name} ${e.effect==='replaced'?'ran in its alternative form':e.effect==='added'?'needed an extra step':'was adjusted'} because the client is ${label(e.a,e.v)}.`]];}
const missLine=e=>{const act=O.ACTIVITIES.find(x=>x.id===e.act).name;return e.effect==='proposed'?`The standard ${act} checklist was used; no step was added by hand.`:`Standard ${act} logged; this variation is not recorded, so the record does not count towards the rule.`;};
const ruleFor=(a,v,act,text)=>MINED.rules.find(x=>x.a===a&&x.v===v&&x.act===act&&x.text===text);
const BUILDER=[['F1','Archive reader','Reads every closed onboarding file: checklists, task logs and exception notes'],['F2','Attribute tagger','Tags each past onboarding with the seven client attributes'],['F3','Pattern miner','Learns how each activity varied by attribute, with the evidence'],['F4','Policy checker','Checks the learned rules against policy and adds forbidden combinations'],['H','Policy owner','Approves any new rule before it is used'],['F5','Matrix builder','Applies the approved rules to every client type']];
// Builder timeline: F1 reads in six batches, F2 tags, F3 learns in eight batches, F4 checks, H reviews, F5 fills one column at a time.
// The builder fills the known client types; Alpenridge arrives afterwards as a new client.
const BCOLS=COLS.filter(c=>c[0]!=='alpenridge');
const B={f1:0,f2:6,f3:7,f4:15,h:16,f5:17,done:17+BCOLS.length};
const bdur=i=>i<B.f2?380:i===B.f2?1300:i<B.f4?380:i===B.f4?1400:i===B.h?1300:i<B.done?600:0;
const pct=x=>Math.round(x*100)+'%';
const markup='<div id="fw-root" class="fx"></div>';
function mount(root,opt={}){
 const state={col:null,cell:null,step:-1,custom:JSON.parse(JSON.stringify(O.PROFILES.find(p=>p.id==='cit').cfg)),playing:false,bstep:-1,building:false,alp:false,list:null,ev:null,listAct:null,stdAct:null,cardSeen:false,decided:{}};
 const built=()=>state.bstep>=B.done,colIx=c=>BCOLS.findIndex(x=>x[0]===c),shown=c=>c==='alpenridge'?state.alp:state.bstep>=B.f5+colIx(c);
 const cols=()=>COLS.filter(([c])=>c!=='alpenridge'||state.alp);
 let timer=null;
 const cfgFor=col=>col==='custom'?state.custom:O.PROFILES.find(p=>p.id===col).cfg;
 // A proposed rule the policy owner approves is applied like any learned rule: it adds its step for every matching client.
 const approved=()=>MINED.proposals.map((p,i)=>({...p,i})).filter(p=>state.decided[p.i]==='approved');
 const resultFor=col=>{const cfg=cfgFor(col),res=O.configure(cfg);for(const p of approved())if(has(cfg,p.a,p.v))res.acts.find(x=>x.id===p.act).changes.push({attr:p.a,val:p.v,effect:'added',text:p.text,effort:1,by:attrLabel(p.a,p.v),proposal:p.i});return res;};
 const nDocs=col=>col==='custom'?0:DOCS[col].length;
 // Event timeline for one client: each document, the human check, ten activities, then one event per downstream agent.
 const startOf=col=>{const d=nDocs(col);return {docs:0,h1:d,fw:d+1,a2:d+11,risk:d+12,a5:d+13,a6:d+14,a7:d+15,done:d+16};};
 const lastStep=col=>startOf(col).done;
 function cell(col,a,i,result){if(!shown(col))return `<td class="fx-cell empty"><span></span></td>`;const s=startOf(col),pending=state.col===col&&state.step<s.fw+i;if(pending)return `<td class="fx-cell pending" aria-label="Waiting for the agents"><span>…</span></td>`;
  const ch=result.acts[i].changes,rep=ch.some(c=>c.effect==='replaced'),add=ch.filter(c=>c.effect==='added').length,adj=ch.some(c=>c.effect==='adjusted');
  const [cls,txt]=rep?['rep','Replaced'+(add?` +${add}`:'')]:add?['add',`+${add} added`]:adj?['adj','Adjusted']:['std','Standard'];
  const fresh=(state.col===col&&state.playing&&state.step===s.fw+i)||(state.building&&state.bstep===B.f5+colIx(col));
  return `<td class="fx-cell ${cls} ${fresh?'fresh':''} ${state.cell===col+'|'+a.id?'sel':''}"><button type="button" data-fx-cell="${col}|${a.id}" title="${esc(a.name)}: ${esc(ch.map(c=>TAG[c.effect]+' · '+c.text).join(' | ')||'Standard activity')}">${txt}</button></td>`;}
 function matrix(){const COLS=cols(),results=Object.fromEntries(COLS.map(([c])=>[c,resultFor(c)]));
  return `<section class="panel fx-matrix"><div class="fx-mhead"><h3>Ten shared activities × every client type</h3><p class="smalltext">${built()&&!state.alp?'Built from onboarding history. A new client has arrived: extract its attributes on the right to add it.':built()?'Built from onboarding history. Click a cell for the rule and its evidence, or a client to run the onboarding agents.':state.bstep<0?'Empty until the Framework Builder learns the rules from onboarding history.':'The Framework Builder is learning the rules…'}</p></div>
  <div class="fx-table-wrap"><table class="fx-table"><thead><tr><th class="fx-corner">Shared activity</th>${COLS.map(([c,name,sub])=>`<th class="${state.col===c?'sel':''} ${c==='custom'?'custom':''} ${c==='alpenridge'?'current':''}"><button type="button" data-fx-col="${c}" aria-pressed="${state.col===c}" ${built()?'':'disabled'}>${c==='alpenridge'?'<i>New client</i>':''}<b>${esc(name)}</b><small>${esc(sub)}</small></button></th>`).join('')}</tr></thead>
  <tbody>${O.STAGES.map((st,si)=>O.ACTIVITIES.map((a,i)=>a.stage!==si?'':`<tr><th scope="row" title="${esc(st.name)}"><span>${esc(a.name)}</span></th>${COLS.map(([c])=>cell(c,a,i,results[c])).join('')}</tr>`).join('')).join('')}</tbody>
  <tfoot><tr><th scope="row">Activities that vary</th>${COLS.map(([c])=>`<td>${!shown(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.filter(a=>a.changes.length).length+'/10'}</td>`).join('')}</tr><tr><th scope="row">Rules reused</th>${COLS.map(([c])=>`<td>${!shown(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.reduce((n,a)=>n+a.changes.length,0)}</td>`).join('')}</tr><tr><th scope="row">New process steps</th>${COLS.map(([c])=>`<td class="zero">${shown(c)?0:'—'}</td>`).join('')}</tr></tfoot></table></div>
  <div class="fx-legend"><button type="button" class="fx-std-open" data-fx-list="standard">📘 Standard onboarding guideline</button><span class="std">Standard</span><span class="adj">Adjusted</span><span class="rep">Replaced</span><span class="add">+ Added</span><em>Hover or click a cell for the detail</em></div>
  ${cellDetail()}</section>`;}
 // Cell detail: the standard activity next to what this client gets, with the rule and evidence for each change.
 const SAYS={std:'No rule changes this activity for this client. It runs exactly as the standard says.',adj:'Same activity and owner. Part of how it is done changes for this client.',rep:'The standard version does not apply to this client. A different version of the activity runs instead.',add:'The standard runs as written, plus extra steps for this client.'};
 function cellDetail(){if(!state.cell)return '';const [col,aid]=state.cell.split('|'),cfg=cfgFor(col),r=resultFor(col),a=r.acts.find(x=>x.id===aid),name=COLS.find(c=>c[0]===col)[1],std=O.STANDARD[aid],ch=a.changes;
  const rep=ch.find(c=>c.effect==='replaced'),adds=ch.filter(c=>c.effect==='added'),adjs=ch.filter(c=>c.effect==='adjusted'),kind=rep?'rep':adds.length&&!adjs.length?'add':adjs.length?'adj':adds.length?'add':'std';
  const ext=extFor(cfg,a),extChanged=ext&&ext!==a.ext;
  const why=c=>{if(c.proposal!=null){const p=MINED.proposals[c.proposal];return `<small>Approved by the policy owner · teams added it by hand in ${p.hits} of ${p.n} past onboardings (${pct(p.support)}) <button type="button" class="fx-link" data-fx-evopen="p${c.proposal}">See the evidence →</button></small>`;}const m=ruleFor(c.attr,c.val,aid,c.text);return `<small>Because ${esc(c.by)}${m?` · learned from ${m.hits} of ${m.n} past onboardings (${pct(m.support)}) <button type="button" class="fx-link" data-fx-evopen="r${m.k}">See the evidence →</button>`:''}</small>`;};
  const chg=c=>`<div class="fx-chg fw-${c.effect}"><span class="fx-eff fw-${c.effect}">${TAG[c.effect]}</span><p>${esc(c.text)}</p>${why(c)}</div>`;
  const props=MINED.proposals.filter((p,i)=>!state.decided[i]&&p.act===aid&&has(cfg,p.a,p.v)).map(p=>`<div class="fx-chg fw-proposed"><span class="fx-eff fw-proposed">Proposed</span><p>${esc(p.text)}</p><small>Teams added this by hand in ${p.hits} of ${p.n} ${esc(label(p.a,p.v))} onboardings · not applied until a policy owner approves it</small></div>`).join('');
  return `<div class="fx-detail fx-cmp-wrap"><div class="fx-cmp-top"><div><b>${esc(a.name)} · ${esc(name)}</b><span class="fx-cell-tag ${kind}">${{std:'Standard',adj:'Adjusted',rep:'Replaced',add:'Added'}[kind]}</span><p>${SAYS[kind]}</p></div><button type="button" class="ob-x" data-fx-cell="" aria-label="Close">×</button></div>
  <div class="fx-cmp"><section class="fx-cmp-col std ${rep?'void':''}"><span class="fx-cmp-h">Standard guideline</span><p class="fx-cmp-base">${esc(a.base)}</p><ol>${std.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><dl><div><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])}</dd></div><div><dt>External contact</dt><dd>${esc(a.ext)}</dd></div></dl><button type="button" class="fx-link" data-fx-std="${aid}">Read the full standard →</button>${rep?'<em class="fx-void">Does not apply to this client</em>':''}</section>
  <div class="fx-cmp-arrow" aria-hidden="true">→</div>
  <section class="fx-cmp-col cli ${kind}"><span class="fx-cmp-h">For ${esc(name)}</span>${ch.length?[...(rep?[rep]:[]),...adjs,...adds].map(chg).join(''):'<p class="fx-same">Same as the standard.</p>'}${props}<dl><div><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])} <i class="fx-same-tag">same</i></dd></div><div><dt>External contact</dt><dd>${esc(ext)} ${extChanged?'<i class="fx-diff-tag">changed</i>':'<i class="fx-same-tag">same</i>'}</dd></div></dl></section></div></div>`;}
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
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><button type="button" class="fx-back" data-fx-act="back">← How the matrix was built</button><span class="eyebrow">Onboarding agents using the framework</span><h3>${esc(name)}</h3></div><div class="run-buttons">${state.playing?'<button type="button" class="btn small" data-fx-act="skip">Skip ⏭</button>':''}</div></div>
  ${col==='custom'?customControls():''}<ol class="fx-pipe">${steps.join('')}</ol></aside>`;}
 function customControls(){const c=state.custom;return `<div class="fx-custom">${O.ATTRS.map(a=>`<div class="fw-attr"><span class="wr-label">${esc(a.name)}</span><div class="fw-opts">${a.options.map(([v,l])=>{const on=a.multi?c[a.id].includes(v):c[a.id]===v;return `<button type="button" class="${on?'active':''}" aria-pressed="${on}" data-fw-attr="${a.id}" data-fw-val="${v}">${esc(l)}</button>`;}).join('')}${a.multi?`<button type="button" class="${!c[a.id].length?'active':''}" data-fw-attr="${a.id}" data-fw-val="">None</button>`:''}</div></div>`).join('')}</div>`;}
 function profile(){const cfg=O.PROFILES.find(p=>p.id==='alpenridge').cfg,src={},docs=DOCS.alpenridge,s=startOf('alpenridge');
  const cta=state.building?`<button type="button" class="btn" data-fx-act="bskip">Building… skip to result ⏭</button>`:built()?`<span class="fx-built">✓ Built from ${HISTORY.length} past onboardings</span><button type="button" class="btn small" data-fx-act="build">Rebuild ↻</button>`:`<button type="button" class="btn primary fx-build" data-fx-act="build">Build the framework from onboarding history ▶</button>`;
  if(!state.alp)return `<section class="fx-profile"><header><div><span class="eyebrow">${built()?'Framework ready':'Framework Builder'}</span><h3>Learn the onboarding framework from history</h3><small>${HISTORY.length} closed onboardings · ${O.ATTRS.length} client attributes · ${O.ACTIVITIES.length} shared activities</small></div><div class="fx-profile-cta">${cta}</div></header></section>`;
  // Tiles fill in as the Context agent reads each document.
  const read=state.col==='alpenridge'?docs.filter((d,i)=>state.step>=i):docs,all=read.length===docs.length;for(const d of read)for(const [a,v] of d.attrs)src[a+'|'+v]=d.src;
  const srcs=list=>[...new Set(list.filter(Boolean))].map(x=>/§/.test(x)?`<button type="button" class="cite" data-source="${esc(x)}">${esc(x)}</button>`:`<i>${esc(x)}</i>`).join('');
  const tiles=O.ATTRS.map(a=>{const vals=(a.multi?cfg[a.id]:[cfg[a.id]]).filter(v=>src[a.id+'|'+v]);return `<div class="fx-pf ${vals.length||all?'':'wait'}"><span>${esc(a.name)}</span><b>${vals.length?vals.map(v=>esc(label(a.id,v))).join(' · '):all?'None':'…'}</b><em>${srcs(vals.map(v=>src[a.id+'|'+v]))}</em></div>`;}).join('');
  const how=state.col==='alpenridge'&&state.step<s.h1?'The Context agent (A1) is extracting attributes from the client’s documents…':'Attributes extracted by the Context agent (A1) and confirmed by Operations (H1)';
  return `<section class="fx-profile"><header><div><span class="eyebrow">New client</span><h3>Alpenridge Pension Foundation</h3><small>${how}</small></div><div class="fx-profile-cta">${cta}</div></header><div class="fx-pf-grid">${tiles}</div></section>`;}
 const learnedSoFar=()=>state.bstep<B.f3?0:Math.round(MINED.learned.length*Math.min(1,(state.bstep-B.f3+1)/8));
 function scale(){const b=state.bstep,read=b<0?null:Math.round(HISTORY.length*Math.min(1,(b+1)/6)),learned=b<B.f3?null:learnedSoFar(),v=x=>x==null?'—':x;
  const k=(cls,val,lab,list)=>list?`<button type="button" class="fx-kpi fx-kpi-open ${cls}" data-fx-list="${list}"><span>${lab}</span><strong>${val}</strong><em>See the rules →</em></button>`:`<div class="fx-kpi ${cls}"><span>${lab}</span><strong>${val}</strong></div>`;
  return `<div class="fx-scale">${k('blue',v(read),'Past onboardings learned from')}${k('green',v(learned),'Rules learned, with evidence',learned?'learned':null)}${k('amber',b>=B.h?MINED.proposals.length:'—',Object.values(state.decided).includes('approved')?`New rules proposed · ${Object.values(state.decided).filter(x=>x==='approved').length} approved`:'New rules proposed',b>=B.h?'proposed':null)}${k('hero',built()?combos.toLocaleString('en-US'):'—','Client set-ups covered')}${k('slate',7,'Onboarding agents, same for every client')}${k('green',built()?0:'—','New processes designed')}</div>`;}
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
   bstage(4,B.h,B.h,()=>{const pend=M.proposals.filter((p,i)=>!state.decided[i]).length;return `<small>${pend?`${pend} new rule${pend>1?'s':''} wait for approval and ${pend>1?'are':'is'} <b>not</b> applied yet.`:'Every proposed rule has a decision.'}</small><ul class="fx-list">${M.proposals.map((p,i)=>`<li><b>If ${esc(attrLabel(p.a,p.v))}</b> → ${esc(actName(p.act))}: ${esc(p.text)} <em class="fx-evnote">added by hand in ${p.hits} of ${p.n} (${pct(p.support)})${state.decided[i]?` · ${state.decided[i]==='approved'?'✓ approved and applied':'✕ rejected'}`:''}</em></li>`).join('')}</ul>${pend&&built()?'<button type="button" class="btn small" data-fx-list="proposed">Review and approve →</button>':''}`;}),
   bstage(5,B.f5,B.done-1,st=>`<small>${st==='done'?`Matrix built for ${BCOLS.length-1} client types and a “Your mix” column from the ${M.learned.length} approved rules.`:`Filling column ${Math.min(BCOLS.length,b-B.f5+1)} of ${BCOLS.length}…`}</small>`)
  ];
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><span class="eyebrow">How the matrix is built</span><h3>Framework Builder agents</h3></div>${state.building?'<button type="button" class="btn small" data-fx-act="bskip">Skip ⏭</button>':''}</div>
  ${b<0?`<p class="fx-lead">The framework is not written by hand. These agents learn it from ${HISTORY.length} closed onboardings, check it against policy, and send anything new to a policy owner.</p>`:''}
  <ol class="fx-pipe">${steps.join('')}</ol>
  ${built()?newClient():''}</aside>`;}
 // A new client arrives once the matrix exists. Extracting its attributes adds it to the matrix.
 function newClient(){if(state.alp)return `<div class="fx-next"><b>Alpenridge is in the matrix.</b><button type="button" class="btn small" data-fx-col="alpenridge">Show its run again ▶</button><small>Or click any client column to see the onboarding agents on it.</small></div>`;
  const C=window.CORPUS,ids=[...new Set(DOCS.alpenridge.map(d=>d.src.split('§')[0]))];
  return `<div class="fx-new ${state.cardSeen?'':'enter'}"><span class="eyebrow">New client received</span><h4>Alpenridge Pension Foundation</h4><p>USD 250m global investment-grade bond separate account · Swiss pension foundation</p><ul>${ids.map(id=>{const d=C?.documents?.find(x=>x.id===id);return `<li><b>${esc(d?id:'RM')}</b>${esc(d?d.title:id)}</li>`;}).join('')}</ul><p class="smalltext">It is not in the matrix yet. The Context agent reads these documents, extracts the seven attributes, and the framework does the rest.</p><button type="button" class="btn primary" data-fx-act="extract">Extract attributes and add to the matrix ▶</button></div>`;}
 // Full-screen list of the learned rules and the proposed ones, with the evidence behind each.
 function rulesList(){if(!state.list)return '';const M=MINED,learned=M.learned.slice(0,learnedSoFar()),tab=state.list,actName=id=>O.ACTIVITIES.find(a=>a.id===id).name,acts=state.listAct?O.ACTIVITIES.filter(a=>a.id===state.listAct):O.ACTIVITIES;
  const bar=x=>`<span class="fx-sup"><i style="width:${Math.round(x.support*100)}%"></i></span>`;
  const body=tab==='learned'?acts.map(a=>{const rs=learned.filter(x=>x.act===a.id);return rs.length?`<tbody><tr class="fx-rl-group"><th colspan="4">${esc(a.name)} <small>${rs.length} rule${rs.length>1?'s':''}</small></th></tr>${rs.map(x=>`<tr class="${state.ev?.key==='r'+x.k?'sel':''}"><td><span class="fx-attr"><em>${esc(ATTR(x.a).name)}</em>${esc(label(x.a,x.v))}</span></td><td><span class="fx-eff fw-${x.effect}">${TAG[x.effect]}</span>${esc(x.text)}</td><td class="fx-rl-ev"><button type="button" class="fx-ev-open" data-fx-ev="r${x.k}">${bar(x)}<b>${pct(x.support)}</b><small>${x.hits} of ${x.n} past onboardings →</small></button></td><td class="fx-rl-ex">${x.examples.map(e=>`<button type="button" class="fx-ex" data-fx-ev="r${x.k}" data-fx-ob="${e}">${e}</button>`).join(' ')}</td></tr>`).join('')}</tbody>`:'';}).join(''):'';
  const reach=p=>cols().filter(([c])=>shown(c)&&has(cfgFor(c),p.a,p.v)).map(([,n])=>n);
  const prop=M.proposals.map((p,pi)=>{const d=state.decided[pi],where=reach(p);return `<article class="fx-prop ${d||''} ${state.ev?.key==='p'+pi?'sel':''}"><header><span class="fx-eff fw-${d==='approved'?'added':d==='rejected'?'rejected':'proposed'}">${d==='approved'?'Approved':d==='rejected'?'Rejected':'Proposed'}</span><b>If ${esc(attrLabel(p.a,p.v))} → ${esc(actName(p.act))}</b></header><p>${esc(p.text)}</p><div class="fx-rl-ev"><button type="button" class="fx-ev-open" data-fx-ev="p${pi}">${bar(p)}<b>${pct(p.support)}</b><small>Teams added this step by hand in ${p.hits} of ${p.n} ${esc(label(p.a,p.v))} onboardings →</small></button><div class="fx-rl-ex">${p.examples.map(e=>`<button type="button" class="fx-ex" data-fx-ev="p${pi}" data-fx-ob="${e}">${e}</button>`).join(' ')}</div></div>
  ${d==='approved'?`<p class="fx-prop-why"><b>Applied.</b> It is now a rule: every ${esc(label(p.a,p.v))} client gets this step in ${esc(actName(p.act))}${where.length?`. In the matrix: ${esc(where.join(', '))}`:''}.</p>`:d==='rejected'?`<p class="fx-prop-why"><b>Not applied.</b> Teams can still add it by hand. The Framework Builder proposes it again if the pattern grows.</p>`:`<p class="fx-prop-why"><b>Why it is not applied yet:</b> it is a new step that no policy describes, and it held in ${pct(p.support)} of cases${p.support<0.8?', under the 80% bar':''}. A policy owner decides whether it becomes a rule.</p>`}
  <div class="fx-prop-act">${d?`<span class="fx-prop-status ${d}">${d==='approved'?'✓ Approved by the policy owner · applied to the matrix':'✕ Rejected by the policy owner'}</span><button type="button" class="fx-link" data-fx-decide="${pi}:">Undo</button>`:`<button type="button" class="btn small primary" data-fx-decide="${pi}:approved">✓ Approve and apply</button><button type="button" class="btn small" data-fx-decide="${pi}:rejected">Reject</button><span class="fx-prop-status">Waiting for the policy owner</span>`}</div></article>`;}).join('');
  const titles={standard:'Standard onboarding guideline',learned:'Rules learned, with evidence',proposed:'New rules proposed'};
  return `<div class="fx-rl-back" data-fx-list=""></div><aside class="fx-rl" role="dialog" aria-modal="true" aria-label="${titles[tab]}"><header class="fx-rl-head"><div><span class="eyebrow">${tab==='standard'?'The base playbook every client starts from':`Framework Builder · learned from ${HISTORY.length} closed onboardings`}</span><h2>${titles[tab]}</h2><p class="smalltext">${tab==='standard'?'Ten activities in five stages, the same for every client. Rules adjust, replace or add to these standards for each client type; nothing else changes.':tab==='learned'?`A rule is kept when the same change appeared in at least 3 past onboardings with that attribute, and in at least 80% of them. Median consistency ${pct(M.median)}. Click the evidence or an example to see the past onboardings behind a rule.`:'Steps teams kept adding by hand. A policy owner approves or rejects each one; an approved rule applies to the matrix straight away.'}</p></div><div class="fx-rl-tabs"><button type="button" class="${tab==='standard'?'on':''}" data-fx-list="standard">Standard guideline</button><button type="button" class="${tab==='learned'?'on':''}" data-fx-list="learned" ${learned.length?'':'disabled'}>Learned rules <b>${learned.length}</b></button><button type="button" class="${tab==='proposed'?'on':''}" data-fx-list="proposed" ${state.bstep>=B.h?'':'disabled'}>Proposed rules <b>${M.proposals.length}</b></button><button type="button" class="ob-x" data-fx-list="" aria-label="Close">×</button></div></header>
  <div class="fx-rl-body ${state.ev?'with-ev':''}"><div class="fx-rl-main">${tab==='standard'?standardDoc():tab==='learned'?`${state.listAct?`<p class="fx-rl-filter">Showing the rules that change <b>${esc(actName(state.listAct))}</b> <button type="button" class="fx-link" data-fx-rules-for="">Show all ${learned.length} →</button></p>`:''}<table class="fx-rl-table"><thead><tr><th>If the client has</th><th>Then the activity changes</th><th>Evidence</th><th>Examples</th></tr></thead>${body}</table>`:`<div class="fx-props">${prop}</div>`}</div>${evPanel()}</div></aside>`;}
 // Standard onboarding guideline: every standard in one place, with how many rules can change each activity.
 function standardDoc(){const n=learnedSoFar(),keys=[['std','Standard','runs exactly as written here.'],['adj','Adjusted','same activity and owner; part of how it is done changes.'],['rep','Replaced','the standard does not apply; a different version runs.'],['add','Added','the standard runs, plus extra steps.']];
  const card=(a,i)=>{const st=O.STANDARD[a.id],rs=O.RULES.filter(x=>x[2]===a.id),cnt=e=>rs.filter(x=>x[3]===e).length;
   return `<article class="fx-std-card ${state.stdAct===a.id?'sel':''}" id="fx-std-${a.id}"><header><span class="fx-std-n">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(a.name)}</h4><p>${esc(a.base)}</p></div><span class="fx-std-days">${st.days==='Ongoing'?'Ongoing':`Typically ${st.days} business days`}</span></header>
   <div class="fx-std-grid"><div><h5>Standard steps</h5><ol>${st.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div><h5>Documents</h5><ul>${st.docs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h5>Controls</h5><ul class="ctl">${st.controls.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h5>Who</h5><dl><dt>Internal owner</dt><dd>${esc(O.TEAMS[a.team])}</dd><dt>External contact</dt><dd>${esc(a.ext)}</dd></dl><h5>Done when</h5><p>${esc(st.done)}</p></div></div>
   <footer>${!n?'<em>The rules that can change this activity are learned when the framework is built.</em>':rs.length?`Can vary by client: <b>${rs.length} rule${rs.length>1?'s':''}</b> <span>${[['adjusted','adjust'],['replaced','replace'],['added','add']].filter(([e])=>cnt(e)).map(([e,w])=>`${cnt(e)} ${w}`).join(' · ')}</span>${n?`<button type="button" class="fx-link" data-fx-rules-for="${a.id}">See the rules →</button>`:'<em>Rules are learned when the framework is built.</em>'}`:'No rule changes this activity: it is the same for every client.'}</footer></article>`;};
  let i=0;return `<div class="fx-std"><section class="fx-std-intro"><p>The agents never design a new process. Every client gets these ten activities. Approved rules, each learned from past onboardings, change a standard in one of four ways:</p><ul>${keys.map(([c,t,d])=>`<li><span class="fx-cell-tag ${c}">${t}</span>${d}</li>`).join('')}</ul></section>
  <nav class="fx-std-nav">${O.STAGES.map((st,si)=>`<div><span>${String(si+1).padStart(2,'0')} ${esc(st.name)}</span>${O.ACTIVITIES.filter(a=>a.stage===si).map(a=>`<button type="button" data-fx-std="${a.id}">${esc(a.name)}</button>`).join('')}</div>`).join('')}</nav>
  ${O.STAGES.map((st,si)=>`<h3 class="fx-std-stage"><span>Stage ${si+1}</span>${esc(st.name)}<small>Owner ${esc(st.owner)} · ${esc(st.team)} · escalates to ${esc(st.escalation)}</small></h3>${O.ACTIVITIES.filter(a=>a.stage===si).map(a=>card(a,i++)).join('')}`).join('')}</div>`;}
 // Evidence panel: every past onboarding with the attribute, then one onboarding's own record.
 function evPanel(){const ev=state.ev;if(!ev)return '';const e=evidence(ev.key),hits=e.pool.filter(x=>x.hit).length,act=O.ACTIVITIES.find(x=>x.id===e.act),who=label(e.a,e.v);
  const head=`<div class="fx-ev-head"><div><span class="eyebrow">Evidence</span><h3>If ${esc(attrLabel(e.a,e.v))} → ${esc(act.name)}</h3><p><span class="fx-eff fw-${e.effect}">${e.effect==='proposed'?'Proposed':TAG[e.effect]}</span>${esc(e.text)}</p></div><button type="button" class="ob-x" data-fx-ev="" aria-label="Close evidence">×</button></div>`;
  if(!ev.ob)return `<aside class="fx-ev">${head}<div class="fx-ev-sum"><b>${hits} of ${e.pool.length}</b> past ${esc(who)} onboardings ${e.effect==='proposed'?'added this step by hand':'show this change'} (${pct(hits/e.pool.length)}). Open any one to read its record.</div><ol class="fx-ev-list">${e.pool.slice().sort((x,y)=>y.hit-x.hit||y.r.year-x.r.year||x.r.id.localeCompare(y.r.id)).map(({r,hit})=>`<li><button type="button" class="${hit?'hit':'miss'}" data-fx-ev="${ev.key}" data-fx-ob="${r.id}"><i>${hit?'✓':'–'}</i><code>${r.id}</code><span>${esc(obName(r))}</span><small>${closedOn(r)}</small></button></li>`).join('')}</ol></aside>`;
  const found=e.pool.find(x=>x.r.id===ev.ob),r=found?found.r:HISTORY.find(x=>x.id===ev.ob),hit=Boolean(found?.hit),others=[...r.observed].filter(k=>k!==e.k).map(k=>O.RULES[k]);
  return `<aside class="fx-ev">${head}<button type="button" class="fx-ev-back" data-fx-ev="${ev.key}">← All ${e.pool.length} ${esc(who)} onboardings</button>
  <div class="fx-ev-rec"><div class="fx-ev-rec-head"><code>${r.id}</code><b>${esc(obName(r))}</b><small>Closed ${closedOn(r)} · ${r.docs} documents · ${r.tasks} task records</small><span class="fx-ev-verdict ${hit?'hit':'miss'}">${hit?'✓ Supports this rule':'– Does not count towards this rule'}</span></div>
  <h4>Client attributes, tagged by the Attribute tagger</h4><div class="fx-ev-attrs">${O.ATTRS.map(a=>{const vals=a.multi?r.cfg[a.id]:[r.cfg[a.id]];return `<span class="fx-attr ${a.id===e.a?'key':''}"><em>${esc(a.name)}</em>${vals.length?vals.map(v=>esc(label(a.id,v))).join(' · '):'None'}</span>`;}).join('')}</div>
  <h4>${hit?'What the record shows':'What the record shows instead'}</h4>${(hit?recordLines(e,r):[['Task log',missLine(e)]]).map(([src,t])=>`<div class="fx-ev-line ${hit?'':'miss'}"><span>${src}</span><p>${esc(t)}</p></div>`).join('')}
  ${others.length?`<h4>The same onboarding supports ${others.length} other rule${others.length>1?'s':''}</h4><ul class="fx-ev-others">${others.slice(0,8).map(([,,a2,eff,t])=>`<li><span class="fx-eff fw-${eff}">${TAG[eff]}</span><b>${esc(O.ACTIVITIES.find(x=>x.id===a2).name)}</b> ${esc(t)}</li>`).join('')}${others.length>8?`<li class="more">+${others.length-8} more</li>`:''}</ul>`:''}</div></aside>`;}
 function render(){const keep=['.fx-rl-main','.fx-ev'].map(sel=>root.querySelector?.(sel)?.scrollTop||0),oldPanel=root.querySelector?.('.fx-run'),prevTop=oldPanel?.scrollTop||0,prevKind=state.panelKind;if(state.list!==state.lastTab){keep[0]=0;state.lastTab=state.list;}root.innerHTML=`${profile()}${scale()}<div class="fx-layout">${matrix()}${runPanel()}</div>${rulesList()}<p class="legend">Illustrative framework on synthetic data. Variations describe typical differences between structures; confirm each against firm policy before use. The onboarding history and the agent steps for clients other than Alpenridge are synthetic.</p>`;
  ['.fx-rl-main','.fx-ev'].forEach((sel,i)=>{const el=root.querySelector?.(sel);if(el&&typeof el.scrollTop==='number')el.scrollTop=i===1&&state.evReset?0:keep[i];});state.evReset=false;
  // Keep the agent that is working in view inside the panel.
  const panel=root.querySelector?.('.fx-run'),kind=state.col?'run:'+state.col:'build';
  // Fit the panel to the space left on screen so it scrolls inside itself and the working agent stays visible.
  if(panel?.getBoundingClientRect&&window.innerHeight){const top=Math.max(12,panel.getBoundingClientRect().top);panel.style.maxHeight=Math.max(320,window.innerHeight-top-12)+'px';}
  const active=panel?.querySelector?.('.fx-step.active');
  // The new-client card scrolls into view once; after that the panel keeps where the presenter left it.
  if(panel&&typeof panel.scrollTop==='number'){const card=built()&&!state.col&&!state.cardSeen&&panel.querySelector('.fx-new');let target=prevKind===kind?prevTop:0;if(active)target=active.offsetTop-70;else if(card&&typeof card.offsetTop==='number'){target=card.offsetTop-64;state.cardSeen=true;}panel.scrollTop=Math.max(0,target);}
  state.panelKind=kind;
  // Jump to an activity in the standard guideline.
  if(state.stdJump){const el=root.querySelector?.('#fx-std-'+state.stdJump),main=root.querySelector?.('.fx-rl-main');if(el&&main&&typeof el.offsetTop==='number')main.scrollTop=el.offsetTop-12;state.stdJump=null;}}
 function cancel(){if(timer!==null)clearTimeout(timer);timer=null;}
 const dur=(col,step)=>{const s=startOf(col);return step<s.h1?900:step===s.h1?700:step<s.a2?200:850;};
 function tick(){timer=null;state.step++;if(state.step>=lastStep(state.col)){state.step=lastStep(state.col);state.playing=false;}render();if(state.playing)timer=setTimeout(tick,dur(state.col,state.step+1));}
 function btick(){timer=null;state.bstep++;if(state.bstep>=B.done){state.bstep=B.done;state.building=false;}render();if(state.building)timer=setTimeout(btick,bdur(state.bstep+1));}
 function startBuild(){cancel();state.col=null;state.cell=null;state.playing=false;state.alp=false;state.cardSeen=false;state.decided={};state.bstep=-1;state.building=true;btick();}
 function play(col){cancel();state.col=col;state.cell=null;state.step=col==='custom'?startOf(col).h1-1:-1;state.playing=true;tick();}
 function onClick(e){const b=e.target.closest('button,[data-fx-list]');if(!b||!root.contains(b)||b.dataset.source||b.dataset.view)return;const d=b.dataset;
  if(d.fxDecide!==undefined){const [i,v]=d.fxDecide.split(':');if(v)state.decided[i]=v;else delete state.decided[i];render();return;}
  if(d.fxList!==undefined){state.list=d.fxList||null;state.ev=null;state.listAct=null;render();return;}
  if(d.fxStd){state.list='standard';state.ev=null;state.stdAct=d.fxStd;state.stdJump=d.fxStd;render();return;}
  if(d.fxRulesFor!==undefined){state.list='learned';state.ev=null;state.listAct=d.fxRulesFor||null;state.lastTab=null;render();return;}
  if(d.fxEvopen){state.list='learned';state.listAct=null;state.ev={key:d.fxEvopen,ob:null};state.evReset=true;render();return;}
  if(d.fxEv!==undefined){state.ev=d.fxEv?{key:d.fxEv,ob:d.fxOb||null}:null;state.evReset=true;render();return;}
  if(d.fxAct==='build'){startBuild();return;}
  if(d.fxAct==='bskip'){cancel();state.building=false;state.bstep=B.done;render();return;}
  if(d.fxAct==='back'){cancel();state.playing=false;state.col=null;render();return;}
  if(d.fxAct==='extract'){if(built()){state.alp=true;play('alpenridge');}return;}
  if(d.fxCol){if(built()){if(d.fxCol==='alpenridge')state.alp=true;play(d.fxCol);}return;}
  if(d.fxAct==='skip'){cancel();state.playing=false;state.step=lastStep(state.col);render();return;}
  if(d.fxCell!==undefined){if(!built())return;state.cell=d.fxCell&&state.cell!==d.fxCell?d.fxCell:null;render();return;}
  if(d.fwAttr){const a=ATTR(d.fwAttr),cur=state.custom[a.id];if(a.multi)state.custom[a.id]=d.fwVal===''?[]:cur.includes(d.fwVal)?cur.filter(x=>x!==d.fwVal):[...cur,d.fwVal];else state.custom[a.id]=d.fwVal;cancel();state.playing=false;state.col='custom';state.step=lastStep('custom');render();}}
 function onEsc(e){if(e.key!=='Escape')return;if(state.ev){state.ev=null;render();}else if(state.list){state.list=null;render();}}
 render();root.addEventListener('click',onClick);document.addEventListener('keydown',onEsc);
 return ()=>{cancel();root.removeEventListener('click',onClick);document.removeEventListener('keydown',onEsc);};
}
window.SA_FRAMEWORK={markup,mount,DOCS,COLS,HISTORY,MINED};
})();
