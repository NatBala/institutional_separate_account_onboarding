/* Shared onboarding model: one framework of common activities, attributes that vary it, the Alpenridge
   task plan with dependencies, and the synthetic book of in-flight onboardings. Dates are business days
   from intake (Mon 14 Sep 2026); public holidays are not modelled. All data is synthetic. */
(function(){
const START=Date.UTC(2026,8,14),AS_OF=18,TARGET=50;// Thu 8 Oct 2026; client target funding Mon 23 Nov 2026
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function toDate(i){const d=new Date(START+(Math.floor(i/5)*7+(i%5))*864e5);return d;}
function fmt(i,withDay=true){const d=toDate(i);return `${withDay?DOW[d.getUTCDay()]+' ':''}${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;}
const STAGES=[
 {id:'intake',name:'Intake',short:'INTAKE',owner:'Onboarding lead',team:'GCS Operations',escalation:'Head of Institutional Onboarding',tol:3},
 {id:'paperwork',name:'Paperwork',short:'PAPERWORK',owner:'Mandate counsel',team:'Legal',escalation:'Head of Legal, Institutional',tol:3},
 {id:'setup',name:'Operational setup',short:'OPS SETUP',owner:'Onboarding lead',team:'GCS Operations',escalation:'Head of Investment Operations',tol:3},
 {id:'funding',name:'Funding',short:'FUNDING',owner:'Transition lead',team:'Operations & Transition',escalation:'Head of Investment Operations + Client RM',tol:0},
 {id:'post',name:'Post-funding',short:'POST FUNDING',owner:'Client RM',team:'Client Service',escalation:'Head of Client Service',tol:Infinity}
];
const TEAMS={gcs:'GCS Operations',rm:'Client RM',legal:'Legal',fipc:'FI Portfolio Control',rep:'Client Reporting',ops:'Operations & Transition',pm:'Portfolio management',aml:'AML/KYC Compliance',bill:'Billing'};

/* ---------- 1 · Common framework with configurable attributes ---------- */
const ACTIVITIES=[
 {id:'aml',name:'AML/KYC',stage:0,team:'aml',ext:'Client authorised signatory',base:'Verify the client entity, authorised signatories and sanctions screening before the account is opened.'},
 {id:'ubo',name:'Beneficial owner review',stage:0,team:'aml',ext:'Client controlling persons',base:'Identify and verify controlling persons, scoped to the entity type under firm policy.'},
 {id:'service',name:'Service model setup',stage:0,team:'rm',ext:'Client servicing contact',base:'Agree who services the account, through which channel, and who may give instructions.'},
 {id:'contract',name:'Contract review',stage:1,team:'legal',ext:'Client legal counsel',base:'Review, negotiate and execute the governing agreement and its schedules.'},
 {id:'guidelines',name:'Investment guidelines',stage:1,team:'fipc',ext:'Client investment team',base:'Translate approved guidelines into coded, tested compliance rules.'},
 {id:'billing',name:'Billing setup',stage:1,team:'bill',ext:'Client finance',base:'Agree the fee schedule and set up invoicing in the billing system.'},
 {id:'account',name:'Account & system setup',stage:2,team:'gcs',ext:'Custodian',base:'Open custody and trading accounts; create system records (Appian → Salesforce).'},
 {id:'reporting',name:'Reporting setup',stage:2,team:'rep',ext:'Client reporting contact',base:'Configure the agreed reporting package and validate the data feed.'},
 {id:'funding',name:'Funding setup',stage:3,team:'ops',ext:'Client / custodian',base:'Confirm funding instructions, receive assets and start trading.'},
 {id:'servicing',name:'Ongoing servicing',stage:4,team:'rm',ext:'Client servicing contact',base:'Reporting cycles, service and cash-flow requests, periodic AML/KYC refresh, reviews.'}
];
// Standard onboarding guideline: the base playbook every client starts from, before any rule adjusts, replaces or adds to it.
const STANDARD={
 aml:{days:'5–10',steps:['Collect constitutional documents and the authorised signatory list.','Screen the entity, its directors and signatories against sanctions and PEP lists.','Risk-rate the client under the firm’s AML policy.','Record the outcome and the approval in the KYC system.'],docs:['Certificate of incorporation, trust deed or foundation charter','Authorised signatory list with specimen signatures','Regulatory status or licence evidence','Tax forms (W-8 / W-9 or local equivalent)'],controls:['The AML Officer approves every high-risk rating.','No account is opened before KYC sign-off.'],done:'KYC approved and recorded; account opening released.'},
 ubo:{days:'3–5',steps:['Map the ownership and control structure.','Identify controlling persons above the policy threshold (25% or control).','Verify the identity of each controlling person.','Screen every controlling person.'],docs:['Ownership and control chart','Identity documents for controlling persons','Board or trustee list'],controls:['Scope follows the entity type under firm policy.','Re-run on any change of control.'],done:'All controlling persons verified and recorded.'},
 service:{days:'2–3',steps:['Confirm who gives us instructions and who receives information.','Name the Client RM and the client’s day-to-day servicing contact.','Agree the communication channels and the service calendar.','Record the servicing model in the CRM.'],docs:['Authorised instructions list','Client contact sheet'],controls:['Only listed persons may give instructions.'],done:'Servicing model agreed and recorded.'},
 contract:{days:'10–20',steps:['Issue the firm’s standard agreement template for the vehicle.','Negotiate the terms and the investment guideline schedule.','Legal approves every deviation from the template.','Execute the agreement and file the signed copy.'],docs:['Governing agreement with guideline schedule and service annex','Board resolution or other authority to sign'],controls:['Deviations from the template need Legal approval.','Signing authority is checked against the signatory list.'],done:'Agreement executed by both parties.'},
 guidelines:{days:'5–10',steps:['Extract every restriction from the signed guideline schedule.','Translate each one into a coded compliance rule.','Test the rules against the model portfolio, including boundary cases.','FI Portfolio Control signs off before trading starts.'],docs:['Signed guideline schedule','Client investment policy'],controls:['Four-eyes review of every coded rule.','Boundary-test results kept as evidence.'],done:'Rules live in the compliance system and signed off.'},
 billing:{days:'3–5',steps:['Apply the standard fee schedule for the vehicle.','Set up the billing account and the invoice calendar.','Confirm the invoice recipient and payment details.','Run a test invoice.'],docs:['Fee schedule','Invoice contact details'],controls:['A non-standard fee needs commercial approval.'],done:'Billing account active with the fee schedule coded.'},
 account:{days:'5–10',steps:['Open custody and trading accounts with the custodian.','Create the account records (Appian → Salesforce).','Set the account up in the trading and accounting systems.','Confirm standing settlement instructions.'],docs:['Custody account agreement','Standing settlement instructions'],controls:['Settlement instructions verified by call-back.','System records reconciled across platforms.'],done:'Accounts open and reconciled across systems.'},
 reporting:{days:'5–10',steps:['Configure the standard reporting package: holdings, performance and transactions.','Validate the custodian data feed.','Produce and reconcile a sample report.','Set the distribution list and the reporting calendar.'],docs:['Reporting requirements form','Sample report'],controls:['The sample is reconciled before go-live.','The client approves the distribution list.'],done:'First report produced and reconciled.'},
 funding:{days:'2–5',steps:['Agree the funding date and the assets to be received.','Issue funding instructions to the client and the custodian.','Confirm receipt and reconcile the opening position.','Release the account for trading.'],docs:['Funding instructions','Opening position statement'],controls:['Trading starts only after the opening position reconciles.','Any change to the funding date goes to the Client RM and Investment Operations.'],done:'Assets received and reconciled; trading started.'},
 servicing:{days:'Ongoing',steps:['Run the agreed reporting cycles.','Handle service and cash-flow requests.','Refresh AML/KYC on the cycle set by the risk rating.','Hold regular reviews with the client.'],docs:['Service calendar','Review packs'],controls:['Periodic KYC refresh by risk rating.','Errors and complaints are logged.'],done:'Ongoing; not counted in the onboarding duration.'}
};
const ATTRS=[
 {id:'vehicle',name:'Vehicle',options:[['sa','Separate account'],['cit','CIT'],['mf','Mutual fund']]},
 {id:'relationship',name:'Client type',options:[['direct','Direct'],['consultant','Consultant-advised'],['ocio','OCIO'],['subadv','Sub-advisory'],['omnibus','Omnibus'],['mep','MEP / PEP']]},
 {id:'funding',name:'Funding method',options:[['cash','Cash'],['inkind','Assets in kind'],['mixed','Mixed']]},
 {id:'tm',name:'Transition manager',options:[['no','Not required'],['yes','Required']]},
 {id:'reporting',name:'Reporting requirements',options:[['standard','Standard'],['custom','Custom']]},
 {id:'restrictions',name:'Investment restrictions',multi:true,options:[['tobacco','Tobacco'],['esg','ESG / coal'],['derivs','Derivatives']]},
 {id:'billing',name:'Billing structure',options:[['standard','Standard'],['negotiated','Negotiated']]}
];
const has=(c,k,v)=>Array.isArray(c[k])?c[k].includes(v):c[k]===v;
// [attribute, value, activity, effect, text, effort]  effect: adjusted | added | replaced | conflict
const RULES=[
 ['vehicle','sa','contract','replaced','Investment management agreement (IMA) with a client-specific guideline schedule and service annex.',1],
 ['vehicle','sa','guidelines','adjusted','Client-specific guidelines are coded on this account only.',1],
 ['vehicle','cit','contract','replaced','Participation agreement and adoption of the trust declaration; confirm the plan is eligible to invest in a collective trust.',1],
 ['vehicle','cit','guidelines','replaced','Pooled-fund guidelines apply to every participant; no account-level restrictions.',0],
 ['vehicle','cit','account','adjusted','Plan set up with the CIT trustee and the plan recordkeeper.',1],
 ['vehicle','cit','billing','replaced','Select the fee class; fees collected through the trust or by direct invoice.',0],
 ['vehicle','cit','reporting','adjusted','Trust-level reporting plus recordkeeper data feeds.',1],
 ['vehicle','mf','contract','replaced','Fund account application; the prospectus governs. No IMA to negotiate.',0],
 ['vehicle','mf','guidelines','replaced','Prospectus limits apply; no client-specific guidelines.',0],
 ['vehicle','mf','account','adjusted','Transfer-agent account set-up.',0],
 ['vehicle','mf','billing','replaced','Fees are in the share-class expense ratio; no separate invoice.',0],
 ['vehicle','mf','reporting','replaced','Standard fund statements and fact sheets.',0],
 ['relationship','direct','service','adjusted','RM services the client directly; the client is the instructing party.',0],
 ['relationship','consultant','service','adjusted','Consultant receives report copies and joins reviews; the client remains the instructing party.',1],
 ['relationship','consultant','reporting','added','Distribution list and data feed for the investment consultant.',1],
 ['relationship','ocio','service','replaced','OCIO is the day-to-day instructing party under delegated discretion; servicing runs through the OCIO.',1],
 ['relationship','ocio','contract','adjusted','Confirm the OCIO’s signatory authority for the plan; the plan sponsor may also sign.',1],
 ['relationship','ocio','aml','adjusted','Verify the OCIO’s authority evidence as well as the underlying plan.',1],
 ['relationship','ocio','reporting','adjusted','Report in the OCIO’s aggregation format and calendar.',1],
 ['relationship','subadv','contract','replaced','Sub-advisory agreement with the primary adviser, not the end client.',1],
 ['relationship','subadv','aml','replaced','AML/KYC relationship is with the primary adviser; end-client reliance per firm policy.',0],
 ['relationship','subadv','ubo','adjusted','Beneficial-owner review covers the adviser entity.',0],
 ['relationship','subadv','billing','adjusted','Fee paid by the primary adviser under the sub-advisory agreement.',0],
 ['relationship','subadv','service','replaced','Primary adviser owns end-client servicing; we service the adviser.',0],
 ['relationship','omnibus','aml','replaced','Intermediary performs underlying-investor KYC; complete intermediary due diligence and reliance.',2],
 ['relationship','omnibus','ubo','adjusted','Review at intermediary level; underlying investors are not visible to us.',1],
 ['relationship','omnibus','account','adjusted','Omnibus account with sub-accounting kept by the intermediary.',1],
 ['relationship','omnibus','service','replaced','Intermediary services the underlying investors; we service the intermediary.',1],
 ['relationship','omnibus','servicing','adjusted','Cash flows arrive as net trades from the intermediary; reconcile sub-accounting.',1],
 ['relationship','mep','contract','adjusted','Adoption agreement for each participating employer; the pooled plan provider signs the plan documents.',2],
 ['relationship','mep','aml','adjusted','Pooled plan provider is the customer; employer-level checks per firm policy.',1],
 ['relationship','mep','service','replaced','Pooled plan provider and recordkeeper are the servicing intermediaries.',1],
 ['relationship','mep','servicing','added','Repeatable employer join and exit process.',2],
 ['funding','cash','funding','adjusted','Cash wire instructions; confirm settlement account and timing.',0],
 ['funding','inkind','funding','added','Screen the transfer list, reconcile the custody transfer file and agree dispositions for ineligible holdings.',2],
 ['funding','inkind','guidelines','added','Screen in-kind holdings against the restrictions before transfer.',1],
 ['funding','mixed','funding','added','Two routes: cash instructions plus transfer-list screening and custody-file reconciliation.',2],
 ['funding','mixed','guidelines','added','Screen the in-kind portion against the restrictions before transfer.',1],
 ['tm','yes','funding','added','Appoint the transition manager: pre-trade analysis, T-day plan and post-trade report.',2],
 ['tm','yes','contract','added','Client signs a transition management agreement with the TM.',1],
 ['reporting','standard','reporting','adjusted','Standard reporting package; no SLA negotiation.',0],
 ['reporting','custom','reporting','added','Bespoke feasibility assessment and sample validation before any commitment.',2],
 ['reporting','custom','contract','added','Service annex records the custom SLA.',1],
 ['restrictions','tobacco','guidelines','added','Tobacco threshold: confirm the operator (> vs ≥), parent aggregation and data provider.',2],
 ['restrictions','esg','guidelines','added','ESG / coal definition, data provider, freshness and missing-data rule.',2],
 ['restrictions','derivs','contract','added','ISDA / CSA documentation with counterparties.',2],
 ['restrictions','derivs','account','added','Broker / FCM, collateral and margin operations.',2],
 ['restrictions','derivs','guidelines','added','Permitted-instrument and exposure rules for derivatives.',1],
 ['billing','standard','billing','adjusted','Standard fee schedule.',0],
 ['billing','negotiated','billing','added','Negotiated fee schedule approved and coded; manual invoice check for the first cycles.',1],
 ['billing','negotiated','contract','added','Fee schedule annex.',0]
];
const EFFORT=['Light','Moderate','Heavy'];
const CONTACTS={
 direct:{service:'Client RM',channel:'Direct',intermediary:'None',instructing:'Client'},
 consultant:{service:'Client RM',channel:'Direct, consultant copied',intermediary:'Investment consultant',instructing:'Client'},
 ocio:{service:'Client RM (OCIO coverage)',channel:'Through the OCIO',intermediary:'OCIO provider',instructing:'OCIO under delegated discretion'},
 subadv:{service:'Sub-advisory relationship manager',channel:'Through the primary adviser',intermediary:'Primary adviser',instructing:'Primary adviser'},
 omnibus:{service:'Intermediary relationship manager',channel:'Through the intermediary platform',intermediary:'Omnibus intermediary',instructing:'Intermediary'},
 mep:{service:'Retirement plan relationship manager',channel:'Through the pooled plan provider',intermediary:'Pooled plan provider + recordkeeper',instructing:'Pooled plan provider'}
};
function configure(cfg){
 const acts=ACTIVITIES.map(a=>({...a,changes:[],effort:0}));
 for(const [attr,val,act,effect,text,effort] of RULES)if(has(cfg,attr,val)){const a=acts.find(x=>x.id===act);a.changes.push({attr,val,effect,text,effort,by:ATTRS.find(x=>x.id===attr).name+': '+ATTRS.find(x=>x.id===attr).options.find(o=>o[0]===val)[1]});a.effort=Math.max(a.effort,effort);}
 const conflicts=[];
 if(cfg.vehicle!=='sa'&&cfg.restrictions.length)conflicts.push(`Client-specific restrictions (${cfg.restrictions.map(r=>ATTRS[5].options.find(o=>o[0]===r)[1]).join(', ')}) cannot be applied inside a pooled ${cfg.vehicle==='cit'?'CIT':'mutual fund'}. Route to a separate account, or confirm the pooled guidelines already meet them.`);
 if(cfg.vehicle!=='sa'&&cfg.reporting==='custom')conflicts.push('Custom reporting on a pooled vehicle needs a separate service agreement; the vehicle reports at fund or trust level.');
 if(cfg.tm==='yes'&&cfg.funding==='cash')conflicts.push('A transition manager is usually appointed to move legacy securities. Check whether one is needed for an all-cash funding.');
 if(cfg.vehicle==='mf'&&cfg.billing==='negotiated')conflicts.push('Mutual fund fees are set by share class. A negotiated fee needs a different vehicle or share class.');
 const touched=acts.filter(a=>a.changes.some(c=>c.effect!=='adjusted'||c.effort>0)).length;
 return {acts,conflicts,touched,servicing:CONTACTS[cfg.relationship]};
}
const PROFILES=[
 {id:'alpenridge',label:'Alpenridge · current plan',note:'Swiss pension foundation, consultant-advised, all-cash after N08, negotiated fee.',cfg:{vehicle:'sa',relationship:'consultant',funding:'cash',tm:'no',reporting:'standard',restrictions:['tobacco','esg','derivs'],billing:'negotiated'}},
 {id:'alpenridge0',label:'Alpenridge · initial request',note:'As first requested on 14 Sep: mixed funding and custom Monday reporting.',cfg:{vehicle:'sa',relationship:'consultant',funding:'mixed',tm:'no',reporting:'custom',restrictions:['tobacco','esg','derivs'],billing:'negotiated'}},
 {id:'cit',label:'401(k) plan into a CIT',note:'Plan sponsor advised by a consultant, cash via recordkeeper.',cfg:{vehicle:'cit',relationship:'consultant',funding:'cash',tm:'no',reporting:'standard',restrictions:[],billing:'standard'}},
 {id:'ocio',label:'OCIO-managed endowment',note:'OCIO moves legacy assets with a transition manager.',cfg:{vehicle:'sa',relationship:'ocio',funding:'inkind',tm:'yes',reporting:'custom',restrictions:['esg'],billing:'negotiated'}},
 {id:'subadv',label:'Sub-advisory mandate',note:'We manage a sleeve for another adviser’s fund.',cfg:{vehicle:'sa',relationship:'subadv',funding:'cash',tm:'no',reporting:'custom',restrictions:['derivs'],billing:'negotiated'}},
 {id:'omnibus',label:'Mutual fund omnibus',note:'Platform intermediary buys fund shares for its clients.',cfg:{vehicle:'mf',relationship:'omnibus',funding:'cash',tm:'no',reporting:'standard',restrictions:[],billing:'standard'}},
 {id:'mep',label:'Pooled employer plan (PEP)',note:'Pooled plan provider adopts a CIT for many employers.',cfg:{vehicle:'cit',relationship:'mep',funding:'cash',tm:'no',reporting:'standard',restrictions:[],billing:'standard'}}
];

/* ---------- 2 · Alpenridge task plan (status as of Thu 8 Oct 2026, all evidence through N08) ---------- */
// dur: planned business days; done: actual finish day; rem: remaining days if started; kind picks the escalation path.
const T=(id,stage,title,team,ext,deps,dur,o={})=>({id,stage,title,team,ext,deps,dur,...o});
const TASKS=[
 T('I1',0,'Confirm client context (checkpoint H1)','gcs','—',[],1,{done:1,kind:'ops',refs:['N01§4']}),
 T('I2',0,'Agree reporting scope: Tuesday holdings, monthly analytics','rep','Elena Weber, client investment office',['I1'],2,{done:1,kind:'reporting',refs:['N07§1']}),
 T('I3',0,'Decide funding route: all cash, derivatives reviewed at day 30','pm','Elena Weber, client investment office',['I1'],3,{done:2,kind:'funding',gate:true,refs:['N08§1']}),
 T('I4',0,'AML/KYC and beneficial-owner review','aml','Foundation board secretary',['I1'],8,{done:8,kind:'compliance'}),
 T('I5',0,'Restriction interpretation workshop: tobacco operator, thermal coal','legal','Elena Weber, client investment office',['I1'],6,{done:7,kind:'client',refs:['N02§1','N03§1']}),
 T('I6',0,'Swiss applicability determination','legal','—',['I1'],9,{done:12,kind:'contract',refs:['O05§2']}),
 T('I7',0,'Confirm servicing model: RM direct, consultant copied','rm','Investment consultant',['I1'],8,{done:9,kind:'ops',refs:['N01§2']}),
 T('P1',1,'Client confirms tobacco and coal intent in writing','rm','Elena Weber, client investment office',['I5'],9,{rem:1,kind:'client',gate:true,reviews:['Legal review','FI Portfolio Control review','Client clarification'],issue:'Tobacco and coal restriction unclear',refs:['N02§1','N02§2','N03§1']}),
 T('P2',1,'Finalise IMA Schedule A investment guidelines','legal','Client legal counsel',['P1'],3,{kind:'contract',refs:['N02§4']}),
 T('P3',1,'Amend service annex to the agreed reporting scope','legal','Client legal counsel',['I2'],13,{done:16,kind:'contract',refs:['N07§1','N07§2']}),
 T('P4',1,'Agree negotiated fee schedule','bill','Client finance',['I1'],18,{rem:1,kind:'billing'}),
 T('P5',1,'Staged derivatives amendment (activation after day-30 review)','legal','Client legal counsel',['I3'],15,{rem:1,kind:'contract',refs:['N08§1','O04§2']}),
 T('P6',1,'IMA executed: trustee approval and signatures','legal','Client legal counsel + trustees',['P2','P3','P4','P5','I6'],10,{kind:'contract',gate:true,milestone:'Contract signed'}),
 T('O1',2,'Open custody account and market access','ops','Orion Custody service team',['P6'],10,{kind:'ops',milestone:'Funding setup',refs:['N06§2']}),
 T('O2',2,'Reconcile account-specific sample feed','rep','Orion Custody service team',['I2'],14,{done:17,kind:'reporting',refs:['N06§2','N07§2']}),
 T('O3',2,'Code guideline rules; boundary and missing-data tests','fipc','—',['P2'],4,{kind:'ops',refs:['O03§3']}),
 T('O4',2,'Create system records (Appian → Salesforce)','gcs','—',['I4'],6,{rem:3,kind:'ops',issue:'System records behind plan',reviews:['GCS Operations'],refs:['N05§2']}),
 T('O5',2,'Set up billing in the billing system','bill','—',['P4'],3,{kind:'billing'}),
 T('O6',2,'Configure Tuesday holdings and monthly pack','rep','—',['P3','O2'],6,{rem:5,kind:'reporting',refs:['O01§1']}),
 T('O7',2,'Pre-funding readiness test: cash, trade and compliance','ops','—',['O1','O3','O4','O5','O6'],5,{kind:'ops'}),
 T('F1',3,'Go-live scope sign-off: bonds only, derivatives later','pm','Elena Weber, client investment office',['O7'],2,{kind:'funding',gate:true,refs:['N08§2']}),
 T('F2',3,'Confirm USD 250m cash funding instructions','ops','Client finance + outgoing manager',['F1'],3,{kind:'funding',refs:['N08§1']}),
 T('F3',3,'Account funded: cash received','ops','Orion Custody service team',['F2'],1,{kind:'funding',milestone:'Asset transfer',notBefore:TARGET}),
 T('S1',4,'Initial portfolio construction and trading','pm','—',['F3'],3,{kind:'ops',milestone:'Trading'}),
 T('S2',4,'First Tuesday holdings report','rep','Client investment office; consultant copied',['S1'],2,{kind:'reporting',milestone:'Reporting'}),
 T('S3',4,'Cash-flow request process live (benefit payments)','ops','Client finance',['F3'],5,{kind:'funding'}),
 T('S4',4,'First monthly pack (5th business day)','rep','Client investment office; consultant copied',['S1'],10,{kind:'reporting'}),
 T('S5',4,'Derivatives activation review (day 30)','pm','Elena Weber, client investment office',['F3'],22,{kind:'contract',gate:true,refs:['N08§1']}),
 T('S6',4,'Schedule periodic AML/KYC refresh','aml','Foundation board secretary',['F3'],3,{kind:'compliance'}),
 T('S7',4,'First quarterly review with trustees and consultant','rm','Trustees + investment consultant',['S4'],40,{kind:'ops'})
];
const FUNDED='F3';
function schedule(tasks=TASKS,opt={}){
 const asOf=opt.asOf??AS_OF,extra=opt.extra||{},override=opt.override||{};
 const by=Object.fromEntries(tasks.map(t=>[t.id,t])),bs={},bf={},ff={};
 const B=id=>{if(bf[id]!=null)return bf[id];const t=by[id];bs[id]=Math.max(0,...t.deps.map(B));return bf[id]=Math.max(bs[id]+t.dur,t.notBefore??0);};
 const F=id=>{if(ff[id]!=null)return ff[id];const t=by[id];B(id);if(override[id]!=null)return ff[id]=override[id];
  if(t.done!=null)return ff[id]=t.done;
  const dep=Math.max(0,...t.deps.map(F));
  if(t.rem!=null)return ff[id]=Math.max(asOf+t.rem+(extra[id]||0),dep);
  const now=t.deps.every(d=>by[d].done!=null&&override[d]==null)?asOf:0;// work that waits on an open task starts when that task ends
  return ff[id]=Math.max(Math.max(now,dep,bs[id])+t.dur+(extra[id]||0),t.notBefore??0);};
 tasks.forEach(t=>F(t.id));
 const rows=tasks.map(t=>{const due=bf[t.id],f=ff[t.id],done=t.done!=null,started=done||t.rem!=null,overdue=!done&&due<asOf?asOf-due:0,slip=f-due;
  const openDeps=t.deps.filter(d=>by[d].done==null);
  let status=done?'done':started?(overdue?'overdue':slip>0?'late':'progress'):openDeps.length?'waiting':'ready';
  return {...t,due,forecast:f,baseStart:bs[t.id],done,started,overdue,slip,openDeps,status};});
 const map=Object.fromEntries(rows.map(r=>[r.id,r]));
 // Own delay: slip a task adds beyond what it inherits. A task is blocked when a direct prerequisite is itself running late.
 for(const r of rows){const inherited=Math.max(0,...r.deps.map(d=>map[d].slip));r.own=r.done?0:Math.max(0,r.slip-inherited);}
 for(const r of rows)if(r.status==='waiting'&&r.openDeps.some(d=>['overdue','late'].includes(map[d].status)))r.status='blocked';
 // Downstream reach of each task
 const kids={};for(const t of tasks)for(const d of t.deps)(kids[d]??=[]).push(t.id);
 const reach=id=>{const out=new Set(),go=x=>(kids[x]||[]).forEach(k=>{if(!out.has(k)){out.add(k);go(k);}});go(id);return [...out];};
 const funded=map[FUNDED].forecast;
 const stages=STAGES.map((s,i)=>{const ts=rows.filter(r=>r.stage===i),bEnd=Math.max(...ts.map(r=>r.due)),fEnd=Math.max(...ts.map(r=>r.forecast)),slip=fEnd-bEnd,complete=ts.every(r=>r.done),started=ts.some(r=>r.started),overdue=ts.filter(r=>r.status==='overdue').length,blocked=ts.filter(r=>r.status==='blocked').length,late=ts.filter(r=>r.status==='late').length,open=ts.filter(r=>!r.done).length;
  let rag,why;
  if(complete){rag='green';why='All tasks complete';}
  else if(slip>s.tol){rag='red';why=i===3?`Funding moves ${slip} business day${slip>1?'s':''} past the client target`:`Stage end moves ${slip} business days`;}
  else if(i===4&&!started){rag='grey';why=slip>0?`Starts after funding · shifts ${slip} days with it`:'Starts after funding';}
  else if(slip>0||overdue||blocked||late){rag='amber';why=[overdue&&`${overdue} overdue`,blocked&&`${blocked} blocked`,slip>0&&`stage end +${slip}d`].filter(Boolean).join(' · ');}
  else if(!started){rag='grey';why='Not started · on plan';}
  else{rag='green';why='On plan';}
  return {...s,index:i,tasks:ts,bEnd,fEnd,slip,complete,started,open,overdue,blocked,late,rag,why,progress:complete?'Complete':started?'In progress':'Not started',done:ts.filter(r=>r.done).length};});
 return {rows,map,stages,funded,target:TARGET,slip:funded-TARGET,reach,asOf};
}
// Days the funding date would recover if one task's own slip were removed.
function impact(id,opt={}){const s=schedule(TASKS,opt),t=s.map[id];if(t.done||t.own<=0)return 0;const s2=schedule(TASKS,{...opt,override:{...(opt.override||{}),[id]:t.forecast-t.own}});return s.funded-s2.funded;}
function criticalChain(s){const chain=[],by=s.map;let cur=by['S2'];while(cur){chain.unshift(cur);const deps=cur.deps.map(d=>by[d]);if(!deps.length)break;cur=deps.sort((a,b)=>b.forecast-a.forecast||b.due-a.due)[0];}return chain;}

/* ---------- 3 · Who is involved ---------- */
const PLAYERS=[
 {area:'Relationship & communication',internal:'Maya Shah, Client RM',team:'rm',ext:'Elena Weber, client investment office',escalation:'Head of Institutional Relationships',tasks:['I7','P1'],refs:['N01§1','N07§1']},
 {area:'Contracting',internal:'Mandate counsel',team:'legal',ext:'Client legal counsel',escalation:'Head of Legal, Institutional',tasks:['P2','P3','P5','P6'],refs:['N02§4','N07§2']},
 {area:'Investment restrictions',internal:'FI Portfolio Control',team:'fipc',ext:'Client investment office; trustees approve policy',escalation:'Head of FI Portfolio Control',tasks:['I5','P1','O3'],refs:['N05§2','N03§3']},
 {area:'AML/KYC & beneficial owners',internal:'AML/KYC Compliance analyst',team:'aml',ext:'Foundation board secretary',escalation:'AML Officer',tasks:['I4','S6']},
 {area:'Billing',internal:'Billing team',team:'bill',ext:'Client finance',escalation:'Head of Billing Operations',tasks:['P4','O5']},
 {area:'Reporting',internal:'Client Reporting',team:'rep',ext:'Client investment office; consultant copied',escalation:'Head of Client Reporting',tasks:['O2','O6','S2','S4'],refs:['N06§2','O01§1']},
 {area:'Account & custody setup',internal:'GCS Operations onboarding lead',team:'gcs',ext:'Orion Custody service team',escalation:'Head of Institutional Onboarding',tasks:['O1','O4','O7'],refs:['N06§1']},
 {area:'Funding',internal:'Transition lead, Operations',team:'ops',ext:'Client finance; outgoing manager',escalation:'Head of Investment Operations',tasks:['F1','F2','F3'],refs:['N08§1']},
 {area:'Ongoing servicing',internal:'Maya Shah, Client RM',team:'rm',ext:'Investment consultant (copied); trustees',escalation:'Head of Client Service',tasks:['S3','S7'],refs:['N01§2']}
];
/* ---------- 4 · Escalation and communication paths ---------- */
// Each step: [who, trigger]. Triggers: flag = as soon as a slip is forecast; od:n = n business days overdue; date = the funding date moves.
const PATHS={
 client:[['Task owner flags the item','flag'],['Onboarding lead, GCS Operations','od:1'],['Client RM chases the client contact','od:2'],['Head of Institutional Onboarding','date'],['Client informed of the date impact','od:3']],
 contract:[['Legal flags the item','flag'],['Onboarding lead, GCS Operations','od:1'],['Client RM','od:2'],['Client legal counsel contacted','od:3'],['Head of Legal + Head of Onboarding','date']],
 funding:[['Operations notified','flag'],['Client RM notified','od:1'],['Client informed','od:2'],['Portfolio management: trading start moves','date'],['Head of Investment Operations','date']],
 ops:[['Team lead flags the item','flag'],['Onboarding lead, GCS Operations','od:2'],['Head of Investment Operations','date']],
 reporting:[['Client Reporting flags the item','flag'],['Client RM','od:1'],['Client and consultant informed','od:3'],['Head of Client Reporting','date']],
 compliance:[['AML/KYC analyst flags the item','flag'],['Onboarding lead (status only, no detail)','od:1'],['Client RM requests documents','od:2'],['AML Officer','od:5']],
 billing:[['Billing flags the item','flag'],['Client RM','od:2'],['Client finance contacted','od:3'],['Head of Billing Operations','date']]
};
function escalation(row,s,opt={}){const path=PATHS[row.kind]||PATHS.ops,moves=s.slip>0&&(row.id===FUNDED||s.reach(row.id).includes(FUNDED))&&impact(row.id,opt)>0;
 return path.map(([who,trig])=>{let hit=false,when='';if(trig==='flag'){hit=row.slip>0||row.overdue>0;when='When a slip is forecast';}else if(trig==='date'){hit=moves;when='If the funding date moves';}else{const n=Number(trig.split(':')[1]);hit=row.overdue>=n;when=`${n} business day${n>1?'s':''} overdue${row.overdue<n&&row.due+n>=s.asOf?' · '+fmt(row.due+n):''}`;}return {who,when,hit};});}

/* Next actions from where Alpenridge stands today. The agents draft each one; a person approves and sends it.
   req names the client-requirements row the action moves forward. */
function actions(){const s=schedule(),day=fmt(s.funded),target=fmt(s.target);return [
 {id:'tobacco',req:'Tobacco exclusion',stands:'Waiting for written confirmation of the threshold (P1)',flag:'2 days overdue',action:'Ask the client to confirm the tobacco threshold in writing',to:'Elena Weber, client investment office',draft:'Please confirm the tobacco exclusion applies at 5% or more of revenue, as in your investment policy, so we can align the IMA wording.',refs:['N03§1','N02§1']},
 {id:'coal',req:'Thermal coal',stands:'Definition options agreed; written choice outstanding (P1)',flag:'2 days overdue',action:'Send the coal definition options for a written choice',to:'Elena Weber; trustees approve',draft:'Attached are the two thermal-coal definitions discussed on 23 Sep (activity and revenue threshold). Please confirm which one the trustees adopt.',refs:['N02§2']},
 {id:'date',req:'Funding',stands:`Funding forecast ${day}, ${s.funded-s.target} business days after the client target (${target})`,flag:`+${s.funded-s.target} days`,action:'Tell the client the funding-date impact',to:'Elena Weber; consultant copied',draft:`With both confirmations by Mon 12 Oct we can hold funding at ${day}. Each further day of delay moves funding by one business day.`,refs:['N01§1']},
 {id:'schedA',req:'Issuer limit',stands:'5% issuer limit drafted in Schedule A',flag:'Drafted',action:'Send the Schedule A draft for client review',to:'Client legal counsel',draft:'Schedule A now includes the 5% single corporate-issuer limit, with sovereigns exempt. Please review before IMA signing.',refs:['N03§2']},
 {id:'derivs',req:'Derivatives',stands:'Staged amendment in drafting (P5)',flag:'In drafting',action:'Share the staged derivatives amendment',to:'Client legal counsel',draft:'Bond-only at inception; FX forwards and rate futures activate only after the day-30 review. Draft amendment attached.',refs:['N08§1']}];}

/* ---------- 5 · Book of in-flight onboardings (leadership view) ---------- */
// stage index, RAG, target day (business days from 14 Sep), slip days, top risk area, waiting on team
const BOOK=[
 ['Harrow County Retirement System','cit','consultant',2,'green',38,0,'Reporting','rep',310],
 ['Lindqvist Family Office','sa','direct',1,'amber',44,2,'Contracts','legal',85],
 ['Corbel Health 401(k) Plan','cit','consultant',3,'green',26,0,'Funding','ops',540],
 ['Northfold Advisors sub-advisory sleeve','sa','subadv',1,'red',30,6,'Contracts','legal',400],
 ['Pinecrest University Endowment','sa','ocio',2,'amber',52,3,'Funding','ops',260],
 ['Meridian Wealth Platform','mf','omnibus',0,'amber',40,2,'AML/KYC','aml',150],
 ['TrueNorth Pooled Employer Plan','cit','mep',1,'red',36,5,'Contracts','legal',95],
 ['Glenmore Teachers’ Fund','sa','consultant',2,'red',34,4,'Investment restrictions','fipc',620],
 ['Bayview Hospital Foundation','sa','direct',4,'green',8,0,'Reporting','rep',120],
 ['Atlas Brokerage Omnibus','mf','omnibus',3,'green',22,0,'Funding','ops',210],
 ['Kestrel Insurance General Account','sa','ocio',0,'green',58,0,'Investment restrictions','fipc',700],
 ['Riverside Municipal 457(b)','cit','consultant',2,'amber',45,1,'Billing','bill',75],
 ['Solent Charitable Trust','sa','consultant',4,'green',12,0,'Reporting','rep',60]
].map(([name,vehicle,relationship,stage,rag,target,slip,risk,waiting,aum])=>({name,vehicle,relationship,stage,rag,target,slip,risk,waiting,aum}));
function book(){const s=schedule(),stage=s.stages.findIndex(x=>!x.complete),worst=s.stages.find(x=>x.rag==='red')?'red':s.stages.some(x=>x.rag==='amber')?'amber':'green';
 return [{name:'Alpenridge Pension Foundation',vehicle:'sa',relationship:'consultant',stage,rag:worst,target:TARGET,slip:s.slip,risk:'Investment restrictions',waiting:'rm',aum:250,live:true},...BOOK];}

window.SA_ONBOARD={actions,STANDARD,START,AS_OF,TARGET,fmt,STAGES,TEAMS,ACTIVITIES,ATTRS,RULES,EFFORT,PROFILES,configure,TASKS,FUNDED,schedule,impact,criticalChain,PLAYERS,PATHS,escalation,book};
})();
