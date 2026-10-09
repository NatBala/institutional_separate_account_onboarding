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
// Builder timeline in ticks: [agent, ticks, ms per tick]. About 50 seconds end to end, so each step can be followed live.
const PH=[['F1',48,250],['F2',28,250],['F3',56,250],['F4',24,250],['H',12,250],['F5',BCOLS.length*10,120]];
const PSTART=PH.reduce((a,p,i)=>(a.push(i?a[i-1]+PH[i-1][1]:0),a),[]),TOTAL=PSTART[PH.length-1]+PH[PH.length-1][1];
const phaseOf=t=>{let i=PH.length-1;while(i>0&&PSTART[i]>t)i--;return i;};
const progOf=(t,i)=>t<PSTART[i]?0:Math.min(1,(t-PSTART[i]+1)/PH[i][1]);
const POLICY={aml:'AML/KYC policy',ubo:'Beneficial ownership standard',service:'Client servicing standard',contract:'Contracting standard',guidelines:'Guideline coding standard',billing:'Fee and billing policy',account:'Account opening procedure',reporting:'Client reporting standard',funding:'Funding and transition procedure',servicing:'Client servicing standard'};
const pct=x=>Math.round(x*100)+'%';
// Every pattern the Pattern miner tests: each learned rule, plus attribute–activity pairs that did not hold often enough.
const CANDS=(()=>{const r=rng(7),out=MINED.rules.map(x=>({...x,kept:MINED.learned.includes(x)}));
 for(const a of O.ATTRS)for(const [v] of a.options)for(const act of O.ACTIVITIES){if(O.RULES.some(x=>x[0]===a.id&&x[1]===v&&x[2]===act.id)||r()>0.42)continue;const n=HISTORY.filter(h=>has(h.cfg,a.id,v)).length;if(n<3)continue;const hits=Math.round(n*(0.04+r()*0.5));out.push({a:a.id,v,act:act.id,effect:null,n,hits,support:hits/n,kept:false});}
 const rr=rng(11);for(let i=out.length-1;i>0;i--){const j=Math.floor(rr()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;})();
const markup='<div id="fw-root" class="fx"></div>';
function mount(root,opt={}){
 const state={col:null,cell:null,step:-1,custom:JSON.parse(JSON.stringify(O.PROFILES.find(p=>p.id==='cit').cfg)),playing:false,bt:-1,building:false,alp:false,list:null,ev:null,listAct:null,stdAct:null,cardSeen:false,decided:{},view:'matrix',mapCol:'cit',vmSel:null};
 const built=()=>state.bt>=TOTAL,colIx=c=>BCOLS.findIndex(x=>x[0]===c),f5=()=>state.bt-PSTART[5];
 // The Matrix builder fills one cell per tick, column by column.
 const cellOn=(c,i)=>c==='alpenridge'?state.alp:built()||f5()>colIx(c)*10+i,shown=c=>cellOn(c,0),colDone=c=>cellOn(c,9);
 const cols=()=>COLS.filter(([c])=>c!=='alpenridge'||state.alp);
 let timer=null;
 const cfgFor=col=>col==='custom'?state.custom:O.PROFILES.find(p=>p.id===col).cfg;
 // A proposed rule the policy owner approves is applied like any learned rule: it adds its step for every matching client.
 const approved=()=>MINED.proposals.map((p,i)=>({...p,i})).filter(p=>state.decided[p.i]==='approved');
 const resultFor=col=>{const cfg=cfgFor(col),res=O.configure(cfg);for(const p of approved())if(has(cfg,p.a,p.v))res.acts.find(x=>x.id===p.act).changes.push({attr:p.a,val:p.v,effect:'added',text:p.text,effort:1,by:attrLabel(p.a,p.v),proposal:p.i});return res;};
 const nDocs=col=>col==='custom'?0:DOCS[col].length;
 // Event timeline for one client: each document, the human check, ten activities, then one event per downstream agent.
 const startOf=col=>{const d=nDocs(col);return {docs:0,h1:d,fw:d+1,a2:d+11,risk:d+12,a5:d+13,a6:d+14,a7:d+15,done:d+16};};
 const lastStep=col=>col==='alpenridge'?startOf(col).a2:startOf(col).done;
 function cell(col,a,i,result){if(!cellOn(col,i))return `<td class="fx-cell empty"><span></span></td>`;const s=startOf(col),pending=state.col===col&&state.step<s.fw+i;if(pending)return `<td class="fx-cell pending" aria-label="Waiting for the agents"><span>…</span></td>`;
  const ch=result.acts[i].changes,rep=ch.some(c=>c.effect==='replaced'),add=ch.filter(c=>c.effect==='added').length,adj=ch.some(c=>c.effect==='adjusted');
  const [cls,txt]=rep?['rep','Replaced'+(add?` +${add}`:'')]:add?['add',`+${add} added`]:adj?['adj','Adjusted']:['std','Standard'];
  const fresh=(state.col===col&&state.playing&&state.step===s.fw+i)||(state.building&&f5()===colIx(col)*10+i);
  return `<td class="fx-cell ${cls} ${fresh?'fresh':''} ${state.cell===col+'|'+a.id?'sel':''}"><button type="button" data-fx-cell="${col}|${a.id}" title="${esc(a.name)}: ${esc(ch.map(c=>TAG[c.effect]+' · '+c.text).join(' | ')||'Standard activity')}">${txt}</button></td>`;}
 function matrix(){const COLS=cols(),results=Object.fromEntries(COLS.map(([c])=>[c,resultFor(c)]));
  return `<section class="panel fx-matrix"><div class="fx-mhead vm-head"><div><h3>Ten shared activities × every client type</h3><p class="smalltext">${built()&&!state.alp?'Built from onboarding history. A new client has arrived: extract its attributes on the right to add it.':built()?'Built from onboarding history. Click a cell for the rule and its evidence, or a client to run the onboarding agents.':state.bt<0?'Empty until the Framework Builder learns the rules from onboarding history.':state.bt>=PSTART[5]?'The Matrix builder is applying the approved rules to each client type…':'The Framework Builder is learning the rules…'}</p></div>${viewToggle()}</div>
  <div class="fx-table-wrap"><table class="fx-table"><thead><tr><th class="fx-corner">Shared activity</th>${COLS.map(([c,name,sub])=>`<th class="${state.col===c?'sel':''} ${c==='custom'?'custom':''} ${c==='alpenridge'?'current':''}"><button type="button" data-fx-col="${c}" aria-pressed="${state.col===c}" ${built()?'':'disabled'}>${c==='alpenridge'?'<i>New client</i>':''}<b>${esc(name)}</b><small>${esc(sub)}</small></button></th>`).join('')}</tr></thead>
  <tbody>${O.STAGES.map((st,si)=>O.ACTIVITIES.map((a,i)=>a.stage!==si?'':`<tr><th scope="row" title="${esc(st.name)}"><span>${esc(a.name)}</span></th>${COLS.map(([c])=>cell(c,a,i,results[c])).join('')}</tr>`).join('')).join('')}</tbody>
  <tfoot><tr><th scope="row">Activities that vary</th>${COLS.map(([c])=>`<td>${!colDone(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.filter(a=>a.changes.length).length+'/10'}</td>`).join('')}</tr><tr><th scope="row">Rules reused</th>${COLS.map(([c])=>`<td>${!colDone(c)?'—':state.col===c&&state.step<startOf(c).a2?'…':results[c].acts.reduce((n,a)=>n+a.changes.length,0)}</td>`).join('')}</tr><tr><th scope="row">New process steps</th>${COLS.map(([c])=>`<td class="zero">${colDone(c)?0:'—'}</td>`).join('')}</tr></tfoot></table></div>
  <div class="fx-legend"><button type="button" class="fx-std-open" data-fx-list="standard">📘 Standard onboarding guideline</button><span class="std">Standard</span><span class="adj">Adjusted</span><span class="rep">Replaced</span><span class="add">+ Added</span><em>Hover or click a cell for the detail</em></div>
  ${cellDetail()}</section>`;}
 /* ---------- Variation map: client documents → client attributes → the ten standard activities ----------
    One line per rule that applies, coloured by its effect and as thick as its effort. Activities with no line stay standard. */
 const EFF_W=[1.8,2.8,4.2];
 function mapView(){const col=state.mapCol,cfg=cfgFor(col),r=resultFor(col),docs=col==='custom'?[]:DOCS[col]||[],W=1200,colName=COLS.find(c=>c[0]===col)[1];
  // Activity rows, grouped by stage.
  const rows=[];let y=40;O.STAGES.forEach((st,si)=>{rows.push({stage:st,y});y+=24;O.ACTIVITIES.forEach((a,i)=>{if(a.stage===si){rows.push({a,i,y});y+=46;}});y+=4;});const H=y+4;
  const actY=Object.fromEntries(rows.filter(x=>x.a).map(x=>[x.a.id,x.y+19]));
  const attrs=O.ATTRS.map((a,k)=>({a,vals:a.multi?cfg[a.id]:[cfg[a.id]],y:40+(H-80)*(k+0.5)/O.ATTRS.length}));
  const attrY=Object.fromEntries(attrs.map(x=>[x.a.id,x.y]));
  const dn=Math.max(1,docs.length),docY=docs.map((d,k)=>40+(H-80)*(k+0.5)/dn);
  const curve=(x1,y1,x2,y2)=>`M${x1} ${y1}C${(x1+x2)/2} ${y1},${(x1+x2)/2} ${y2},${x2} ${y2}`;
  const used=new Set(r.acts.flatMap(a=>a.changes.map(c=>c.attr)));
  const sel=state.vmSel,selKeys=!sel?[]:sel.type==='doc'?(docs[sel.i]?docs[sel.i].attrs.map(([a])=>'a-'+a):[]):['a-'+sel.id],dimIf=cls=>selKeys.length&&!selKeys.some(k=>cls.split(' ').includes(k))?' dim':'';
  const docEdges=docs.flatMap((d,k)=>d.attrs.filter(([a,v])=>has(cfg,a,v)).map(([a])=>`<path class="vm-e vm-doc a-${a}${dimIf('a-'+a)}" d="${curve(214,docY[k],326,attrY[a])}"/>`)).join('');
  const ruleEdges=r.acts.flatMap(a=>a.changes.map(c=>`<path class="vm-e e-${c.effect} a-${c.attr} t-${a.id}${dimIf('a-'+c.attr)}" style="stroke-width:${EFF_W[c.effort??1]}" d="${curve(560,attrY[c.attr],690,actY[a.id])}"><title>${esc(c.by)} → ${esc(a.name)}: ${esc(TAG[c.effect])}. ${esc(c.text)}</title></path>`)).join('');
  const kindOf=a=>{const ch=a.changes,rp=ch.find(c=>c.effect==='replaced'),ad=ch.filter(c=>c.effect==='added').length,adj=ch.some(c=>c.effect==='adjusted');return rp?['rep','Replaced'+(ad?` +${ad}`:'')]:ad&&!adj?['add',`+${ad} added`]:adj?['adj','Adjusted'+(ad?` +${ad}`:'')]:['std','Standard'];};
  const fo=(x,y,w,h,html)=>`<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">${html}</foreignObject>`;
  const docNodes=docs.length?docs.map((d,k)=>fo(0,docY[k]-22,214,44,`<button xmlns="http://www.w3.org/1999/xhtml" type="button" class="vm-doc-n ${sel?.type==='doc'&&sel.i===k?'sel':''}" data-vm-doc="${k}" data-vm-hl="${d.attrs.map(([a])=>'a-'+a).join(' ')}" title="Show the evidence"><b>${esc(d.src)}</b><span>${esc(d.text.length>62?d.text.slice(0,60)+'…':d.text)}</span></button>`)).join(''):fo(0,H/2-40,214,80,`<div xmlns="http://www.w3.org/1999/xhtml" class="vm-doc-n none"><b>Set by hand</b><span>In production the Context agent reads the client’s documents and sets these attributes.</span></div>`);
  const attrNodes=attrs.map(({a,vals,y})=>fo(326,y-26,234,52,`<button xmlns="http://www.w3.org/1999/xhtml" type="button" class="vm-attr ${used.has(a.id)?'':'quiet'} ${sel?.type==='attr'&&sel.id===a.id?'sel':''}" data-vm-pick="${a.id}" data-vm-hl="a-${a.id}" title="Show the evidence"><span>${esc(a.name)}</span><b>${vals.length?vals.map(v=>esc(label(a.id,v))).join(' · '):'None'}</b></button>`)).join('');
  const actNodes=rows.map(x=>x.stage?`<text class="vm-stage" x="690" y="${x.y+15}">${esc(x.stage.name.toUpperCase())}</text>`:(()=>{const a=r.acts[x.i],[k,t]=kindOf(a),first=a.changes.find(c=>c.effect==='replaced')||a.changes[0];return fo(690,x.y,510,38,`<button xmlns="http://www.w3.org/1999/xhtml" type="button" class="vm-act ${k} ${state.cell===col+'|'+a.id?'sel':''}" data-fx-cell="${col}|${a.id}" data-vm-hl="t-${a.id}"><b>${esc(a.name)}</b><em class="fx-cell-tag ${k}">${t}</em><span>${first?esc(first.text):'Runs as written in the standard guideline'}</span></button>`);})()).join('');
  const varied=r.acts.filter(a=>a.changes.length).length,rules=r.acts.reduce((n,a)=>n+a.changes.length,0),heavy=r.acts.reduce((n,a)=>n+a.changes.filter(c=>c.effort===2).length,0);
  const presets=[...(state.alp?[['alpenridge','Alpenridge','New client']]:[]),...BCOLS.filter(c=>c[0]!=='custom').map(c=>[c[0],c[1],c[2]]),['custom','Build your own','Pick any mix']];
  const picker=`<div class="vm-presets">${presets.map(([c,n,sub])=>`<button type="button" class="${col===c?'on':''} ${c==='alpenridge'?'alp':''}" data-vm-col="${c}"><b>${esc(n)}</b><small>${esc(sub)}</small></button>`).join('')}</div>
  <div class="vm-attrs">${O.ATTRS.map(a=>`<div><span>${esc(a.name)}</span><div>${a.options.map(([v,l])=>{const on=has(cfg,a.id,v);return `<button type="button" class="${on?'on':''}" data-vm-attr="${a.id}" data-vm-val="${v}">${esc(l)}</button>`;}).join('')}${a.multi?`<button type="button" class="${cfg[a.id].length?'':'on'}" data-vm-attr="${a.id}" data-vm-val="">None</button>`:''}</div></div>`).join('')}</div>`;
  const summary=`<div class="vm-sum"><div class="vm-kpis"><div><b>${varied}<small>/10</small></b><span>activities change</span></div><div><b>${10-varied}</b><span>stay standard</span></div><div><b>${rules}</b><span>learned rules apply</span></div><div><b>${heavy}</b><span>heavy changes</span></div><div class="${r.conflicts.length?'warn':''}"><b>${r.conflicts.length}</b><span>combinations to check</span></div><div><b>0</b><span>new process steps</span></div></div>
   ${r.conflicts.map(c=>`<p class="vm-warn">⚠ ${esc(c)}</p>`).join('')}
   ${col==='alpenridge'?`<div class="vm-go"><p><b>This is Alpenridge, read from its own documents.</b> Next, the seven onboarding agents build its plan.</p><button type="button" class="btn primary" data-view="agents">Run the agents for Alpenridge →</button></div>`:''}</div>`;
  return `<section class="panel vm"><div class="fx-mhead vm-head"><div><h3>What changes against the standard: ${esc(colName==='Your mix'?'your mix':colName)}</h3><p class="smalltext">Pick a client type, or change any attribute. Each line is a learned rule: <i class="k adj"></i>adjusted <i class="k rep"></i>replaced <i class="k add"></i>added. Thicker lines are heavier changes. Hover to trace a line; click an activity for the detail.</p></div>${viewToggle()}</div>
  ${picker}
  <div class="vm-wrap"><svg class="vm-svg ${selKeys.length?'tracing':''}" data-sel="${selKeys.join(' ')}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Variation map for ${esc(colName)}">
   <text class="vm-colh" x="0" y="18">CLIENT DOCUMENTS</text><text class="vm-colh" x="326" y="18">CLIENT ATTRIBUTES</text><text class="vm-colh" x="690" y="18">STANDARD ONBOARDING · 10 ACTIVITIES</text>
   <g class="vm-edges">${docEdges}${ruleEdges}</g>${docNodes}${attrNodes}${actNodes}</svg></div>
  ${vmEvidence(col,cfg,r,docs)}${summary}${cellDetail()}</section>`;}
 // Evidence for a selected document or attribute: the passage itself, what the Context agent read from it, and what it changes.
 function vmEvidence(col,cfg,r,docs){const sel=state.vmSel;if(!sel)return '';const C=window.CORPUS;
  const passage=src=>{const id=src.split('§')[0],doc=C?.documents?.find(x=>x.id===id),chunk=doc?.chunks?.find(x=>x.id===src);return {doc,chunk};};
  const changes=attrIds=>r.acts.flatMap(a=>a.changes.filter(c=>attrIds.includes(c.attr)).map(c=>({a,c})));
  const changeList=xs=>xs.length?`<ul class="vm-ev-chg">${xs.map(({a,c})=>{const m=ruleFor(c.attr,c.val,a.id,c.text);return `<li><span class="fx-eff fw-${c.effect}">${TAG[c.effect]}</span><b>${esc(a.name)}</b> ${esc(c.text)}<small>Rule: if ${esc(c.by)}${m?` · learned from ${m.hits} of ${m.n} past onboardings <button type="button" class="fx-link" data-fx-evopen="r${m.k}">See the evidence →</button>`:''}</small></li>`;}).join('')}</ul>`:'<p class="vm-ev-none">No rule changes the standard for this attribute: those activities run as written.</p>';
  const quote=d=>{const {doc,chunk}=d.cite?passage(d.src):{};return `<div class="vm-ev-quote"><div class="vm-ev-src"><b>${esc(d.src)}</b>${doc?`<span>${esc(doc.title)} · ${esc(doc.kind)} · ${esc(doc.date)}</span>`:'<span>Synthetic client document</span>'}${d.cite?`<button type="button" class="fx-link" data-source="${esc(d.src)}">Open the full document →</button>`:''}</div>${chunk?.heading?`<small>${esc(chunk.heading)}</small>`:''}<blockquote>${esc(chunk?.text||d.text)}</blockquote></div>`;};
  let head,body;
  if(sel.type==='doc'){const d=docs[sel.i];if(!d)return '';const ids=d.attrs.filter(([a,v])=>has(cfg,a,v)).map(([a])=>a);
   head=`Evidence from ${esc(d.src)}`;
   body=`${quote(d)}<h5>What the Context agent read from it</h5><div class="fx-attrs">${d.attrs.filter(([a,v])=>has(cfg,a,v)).map(chip).join('')}</div><h5>What this changes against the standard</h5>${changeList(changes(ids))}`;}
  else{const a=ATTR(sel.id),vals=a.multi?cfg[a.id]:[cfg[a.id]],from=docs.filter(d=>d.attrs.some(([x,v])=>x===a.id&&has(cfg,x,v)));
   head=`${esc(a.name)}: ${vals.length?vals.map(v=>esc(label(a.id,v))).join(' · '):'None'}`;
   body=`<h5>Found in ${from.length?`${from.length} passage${from.length>1?'s':''}`:'no document'}</h5>${from.length?from.map(quote).join(''):`<p class="vm-ev-none">${col==='custom'?'Set by hand for this mix. In production the Context agent reads it from the client’s documents.':'Not stated in the documents; the standard applies.'}</p>`}<h5>What this changes against the standard</h5>${changeList(changes([a.id]))}`;}
  return `<section class="vm-ev"><header><div><span class="eyebrow">Evidence</span><h4>${head}</h4></div><button type="button" class="ob-x" data-vm-close aria-label="Close">×</button></header>${body}</section>`;}
 const viewToggle=()=>`<div class="vm-toggle" role="tablist"><button type="button" class="${state.view==='matrix'?'on':''}" data-fx-view="matrix" ${built()?'':'disabled'}>Matrix</button><button type="button" class="${state.view==='map'?'on':''}" data-fx-view="map" ${built()?'':'disabled'}>Variation map</button></div>`;
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
   stage('done',8,()=>`<small>Plan, owners and risks ready for the second human checkpoint.</small>`)
  ];
  if(col==='alpenridge')steps.splice(3);
  const handoff=col==='alpenridge'&&state.step>=s.a2?`<div class="fx-handoff"><span class="eyebrow">Framework applied to Alpenridge</span><h4>${r.acts.filter(a=>a.changes.length).length} of 10 activities vary · ${r.acts.reduce((n,a)=>n+a.changes.length,0)} rules reused · 0 new process steps</h4><p>Next, the seven onboarding agents build Alpenridge’s plan from its documents: requirements, precedent, risk, plan, owners and an evidence check, with two human checkpoints.</p><button type="button" class="btn primary" data-view="agents">Run the agents for Alpenridge →</button></div>`:'';
  return `<aside class="panel fx-run"><div class="fx-run-head"><div><button type="button" class="fx-back" data-fx-act="back">← How the matrix was built</button><span class="eyebrow">${col==='alpenridge'?'New client · the framework is applied':'Onboarding agents using the framework'}</span><h3>${esc(name)}</h3></div><div class="run-buttons">${state.playing?'<button type="button" class="btn small" data-fx-act="skip">Skip ⏭</button>':''}</div></div>
  ${col==='custom'?customControls():''}<ol class="fx-pipe">${steps.join('')}</ol>${handoff}</aside>`;}
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
 const tested=()=>Math.round(CANDS.length*progOf(state.bt,2)),learnedSoFar=()=>built()?MINED.learned.length:CANDS.slice(0,tested()).filter(x=>x.kept).length;
 function scale(){const b=state.bt,read=b<0?null:Math.round(HISTORY.length*progOf(b,0)),learned=b<PSTART[2]?null:learnedSoFar(),v=x=>x==null?'—':x;
  const k=(cls,val,lab,list)=>list?`<button type="button" class="fx-kpi fx-kpi-open ${cls}" data-fx-list="${list}"><span>${lab}</span><strong>${val}</strong><em>See the rules →</em></button>`:`<div class="fx-kpi ${cls}"><span>${lab}</span><strong>${val}</strong></div>`;
  return `<div class="fx-scale">${k('blue',v(read),'Past onboardings learned from')}${k('green',v(learned),'Rules learned, with evidence',learned?'learned':null)}${k('amber',b>=PSTART[4]?MINED.proposals.length:'—',Object.values(state.decided).includes('approved')?`New rules proposed · ${Object.values(state.decided).filter(x=>x==='approved').length} approved`:'New rules proposed',b>=PSTART[4]?'proposed':null)}${k('hero',built()?combos.toLocaleString('en-US'):'—','Client set-ups covered')}${k('slate',7,'Onboarding agents, same for every client')}${k('green',built()?0:'—','New processes designed')}</div>`;}
 const pill=st=>`<em class="fx-pill ${st}">${st==='done'?'Done':st==='active'?'Running':'Queued'}</em>`;
 const stepHtml=(st,id,name,desc,body)=>`<li class="fx-step ${st}"><span class="fx-badge">${id}</span><div><div class="fx-step-head"><b>${esc(name)}</b>${pill(st)}</div>${st==='wait'?`<small class="fx-desc">${esc(desc)}</small>`:`<div class="fx-out">${body}</div>`}</div></li>`;
 /* ---------- Framework Builder console: a stepper, the agent at work with its progress, and a live stream ---------- */
 const actName=id=>O.ACTIVITIES.find(a=>a.id===id).name;
 const tags=r=>[label('vehicle',r.cfg.vehicle),label('relationship',r.cfg.relationship),label('funding',r.cfg.funding),r.cfg.tm==='yes'?'TM':'No TM',label('reporting',r.cfg.reporting),r.cfg.restrictions.length?r.cfg.restrictions.map(x=>label('restrictions',x)).join(' + '):'No restrictions',label('billing',r.cfg.billing)];
 const FL=['Client-specific restrictions inside a pooled CIT or fund','Custom reporting on a pooled vehicle','A transition manager on an all-cash funding','A negotiated fee on a mutual fund share class'];
 // The stream lines produced at tick t (one or more).
 function linesAt(t){const i=phaseOf(t),j=t-PSTART[i],n=PH[i][1],H=HISTORY,M=MINED;
  if(i===0){const r=H[Math.min(H.length-1,Math.round(H.length*(j+1)/n)-1)];return [['ok',`Read <b>${r.id}</b> · ${r.docs} documents · ${r.tasks} task records`]];}
  if(i===1){const r=H[Math.min(H.length-1,Math.round(H.length*(j+1)/n)-1)];return [['ok',`Tagged <b>${r.id}</b> → ${tags(r).map(x=>`<i>${esc(x)}</i>`).join('')}`]];}
  if(i===2){const a=Math.round(CANDS.length*j/n),b=Math.round(CANDS.length*(j+1)/n);return CANDS.slice(a,b).map(c=>c.kept?['ok',`<b>${esc(attrLabel(c.a,c.v))}</b> → ${esc(actName(c.act))} ${TAG[c.effect].toLowerCase()} · ${c.hits}/${c.n} (${pct(c.support)})`]:['no',`${esc(attrLabel(c.a,c.v))} → ${esc(actName(c.act))} · ${c.hits}/${c.n} (${pct(c.support)})`]);}
  if(i===3){const fl=[5,11,17,22].indexOf(j);if(fl>=0)return [['warn',`Not allowed by policy: ${esc(FL[fl])} → added as a check`]];const k=Math.min(M.learned.length-1,Math.round(M.learned.length*(j+1)/n)-1),x=M.learned[k];return [['ok',`Rule ${k+1}/${M.learned.length} · ${esc(attrLabel(x.a,x.v))} → ${esc(actName(x.act))} · matches the ${esc(POLICY[x.act])}`]];}
  if(i===4){const p=M.proposals[j<6?0:1];return j===2||j===8?[['warn',`New pattern: teams added “${esc(p.text)}” by hand in ${p.hits} of ${p.n} ${esc(label(p.a,p.v))} onboardings`]]:j===4||j===10?[['ok',`Sent to the policy owner for approval. Not applied until approved.`]]:[];}
  const c=Math.floor(j/10),ai=j%10,col=BCOLS[c],a=O.ACTIVITIES[ai],ch=resultFor(col[0]).acts[ai].changes,rp=ch.find(x=>x.effect==='replaced'),ad=ch.filter(x=>x.effect==='added').length;
  return [['ok',`${esc(col[1])} · ${esc(a.name)} → <b>${rp?'Replaced'+(ad?` +${ad}`:''):ad?`+${ad} added`:ch.length?'Adjusted':'Standard'}</b>`]];}
 function stream(t){const from=PSTART[phaseOf(t)],out=[];for(let k=Math.max(from,t-14);k<=t;k++)out.push(...linesAt(k).map(l=>[...l,k===t]));return out.slice(-6);}
 function liveCard(){const t=state.bt,i=phaseOf(t),p=progOf(t,i),[id,name,desc]=BUILDER[i],H=HISTORY,M=MINED,n=H.length;
  const nums=(xs)=>`<div class="fx-nums">${xs.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
  const dist=(attr,k)=>{const sub=H.slice(0,k),opts=O.ATTRS.find(a=>a.id===attr).options,max=Math.max(1,...opts.map(([v])=>H.filter(r=>r.cfg[attr]===v).length));return `<div class="fx-bars"><span class="fx-bars-t">${esc(ATTR(attr).name)}</span>${opts.map(([v,l])=>{const c=sub.filter(r=>r.cfg[attr]===v).length;return `<div><span>${esc(l)}</span><i style="width:${c/max*100}%"></i><b>${c}</b></div>`;}).join('')}</div>`;};
  let body='',bar='';
  if(i===0){const k=Math.round(n*p);bar=`${k} of ${n} closed onboardings read`;body=nums([[k,'Onboardings'],[Math.round(M.docs*p).toLocaleString('en-US'),'Documents'],[Math.round(M.tasks*p).toLocaleString('en-US'),'Task records']]);}
  else if(i===1){const k=Math.round(n*p);bar=`${k} of ${n} onboardings tagged with 7 attributes`;body=`<div class="fx-bars-wrap">${dist('vehicle',k)}${dist('relationship',k)}</div>`;}
  else if(i===2){const k=tested(),kept=CANDS.slice(0,k).filter(x=>x.kept).length;bar=`${k} of ${CANDS.length} patterns tested`;body=nums([[k,'Patterns tested'],[kept,'Rules kept'],[k-kept,'Dropped']]);}
  else if(i===3){const k=Math.round(M.learned.length*p),f=[5,11,17,22].filter(x=>t-PSTART[3]>=x).length;bar=`${k} of ${M.learned.length} rules checked against policy`;body=nums([[k,'Rules checked'],[POLICY_DOCS,'Policy documents'],[f,'Checks added']]);}
  else if(i===4){const k=(t-PSTART[4]>=2?1:0)+(t-PSTART[4]>=8?1:0);bar=`Looking for steps teams add by hand`;body=nums([[k,'New rules proposed'],[k,'Waiting for approval']]);}
  else{const k=Math.min(BCOLS.length*10,f5()+1);bar=`${k} of ${BCOLS.length*10} matrix cells filled`;body=nums([[k,'Cells filled'],[Math.floor(k/10),`of ${BCOLS.length} client types`]]);}
  return `<section class="fx-live"><header><span class="fx-badge">${id}</span><div><b>${esc(name)}</b><small>${esc(desc)}</small></div><em class="fx-pill active">Running</em></header>
  <div class="fx-prog"><i style="width:${Math.round(p*100)}%"></i></div><div class="fx-prog-t"><span>${bar}</span><b>${Math.round(p*100)}%</b></div>${body}
  ${i===2?'<p class="fx-stream-key"><span class="ok">✓ kept as a rule (80% or more)</span><span class="no">✕ dropped (under 80%)</span></p>':''}<ol class="fx-stream" aria-live="polite">${stream(t).map(([cls,txt,fresh])=>`<li class="${cls} ${fresh?'new':''}">${txt}</li>`).join('')}</ol></section>`;}
 // One line per finished agent: what it produced.
 function doneLines(){const t=state.bt,M=MINED,H=HISTORY,pend=M.proposals.filter((p,i)=>!state.decided[i]).length,fin=i=>built()||t>=PSTART[i]+PH[i][1];
  const L=[[`Read <b>${H.length}</b> closed onboardings (${H[0].year}–${H[H.length-1].year}) · ${M.docs.toLocaleString('en-US')} documents · ${M.tasks.toLocaleString('en-US')} task records`,''],
   [`Tagged every onboarding with the 7 client attributes`,''],
   [`Tested ${CANDS.length} patterns · <b>${M.learned.length}</b> rules learned, median ${pct(M.median)} consistency`,`<button type="button" class="fx-link" data-fx-list="learned">See the rules →</button>`],
   [`All ${M.learned.length} rules checked against ${POLICY_DOCS} policy documents · ${CONFLICT_CHECKS.length} combinations became checks`,''],
   [pend?`${pend} new rule${pend>1?'s':''} wait for approval`:'Every proposed rule has a decision',pend&&built()?`<button type="button" class="fx-link" data-fx-list="proposed">Review and approve →</button>`:''],
   [`Matrix built for ${BCOLS.length-1} client types and a “Your mix” column`,'']];
  const rows=L.map(([txt,act],i)=>fin(i)?`<li class="${i===4&&pend?'wait':''}"><span class="fx-badge">${BUILDER[i][0]}</span><div><b>${esc(BUILDER[i][1])}</b><small>${txt}</small>${act}</div></li>`:'').join('');
  return rows?`<ul class="fx-done">${rows}</ul>`:'';}
 function stepper(){const t=state.bt;return `<ol class="fx-stepper">${BUILDER.map(([id,name],i)=>{const st=built()||t>=PSTART[i]+PH[i][1]?'done':t>=PSTART[i]?'active':'wait';return `<li class="${st}"><span>${st==='done'?'✓':id}</span><small>${esc(name)}</small></li>`;}).join('')}</ol>`;}
 function builderPanel(){const t=state.bt;
  return `<aside class="panel fx-run fx-console"><div class="fx-run-head"><div><span class="eyebrow">How the framework is built</span><h3>Framework Builder agents</h3></div>${state.building?'<button type="button" class="btn small" data-fx-act="bskip">Skip ⏭</button>':''}</div>
  ${stepper()}
  ${t<0?`<p class="fx-lead">The framework is not written by hand. Six agents learn it from ${HISTORY.length} closed onboardings: they read the files, tag each client, find the patterns, check them against policy, send anything new to a policy owner, and fill the matrix.</p><ul class="fx-done fx-plan">${BUILDER.map(([id,name,desc])=>`<li><span class="fx-badge">${id}</span><div><b>${esc(name)}</b><small>${esc(desc)}</small></div></li>`).join('')}</ul>`:''}
  ${state.building?liveCard():''}${t>=0?doneLines():''}
  ${built()?newClient():''}</aside>`;}
 // A new client arrives once the matrix exists. Extracting its attributes adds it to the matrix.
 function newClient(){if(state.alp)return `<div class="fx-next"><b>Alpenridge is in the matrix.</b><button type="button" class="btn primary" data-view="agents">Run the agents for Alpenridge →</button><small>Or click any other client column to see the agents adapt to it.</small></div>`;
  const C=window.CORPUS,ids=[...new Set(DOCS.alpenridge.map(d=>d.src.split('§')[0]))];
  return `<div class="fx-new ${state.cardSeen?'':'enter'}"><span class="eyebrow">New client received</span><h4>Alpenridge Pension Foundation</h4><p>USD 250m global investment-grade bond separate account · Swiss pension foundation</p><ul>${ids.map(id=>{const d=C?.documents?.find(x=>x.id===id);return `<li><b>${esc(d?id:'RM')}</b>${esc(d?d.title:id)}</li>`;}).join('')}</ul><p class="smalltext">It is not in the matrix yet. The Context agent reads these documents and extracts the seven attributes; Operations confirms them; the framework applies its rules.</p><button type="button" class="btn primary" data-fx-act="extract">Extract attributes and add to the matrix ▶</button></div>`;}
 // Full-screen list of the learned rules and the proposed ones, with the evidence behind each.
 function rulesList(){if(!state.list)return '';const M=MINED,learned=M.learned.slice(0,learnedSoFar()),tab=state.list,actName=id=>O.ACTIVITIES.find(a=>a.id===id).name,acts=state.listAct?O.ACTIVITIES.filter(a=>a.id===state.listAct):O.ACTIVITIES;
  const bar=x=>`<span class="fx-sup"><i style="width:${Math.round(x.support*100)}%"></i></span>`;
  const body=tab==='learned'?acts.map(a=>{const rs=learned.filter(x=>x.act===a.id);return rs.length?`<tbody><tr class="fx-rl-group"><th colspan="4">${esc(a.name)} <small>${rs.length} rule${rs.length>1?'s':''}</small></th></tr>${rs.map(x=>`<tr class="${state.ev?.key==='r'+x.k?'sel':''}"><td><span class="fx-attr"><em>${esc(ATTR(x.a).name)}</em>${esc(label(x.a,x.v))}</span></td><td><span class="fx-eff fw-${x.effect}">${TAG[x.effect]}</span>${esc(x.text)}</td><td class="fx-rl-ev"><button type="button" class="fx-ev-open" data-fx-ev="r${x.k}">${bar(x)}<b>${pct(x.support)}</b><small>${x.hits} of ${x.n} past onboardings →</small></button></td><td class="fx-rl-ex">${x.examples.map(e=>`<button type="button" class="fx-ex" data-fx-ev="r${x.k}" data-fx-ob="${e}">${e}</button>`).join(' ')}</td></tr>`).join('')}</tbody>`:'';}).join(''):'';
  const reach=p=>cols().filter(([c])=>shown(c)&&has(cfgFor(c),p.a,p.v)).map(([,n])=>n);
  const prop=M.proposals.map((p,pi)=>{const d=state.decided[pi],where=reach(p);return `<article class="fx-prop ${d||''} ${state.ev?.key==='p'+pi?'sel':''}"><header><span class="fx-eff fw-${d==='approved'?'added':d==='rejected'?'rejected':'proposed'}">${d==='approved'?'Approved':d==='rejected'?'Rejected':'Proposed'}</span><b>If ${esc(attrLabel(p.a,p.v))} → ${esc(actName(p.act))}</b></header><p>${esc(p.text)}</p><div class="fx-rl-ev"><button type="button" class="fx-ev-open" data-fx-ev="p${pi}">${bar(p)}<b>${pct(p.support)}</b><small>Teams added this step by hand in ${p.hits} of ${p.n} ${esc(label(p.a,p.v))} onboardings →</small></button><div class="fx-rl-ex">${p.examples.map(e=>`<button type="button" class="fx-ex" data-fx-ev="p${pi}" data-fx-ob="${e}">${e}</button>`).join(' ')}</div></div>
  ${d==='approved'?`<p class="fx-prop-why"><b>Applied.</b> It is now a rule: every ${esc(label(p.a,p.v))} client gets this step in ${esc(actName(p.act))}${where.length?`. In the matrix: ${esc(where.join(', '))}`:''}.</p>`:d==='rejected'?`<p class="fx-prop-why"><b>Not applied.</b> Teams can still add it by hand. The Framework Builder proposes it again if the pattern grows.</p>`:`<p class="fx-prop-why"><b>Why it is not applied yet:</b> it is a new step that no policy describes, and it held in ${pct(p.support)} of cases${p.support<0.8?', under the 80% bar':''}. A policy owner decides whether it becomes a rule.</p>`}
  <div class="fx-prop-act">${d?`<span class="fx-prop-status ${d}">${d==='approved'?'✓ Approved by the policy owner · applied to the matrix':'✕ Rejected by the policy owner'}</span><button type="button" class="fx-link" data-fx-decide="${pi}:">Undo</button>`:`<button type="button" class="btn small primary" data-fx-decide="${pi}:approved">✓ Approve and apply</button><button type="button" class="btn small" data-fx-decide="${pi}:rejected">Reject</button><span class="fx-prop-status">Waiting for the policy owner</span>`}</div></article>`;}).join('');
  const titles={standard:'Standard onboarding guideline',learned:'Rules learned, with evidence',proposed:'New rules proposed'};
  return `<div class="fx-rl-back" data-fx-list=""></div><aside class="fx-rl" role="dialog" aria-modal="true" aria-label="${titles[tab]}"><header class="fx-rl-head"><div><span class="eyebrow">${tab==='standard'?'The base playbook every client starts from':`Framework Builder · learned from ${HISTORY.length} closed onboardings`}</span><h2>${titles[tab]}</h2><p class="smalltext">${tab==='standard'?'Ten activities in five stages, the same for every client. Rules adjust, replace or add to these standards for each client type; nothing else changes.':tab==='learned'?`A rule is kept when the same change appeared in at least 3 past onboardings with that attribute, and in at least 80% of them. Median consistency ${pct(M.median)}. Click the evidence or an example to see the past onboardings behind a rule.`:'Steps teams kept adding by hand. A policy owner approves or rejects each one; an approved rule applies to the matrix straight away.'}</p></div><div class="fx-rl-tabs"><button type="button" class="${tab==='standard'?'on':''}" data-fx-list="standard">Standard guideline</button><button type="button" class="${tab==='learned'?'on':''}" data-fx-list="learned" ${learned.length?'':'disabled'}>Learned rules <b>${learned.length}</b></button><button type="button" class="${tab==='proposed'?'on':''}" data-fx-list="proposed" ${state.bt>=PSTART[4]?'':'disabled'}>Proposed rules <b>${M.proposals.length}</b></button><button type="button" class="ob-x" data-fx-list="" aria-label="Close">×</button></div></header>
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
 function render(){const keep=['.fx-rl-main','.fx-ev'].map(sel=>root.querySelector?.(sel)?.scrollTop||0),oldPanel=root.querySelector?.('.fx-run'),prevTop=oldPanel?.scrollTop||0,prevKind=state.panelKind;if(state.list!==state.lastTab){keep[0]=0;state.lastTab=state.list;}root.innerHTML=`${profile()}${scale()}${state.view==='map'&&built()?mapView():`<div class="fx-layout">${matrix()}${runPanel()}</div>`}${rulesList()}`;
  ['.fx-rl-main','.fx-ev'].forEach((sel,i)=>{const el=root.querySelector?.(sel);if(el&&typeof el.scrollTop==='number')el.scrollTop=i===1&&state.evReset?0:keep[i];});state.evReset=false;
  // Keep the agent that is working in view inside the panel.
  const panel=root.querySelector?.('.fx-run'),kind=state.col?'run:'+state.col:'build';
  // Fit the panel to the space left on screen so it scrolls inside itself and the working agent stays visible.
  if(panel?.getBoundingClientRect&&window.innerHeight){const top=Math.max(12,panel.getBoundingClientRect().top);panel.style.maxHeight=Math.max(320,window.innerHeight-top-12)+'px';}
  const active=panel?.querySelector?.('.fx-step.active');
  // The new-client card scrolls into view once; after that the panel keeps where the presenter left it.
  if(panel&&typeof panel.scrollTop==='number'){const card=built()&&!state.col&&!state.cardSeen&&panel.querySelector('.fx-new');let target=prevKind===kind?prevTop:0;const ho=!state.hoSeen&&panel.querySelector('.fx-handoff');if(ho&&typeof ho.offsetTop==='number'){target=ho.offsetTop-60;state.hoSeen=true;}else if(active)target=active.offsetTop-70;else if(card&&typeof card.offsetTop==='number'){target=card.offsetTop-64;state.cardSeen=true;}panel.scrollTop=Math.max(0,target);}
  state.panelKind=kind;
  // On the map, bring the evidence or the activity detail into view below the graph.
  if(state.vmScroll){state.vmScroll=false;root.querySelector?.('.vm .vm-ev,.vm .fx-detail')?.scrollIntoView?.({behavior:'smooth',block:'nearest'});}
  // Jump to an activity in the standard guideline.
  if(state.stdJump){const el=root.querySelector?.('#fx-std-'+state.stdJump),main=root.querySelector?.('.fx-rl-main');if(el&&main&&typeof el.offsetTop==='number')main.scrollTop=el.offsetTop-12;state.stdJump=null;}}
 function cancel(){if(timer!==null)clearTimeout(timer);timer=null;}
 // Alpenridge runs slower so each document, the human check and every matrix cell can be followed.
 const dur=(col,step)=>{const s=startOf(col),slow=col==='alpenridge';return step<s.h1?(slow?1400:900):step===s.h1?(slow?1200:700):step<s.a2?(slow?450:200):850;};
 const toMap=()=>{if(state.col==='alpenridge'&&state.step>=lastStep('alpenridge')){state.view='map';state.mapCol='alpenridge';state.cell=null;}};
 function tick(){timer=null;state.step++;if(state.step>=lastStep(state.col)){state.step=lastStep(state.col);state.playing=false;toMap();}render();if(state.playing)timer=setTimeout(tick,dur(state.col,state.step+1));}
 function btick(){timer=null;state.bt++;if(state.bt>=TOTAL){state.bt=TOTAL;state.building=false;}render();if(state.building)timer=setTimeout(btick,PH[phaseOf(state.bt+1)][2]);}
 function startBuild(){cancel();state.col=null;state.cell=null;state.playing=false;state.alp=false;state.cardSeen=false;state.decided={};state.bt=-1;state.building=true;btick();root.querySelector?.('.fx-scale')?.scrollIntoView?.({behavior:'smooth',block:'start'});}
 function play(col){cancel();state.hoSeen=false;state.col=col;state.cell=null;state.step=col==='custom'?startOf(col).h1-1:-1;state.playing=true;tick();}
 function onClick(e){const b=e.target.closest('button,[data-fx-list]');if(!b||!root.contains(b)||b.dataset.source||b.dataset.view)return;const d=b.dataset;
  if(d.fxDecide!==undefined){const [i,v]=d.fxDecide.split(':');if(v)state.decided[i]=v;else delete state.decided[i];render();return;}
  if(d.fxList!==undefined){state.list=d.fxList||null;state.ev=null;state.listAct=null;render();return;}
  if(d.fxStd){state.list='standard';state.ev=null;state.stdAct=d.fxStd;state.stdJump=d.fxStd;render();return;}
  if(d.fxRulesFor!==undefined){state.list='learned';state.ev=null;state.listAct=d.fxRulesFor||null;state.lastTab=null;render();return;}
  if(d.fxEvopen){state.list='learned';state.listAct=null;state.ev={key:d.fxEvopen,ob:null};state.evReset=true;render();return;}
  if(d.fxEv!==undefined){state.ev=d.fxEv?{key:d.fxEv,ob:d.fxOb||null}:null;state.evReset=true;render();return;}
  if(d.fxAct==='build'){state.view='matrix';startBuild();return;}
  if(d.fxView){if(built()){state.view=d.fxView;state.cell=null;render();}return;}
  if(d.vmCol){state.mapCol=d.vmCol;state.cell=null;state.vmSel=null;render();return;}
  if(d.vmDoc!==undefined){const i=Number(d.vmDoc);state.vmSel=state.vmSel?.type==='doc'&&state.vmSel.i===i?null:{type:'doc',i};state.cell=null;state.vmScroll=true;render();return;}
  if(d.vmPick){state.vmSel=state.vmSel?.type==='attr'&&state.vmSel.id===d.vmPick?null:{type:'attr',id:d.vmPick};state.cell=null;state.vmScroll=true;render();return;}
  if(d.vmClose!==undefined){state.vmSel=null;render();return;}
  // Changing any attribute starts from the current combination and makes it your own mix.
  if(d.vmAttr){const a=ATTR(d.vmAttr),base=JSON.parse(JSON.stringify(cfgFor(state.mapCol))),cur=base[a.id];if(a.multi)base[a.id]=d.vmVal===''?[]:cur.includes(d.vmVal)?cur.filter(x=>x!==d.vmVal):[...cur,d.vmVal];else base[a.id]=d.vmVal;state.custom=base;state.mapCol='custom';state.cell=null;state.vmSel=null;render();return;}
  if(d.fxAct==='bskip'){cancel();state.building=false;state.bt=TOTAL;render();return;}
  if(d.fxAct==='back'){cancel();state.playing=false;state.col=null;render();return;}
  if(d.fxAct==='extract'){if(built()){state.alp=true;state.view='matrix';play('alpenridge');root.querySelector?.('.fx-profile')?.scrollIntoView?.({behavior:'smooth',block:'start'});}return;}
  if(d.fxCol){if(built()){if(d.fxCol==='alpenridge')state.alp=true;play(d.fxCol);}return;}
  if(d.fxAct==='skip'){cancel();state.playing=false;state.step=lastStep(state.col);toMap();render();return;}
  if(d.fxCell!==undefined){if(!built())return;state.cell=d.fxCell&&state.cell!==d.fxCell?d.fxCell:null;state.vmSel=null;state.vmScroll=state.view==='map';render();return;}
  if(d.fwAttr){const a=ATTR(d.fwAttr),cur=state.custom[a.id];if(a.multi)state.custom[a.id]=d.fwVal===''?[]:cur.includes(d.fwVal)?cur.filter(x=>x!==d.fwVal):[...cur,d.fwVal];else state.custom[a.id]=d.fwVal;cancel();state.playing=false;state.col='custom';state.step=lastStep('custom');render();}}
 // Hover an attribute, document or activity to trace its lines.
 function onOver(e){const svg=root.querySelector?.('.vm-svg');if(!svg?.querySelectorAll)return;const n=e.target.closest?.('[data-vm-hl]'),keys=n?n.dataset.vmHl.split(' '):(svg.dataset?.sel||'').split(' ').filter(Boolean);svg.querySelectorAll('.vm-e').forEach(p=>p.classList.toggle('dim',keys.length>0&&!keys.some(k=>p.classList.contains(k))));svg.classList.toggle('tracing',keys.length>0);}
 function onEsc(e){if(e.key!=='Escape')return;if(state.ev){state.ev=null;render();}else if(state.list){state.list=null;render();}}
 render();root.addEventListener('click',onClick);root.addEventListener('mouseover',onOver);document.addEventListener('keydown',onEsc);
 return ()=>{cancel();root.removeEventListener('click',onClick);root.removeEventListener('mouseover',onOver);document.removeEventListener('keydown',onEsc);};
}
window.SA_FRAMEWORK={markup,mount,DOCS,COLS,HISTORY,MINED};
})();
