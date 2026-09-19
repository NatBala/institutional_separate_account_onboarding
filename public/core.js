(function(root){
'use strict';
const roles=['GCS Operations','Legal','FI PC','Client Reporting','Transition / PM','Operations Checker'];
const required={initiate:'GCS Operations',legal:'Legal',rules:'FI PC',reporting:'Client Reporting',transition:'Transition / PM',scope:'GCS Operations',release:'Operations Checker'};
function fresh(){return {schema:1,revision:1,view:'overview',role:roles[0],events:{governance:false,clarification:false,service:false,change:false,final:false},screen:false,plan:'original',decisions:{},audit:[],released:false,funded:false};}
function signature(s,k){const e=s.events;return ({initiate:'governance:'+e.governance,legal:'clarification:'+e.clarification+';plan:'+s.plan,rules:'clarification:'+e.clarification+';plan:'+s.plan,reporting:'service:'+e.service,transition:'service:'+e.service+';plan:'+s.plan,scope:'plan:'+s.plan+';final:'+e.final,release:'revision:'+s.revision})[k];}
function approved(s,k){const d=s.decisions[k];return !!d&&d.status==='approved'&&d.signature===signature(s,k);}
function reasons(s,k){const e=s.events,r=[];if(s.released)return ['Funding release is already recorded; reset to rehearse again.'];if(k==='initiate'){if(!e.governance)r.push('Import D10: final IOR and CORG-condition closure.');return r;}
 if(!approved(s,'initiate'))r.push('GCS Operations must initiate the Account Take On request.');
 if(['legal','rules','transition'].includes(k)&&!e.clarification)r.push('Import D09: client restriction clarification.');
 if(k==='rules'){if(!approved(s,'legal'))r.push('Legal must approve current mandate language.');if(!s.screen)r.push('Run the portfolio screen and boundary tests.');}
 if(['reporting','transition'].includes(k)&&!e.service)r.push('Import D11: client reporting and transition agreement.');
 if(k==='transition'&&!s.screen)r.push('Run the portfolio screen.');
 if(k==='scope'||k==='release'){
  if(s.plan!=='staged')r.push('The guided final evidence supports the 9 Nov staged launch; approve that plan first.');
  if(!e.final)r.push('Import D13: final evidence, refreshed screening and client/PM scope acceptance.');
  for(const x of ['legal','rules','reporting','transition'])if(!approved(s,x))r.push('Current '+x+' approval is required.');
 }
 if(k==='release'&&!approved(s,'scope'))r.push('GCS Operations must accept staged-launch readiness as maker.');
 return r;
}
function record(s,action,detail,actor='Scenario evidence'){s.audit.push({sequence:s.audit.length+1,time:new Date().toISOString(),scenarioDate:s.funded?'2026-11-09':s.events.final?'2026-11-06':s.events.change?'2026-10-19':s.events.service?'2026-09-17':s.events.clarification?'2026-09-15':'2026-09-14',revision:s.revision,actor,action,detail});}
function change(s,fn,action,detail){const was=Object.keys(s.decisions).filter(k=>approved(s,k));fn();s.revision++;record(s,action,detail);for(const k of was)if(!approved(s,k))record(s,'Approval reopened',k+': supporting scope changed; prior decision retained in audit.','Control engine');}
function act(s,type,arg={}){
 if(type==='role'){if(!roles.includes(arg.role))throw Error('Unknown reviewer role');s.role=arg.role;return s;}
 if(type==='view'){s.view=arg.view;return s;}
 if(s.released&&!['fund'].includes(type))throw Error('Release already recorded. Reset to replay.');
 if(type==='load'){
  if(!Object.hasOwn(s.events,arg.event))throw Error('Unknown evidence event');
  if(s.events[arg.event])throw Error('This evidence is already loaded.');
  if(arg.event==='final'&&(s.plan!=='staged'||!['initiate','legal','rules','reporting','transition'].every(k=>approved(s,k))))throw Error('Choose staged launch and complete current Legal, FI PC, Reporting and Transition decisions before D13.');
  change(s,()=>{s.events[arg.event]=true;},'Evidence imported',({governance:'D10: final governance closure',clarification:'D09: restriction clarification',service:'D11: client service and transition agreement',change:'D12: request to move launch to 9 Nov',final:'D13: final evidence and refreshed 6 Nov screening'})[arg.event]);
 }else if(type==='plan'){
  if(!s.events.change)throw Error('Load the client date change first.');
  if(!['staged','original'].includes(arg.plan))throw Error('Unknown plan');
  if(s.plan===arg.plan){record(s,'Date request disposition','Keep 23 Nov full-mandate plan; client re-confirmation still required.',s.role);return s;}
  change(s,()=>{s.plan=arg.plan;s.events.final=false;},'Plan revised',arg.plan==='staged'?'Explore 9 Nov bonds-only launch; derivatives disabled, revised scope approvals required.':'Return to 23 Nov full mandate; new final evidence required.');
 }else if(type==='screen'){
  if(!s.events.clarification)throw Error('Clarify contractual scope in D09 before screening.');
  s.screen=true;record(s,'Portfolio screen completed','As of 14 Sep: 12 positions / USD 200m; 2 excluded / USD 20m; 1 review / USD 10m; 9 eligible / USD 170m. Funding requires fresh data.','Rule sandbox');
 }else if(type==='decision'){
  const k=arg.key;if(!required[k])throw Error('Unknown decision');
  if(s.role!==required[k])throw Error('This decision requires '+required[k]+'.');
  if(!['approved','rejected'].includes(arg.status))throw Error('Invalid decision status');
  if(!arg.note||arg.note.trim().length<8)throw Error('Add a review note of at least 8 characters.');
  if(arg.status==='approved'){if(approved(s,k))throw Error('This decision is already approved for the current scope.');const blocks=reasons(s,k);if(blocks.length)throw Error(blocks.join(' '));}
  const was=Object.keys(s.decisions).filter(x=>approved(s,x));
  s.decisions[k]={status:arg.status,role:s.role,note:arg.note.trim(),revision:s.revision,signature:signature(s,k)};
  record(s,k+' '+arg.status,arg.note.trim(),s.role);
  if(arg.status==='rejected'){
   const downstream=({initiate:['legal','rules','reporting','transition','scope'],legal:['rules','scope'],rules:['scope'],reporting:['scope'],transition:['scope'],scope:[]})[k]||[];
   for(const x of downstream)if(was.includes(x)){s.decisions[x].status='reopened';record(s,'Approval reopened',x+': upstream '+k+' rejected.','Control engine');}
  }
  if(k==='initiate'&&arg.status==='approved'){record(s,'Appian request created','ATO-DEMO-0142; idempotency key SA-2026-0142:initiate.','Simulated integration');record(s,'Salesforce financial account acknowledged','FA-DEMO-0142 created from Appian; linked to OPP-DEMO-00482.','Simulated integration');}
  if(k==='release'&&arg.status==='approved'){s.released=true;record(s,'Simulated funding release','Current-scope controls passed; no money moved and no trade sent.','Control engine');}
 }else if(type==='fund'){
  if(!s.released)throw Error('An independent checker must record release first.');if(s.funded)throw Error('Receipt already recorded.');s.funded=true;record(s,'Synthetic funding receipt','D13 p.2 / FND-DEMO-119: USD 80m cash + USD 170m securities reconciled; derivatives remain disabled.','Simulated custodian');
 }else throw Error('Unknown action');return s;
}
function classify(h,asOf='2026-09-14'){
 if(h.kind==='sovereign')return 'eligible';
 if(!h.parent||h.tobacco===null||h.coal===null||!h.esgAsOf||((Date.parse(asOf)-Date.parse(h.esgAsOf))/86400000>30))return 'review';
 return h.tobacco>=5||h.coal>=10?'exclude':'eligible';
}
const api={roles,required,fresh,signature,approved,reasons,act,classify};root.SA=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
