/* Presentation state machine. Agent invocations are simulated; search and checks execute locally. */
(function(){
const E=window.AGENT_DEMO;
const roles=[['A1','Context agent','Interpret client intent'],['A2','Precedent agent','Find useful past cases'],['A3','Operational risk agent','Assess service, funding, readiness and legal risks'],['A4','Investment risk agent','Interpret restrictions and test their portfolio impact'],['A5','Playbook agent','Compose the workflow'],['A6','Evidence reviewer','Challenge unsupported claims']].map(([id,name,purpose])=>({id,name,purpose}));
const scenes=['initial','clarified','cash'];
// Three standard opening events at 3 seconds each give the audience about
// nine seconds to follow the request before the first human checkpoint.
const event=(id,agent,type,title,detail,extra={})=>({id,agent,type,title,detail,duration:3000,...extra});
function mainEvents(scene){return [
 event('receive','A1','call','Onboarding document package received','The Context agent inventories the six current-client PDFs before extracting any requirement.',{active:['A1'],evidence:['N01§1','N02§1','N03§1','N04§1','N05§1','N06§1'],handoff:'Six onboarding PDFs → Context agent'}),
 event('context-read','A1','evidence','Parse PDFs and fetch source evidence','Read text and tables from the request, IMA, policy, transfer file, planning boundary and custodian response. Preserve each source citation.',{evidence:['N01§2','N02§1','N03§1','N04§2','N05§1','N06§2']}),
 event('context-output','A1','output','Five requirement areas identified','Classify reporting, restrictions, funding route, derivatives and legal applicability; surface cross-document conflicts for review.',{artifact:'context',done:['A1'],evidence:['N01§2','N02§1','N03§1','N04§2','N05§1','N06§2'],duration:3000}),
 event('context-gate','H1','gate','Operations reviews the extracted requirements','Confirm the cited client facts and unresolved questions before historical cases are searched.',{gate:'context',evidence:['N01§2','N02§1','N03§1','N04§2','N05§1','N06§2']}),
 event('precedent-call','A2','call','Precedent agent receives the reviewed context','Search by decision area; whole-client similarity is only one signal.',{active:['A2'],handoff:'Reviewed context → Precedent agent'}),
 event('search-service','A2','search','Search reporting precedents','Retrieve exact passages about requested and accepted weekly CHF services.',{query:0,duration:3000}),
 event('search-rules','A2','search','Search restriction precedents','Find the tobacco operator conflict, coal definitions and missing-data patterns.',{query:1,duration:3000}),
 event('search-sequence','A2','search','Search launch dependencies','Find transfer exceptions, counterparty readiness and staged launch decisions.',{query:2,duration:3000}),
 event('case-selection','A2','output','Useful analogues selected','Different historical clients support different parts of the current decision.',{artifact:'cases',done:['A2'],evidence:['H01-S§1','H02-G§1','H03-T§2','H05-S§1'],duration:3200}),
 event('parallel-call','A3','call','Two specialist reviews begin','The Operational risk and Investment risk agents receive the same context and relevant evidence. Both reviews use the same evidence snapshot.',{active:['A3','A4'],handoff:'Precedents → Operational risk + Investment risk agents'}),
 event('risk-reporting','A3','output','Reporting watch area identified','Compare current capability with the actual requested service, then look for successful preventive actions.',{artifact:'risks',riskIds:['R1'],evidence:scene==='initial'?['N01§2','O01§1','H05-S§1']:['N07§1','O01§1','N06§2'],duration:3000}),
 event('rule-compare','A4','output','The same holding gets two different answers','The draft says >5%; the policy says ≥5%. An exactly-5% issuer exposes the difference.',{artifact:'clauses',evidence:['N02§1','N03§1','H02-G§1'],duration:3400}),
 event('risk-transfer','A3','output','Funding-route dependency connected','Restriction interpretation affects how transferred securities are treated. Reassess funding dependencies against the current client proposal.',{artifact:'risks',riskIds:['R3'],evidence:['N04§2','N04§3','H08-G§3'],duration:3000}),
 event('rule-tests','A4','check','Run illustrative boundary and data tests','Check below, at and above thresholds; preserve missing values; test freshness and unresolved mapping.',{artifact:'tests',evidence:['O03§1','O03§3'],duration:3000}),
 event('rule-output','A4','output','Investment risk assessed and handed off','Policy intent may be coded incorrectly until the tobacco operator and coal definition are approved. Legal / FI PC / client interpretation remains an explicit task.',{artifact:'rules',riskIds:['R2'],done:['A4'],evidence:['H08-G§3','O03§2']}),
 event('risk-complete','A3','output','Risk register completed','Readiness uncertainty and missing authoritative legal evidence remain visible. No numerical probability is invented.',{artifact:'risks',riskIds:['R4','R5'],done:['A3'],evidence:['O04§2','O05§2'],duration:3000}),
 ...planEvents(),
 ...criticEvents(),
 event('planning-gate','H2','gate','Human review of the proposed route','Inspect the evidence, challenge a precedent, and accept a working planning draft with unresolved decisions recorded.',{gate:'plan',duration:0})
 ];}
function planEvents(){return [
 event('planner-call','A5','call','Playbook agent receives both reviews','Combine service constraints, investment interpretation and readiness dependencies into one proposed route.',{active:['A5'],handoff:'Operational + investment risk handoffs → Playbook agent'}),
 event('plan-intake','A5','output','Bring the important decisions into intake','Move reporting scope and guideline interpretation early; route applicability questions to Legal.',{artifact:'workflow',phases:['Intake'],duration:2500}),
 event('plan-setup','A5','output','Connect parallel preparation work','Draft annexes, test the sample, validate rules and investigate operational readiness with explicit dependencies.',{artifact:'workflow',phases:['Paperwork','Operational setup'],duration:2800}),
 event('plan-complete','A5','output','Complete the five-phase proposal','Add human scope/funding decisions and first-cycle validation. Timing remains an owner-reviewed planning assumption.',{artifact:'workflow',phases:['Funding','Post-funding'],done:['A5'],duration:3200})
 ];}
function criticEvents(){return [
 event('critic-call','A6','call','Evidence reviewer checks the handoffs','Check source authority, counterexamples, interpretation boundaries and the workflow dependencies.',{active:['A6'],handoff:'Proposed route → Evidence reviewer'}),
 event('critic-findings','A6','output','Unsupported shortcuts challenged','A historical service is not current capability; 4/5 is not an 80% forecast; prior coal wording is not current-client authority.',{artifact:'critic',evidence:['H05-S§1','O01§1','H08-G§3'],duration:3400}),
 event('critic-complete','A6','output','Draft ready for human judgment','The working plan carries its evidence and open decisions. No contract, service or investment approval is inferred.',{done:['A6'],artifact:'review',duration:2200})
 ];}
function updateEvents(before,after){const refs=after==='clarified'?['N07§1','N07§2']:['N08§1','N08§2'];return [
 event('new-evidence','A1','call','New client evidence invalidates the prior draft',after==='clarified'?'The client accepts Tuesday holdings and monthly analytics.':'The client proposes all-cash inception and separately reviewed later derivatives.',{active:['A1'],evidence:refs,handoff:'New client email → Context agent',duration:3000}),
 event('delta-context','A1','output','Changed requirements isolated','Keep unaffected investment restrictions and interpretation decisions; update only the stated client constraints.',{artifact:'context',done:['A1'],evidence:refs}),
 event('delta-retrieve','A2','call','Retrieve evidence for the changed requirement','The assistant checks the relevant capability or transition precedent again.',{active:['A2'],handoff:'Changed context → Targeted precedent review'}),
 event('delta-search','A2','search',after==='clarified'?'Recheck accepted reporting definitions':'Recheck staged transition conditions','The local search runs against the newly selected evidence snapshot.',{query:after==='clarified'?0:2,duration:3000}),
 event('delta-cases','A2','output','Relevant precedent reassessed','The unchanged restriction comparison remains reusable. Reusing evidence does not approve the investment terms.',{artifact:'cases',done:['A2'],evidence:after==='clarified'?['N07§1','O01§1','H05-S§1']:['N08§1','O04§2','H03-T§2']}),
 event('delta-risk-call','A3','call','Operational risk agent reassesses the affected conclusions','Current requirements and dependencies determine which watch areas change.',{active:['A3'],handoff:'Revised context + evidence → Operational risk agent'}),
 event('delta-risk-output','A3','output','Risk register revised',after==='clarified'?'The reporting mismatch reduces; annex alignment and feed validation remain.':'In-kind screening leaves inception; derivative activation gets a separate route; ESG purchase checks remain.',{artifact:'risks',riskIds:['R1','R2','R3','R4','R5'],done:['A3'],evidence:refs,duration:3400}),
 ...planEvents(),...criticEvents(),
 event('delta-review','H2','gate','Review the revised planning draft','Prior acceptance is superseded. Review the changes and preserve the unresolved legal, service and investment decisions.',{gate:'plan',duration:0})
 ];}
function challengeEvents(){return [
 event('human-challenge','A2','call','Human challenge: “Rhinebridge succeeded.”','The reviewer asks whether the successful Swiss pension precedent undermines the reporting risk.',{active:['A2'],handoff:'Human challenge → Precedent agent',evidence:['H05-S§1']}),
 event('challenge-search','A2','search','Inspect requested versus accepted service','Retrieve the service acceptance and its recorded preventive action.',{queryText:'Rhinebridge accepted holdings attribution sample',duration:3000}),
 event('challenge-evidence','A2','output','Success is preserved as counterevidence','Rhinebridge agreed to weekly holdings and monthly analytics in week 1. Its success supports early scope agreement.',{artifact:'challenge',done:['A2'],evidence:['H05-S§1','H05-S§2'],duration:3400}),
 event('challenge-risk','A3','call','Operational risk agent reviews the challenge','A successful scope change does not establish support for the originally requested weekly attribution.',{active:['A3'],handoff:'Accepted service evidence → Operational risk agent'}),
 event('challenge-result','A3','output','Recommendation clarified','Keep the preventive-action precedent; preserve current capability limits and current-client validation requirements.',{artifact:'risks',riskIds:['R1','R2','R3','R4','R5'],done:['A3'],evidence:['H05-S§1','O01§1'],duration:3000}),
 ...planEvents(),...criticEvents(),
 event('challenge-review','H2','gate','Human review after the challenge','The draft now explicitly carries the successful precedent and the limit on its reuse.',{gate:'plan',duration:0})
 ];}
function create(context,mode='full',previous=null){
 const scene=context.scenario||'initial';
 const s={scene,revision:context.revision,mode,cursor:-1,playing:false,gate:null,accepted:false,challenged:mode==='challenge'||Boolean(previous?.challenged),speed:previous?.speed||1,stepByAgent:previous?previous.stepByAgent!==false:true,completed:[],focus:null,event:null,events:mode==='update'?updateEvents(previous.scene,scene):mode==='challenge'?challengeEvents():mainEvents(scene),status:Object.fromEntries(roles.map(r=>[r.id,'queued'])),outputs:{riskIds:[],phases:[],searches:[],context:false,cases:false,clauses:false,tests:false,rules:false,critic:false,review:false,challenge:false},log:[],rounds:previous?[...(previous.rounds||[]),{scene:previous.scene,revision:previous.revision,events:previous.log}]:[],before:previous?{scene:previous.scene,revision:previous.revision,risks:E.risks(previous.scene,context.excluded||[]).map(r=>({id:r.id,status:r.status})),tasks:E.workflow(previous.scene).map(t=>t.id)}:null,context};
 if(mode!=='full'){s.status.A4='reused';s.outputs.clauses=true;s.outputs.tests=true;s.outputs.rules=true;s.testResults=previous?.testResults||E.ruleChecks();if(mode==='challenge'){s.status.A1='reused';s.outputs.context=true;}}
 return s;
}
function advance(s){
 if(s.gate||s.accepted||s.cursor>=s.events.length-1)return false;
 const e=s.events[++s.cursor];s.event=e;s.focus=null;
 for(const id of e.active||[])s.status[id]='active';
 for(const id of e.done||[]){s.status[id]='complete';if(!s.completed.includes(id))s.completed.push(id);}
 if(s.stepByAgent&&(e.done||[]).some(id=>id.startsWith('A'))&&!e.gate&&s.cursor<s.events.length-1&&!s.events[s.cursor+1].gate){s.playing=false;s.agentPause=e.done[e.done.length-1];}else s.agentPause=null;
 if(e.riskIds)s.outputs.riskIds=[...new Set([...s.outputs.riskIds,...e.riskIds])];
 if(e.artifact==='workflow')s.outputs.phases=[...new Set([...s.outputs.phases,...e.phases])];
 else if(e.artifact&&e.artifact!=='risks')s.outputs[e.artifact]=true;
 if(e.type==='search'){
  const q=e.queryText||E.queries[e.query].query;
  const hits=E.retrieve(q,s.scene).slice(0,4).map(c=>({id:c.id,title:c.doc.title,text:c.text,score:c.score}));
  s.outputs.searches.push({query:q,hits});
 }
 if(e.type==='check')s.testResults=E.ruleChecks();
 if(e.gate){s.gate=e.gate;s.playing=false;}
 s.log.push({step:s.log.length+1,agent:e.agent,event:e.id,type:e.type,title:e.title,mode:e.type==='search'?'local lexical retrieval':e.type==='check'?'local deterministic checks':'simulated orchestration / prepared output',snapshot:E.dates[s.scene],evidence:e.evidence||[]});
 return true;
}
function releaseContext(s){if(s.gate!=='context')return false;s.gate=null;s.log.push({step:s.log.length+1,agent:'H1',type:'human',title:'Client context confirmed for planning',snapshot:E.dates[s.scene]});return true;}
function accept(s,name,note){if(s.gate!=='plan'||!name.trim()||!note.trim())return false;s.gate=null;s.accepted=true;s.playing=false;s.log.push({step:s.log.length+1,agent:'H2',type:'human',title:'Working planning draft accepted',reviewer:name.trim(),rationale:note.trim(),revision:s.revision,snapshot:E.dates[s.scene]});return true;}
function delta(s){if(!s.before)return[];const now=E.risks(s.scene,s.context.excluded||[]);return now.map(r=>({id:r.id,title:r.title,before:s.before.risks.find(x=>x.id===r.id)?.status||'Unknown',after:r.status})).filter(r=>r.before!==r.after);}
window.SA_RUN_MODEL={roles,scenes,create,advance,releaseContext,accept,delta};
})();
