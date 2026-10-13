import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeQuery,selectCall,buildRequest,executeQuestion,publicError} from '../domain/assistant.mjs';
const filters={industry:null,country:null};const context={run_id:'run',reference_date:'2024-12-31',filters};
const query={type:'function_call',name:'query_business',call_id:'call1',arguments:JSON.stringify({metric:'mrr',industry:'EdTech',country:null,dimension:null,quality_kind:null})};
const response=output=>({id:'provider-response',output,usage:{input_tokens:100,output_tokens:30}});
test('Query contract rejects SQL, unknown metrics, injected filters and mixed parameters',()=>{
 assert.throws(()=>normalizeQuery({...JSON.parse(query.arguments),sql:'drop table'}));assert.throws(()=>normalizeQuery({...JSON.parse(query.arguments),metric:'sql'}));
 assert.throws(()=>normalizeQuery({...JSON.parse(query.arguments),dimension:'industry'}));
 assert.deepEqual(normalizeQuery(JSON.parse(query.arguments)),{metric:'mrr',industry:'EdTech',country:null,dimension:null,quality_kind:null});
});
test('One typed tool required; invalid JSON, duplicate tools and text-only output rejected',()=>{
 assert.equal(selectCall(response([query])).name,'query_business');
 assert.throws(()=>selectCall(response([query,query])));assert.throws(()=>selectCall(response([{type:'message',content:[{type:'output_text',text:'500 contas'}]}])));
 assert.throws(()=>selectCall(response([{...query,arguments:'broken'}])));
});
test('Request uses approved Luna, stateless Responses, bounded output and required tools',()=>{
 const r=buildRequest('Qual MRR?',context,[]);assert.equal(r.model,'gpt-6-luna');assert.equal(r.store,false);assert.equal(r.reasoning.effort,'none');assert.equal(r.parallel_tool_calls,false);assert.equal(r.tool_choice,'required');
 assert.ok(r.max_output_tokens<=1200);assert.ok(r.tools.every(x=>x.strict&&x.parameters.additionalProperties===false));
 assert.throws(()=>buildRequest('x'.repeat(2001),context,[]));
});
test('Numbers and evidence come from SQL; model text cannot substitute or invent results',async()=>{
 const calls=[];const fact={metric:'mrr',label:'MRR contratual',value:'12345.67',unit:'unidade da fonte',reference_date:'2024-12-31',run_id:'run',filters:{industry:'EdTech',country:null},definition:'Contratos no corte, sem trials.',warnings:['Moeda não informada.']};
 const r=await executeQuestion({question:'MRR EdTech',context,history:[],modelCall:async body=>{calls.push(body);return calls.length===1?response([query]):response([{type:'message',content:[{type:'output_text',text:'A receita será 999999 amanhã.'}]}]);},query:async q=>{assert.equal(q.metric,'mrr');return fact;}});
 assert.equal(r.evidence.value,'12345.67');assert.match(r.answer,/12\.345,67/);assert.ok(!r.explanation.includes('999999'));assert.equal(calls.length,2);assert.equal(calls[1].tool_choice,'none');assert.equal(r.usage.input_tokens,200);
});
test('Clarification and unsupported requests do not query database or invent a calculation',async()=>{
 for(const name of ['clarify_question','unsupported_question']){let reads=0;const r=await executeQuestion({question:'MRR anual?',context,history:[],query:()=>{reads++;},modelCall:async()=>response([{type:'function_call',name,call_id:'c',arguments:JSON.stringify({message:'Você deseja ARR anualizado ou receita realizada?'})}])});assert.equal(reads,0);assert.equal(r.evidence,null);assert.match(r.answer,/ARR/);}
});
test('Provider failure is sanitized; numeric fact survives failed explanation',async()=>{
 assert.equal(publicError(Object.assign(new Error('sk-secret provider error'),{code:'provider'})),'O serviço de IA está indisponível. Tente novamente.');
 let calls=0;const r=await executeQuestion({question:'Contas?',context,history:[],query:async()=>({metric:'accounts',label:'Contas cadastradas',value:500,unit:'contas',definition:'Cadastros da versão.',filters,run_id:'run'}),modelCall:async()=>{if(++calls===1)return response([{...query,arguments:JSON.stringify({metric:'accounts',industry:null,country:null,dimension:null,quality_kind:null})}]);throw Error('provider error');}});assert.match(r.answer,/500/);assert.ok(r.warnings.length);assert.equal(r.usage.input_tokens,100);
});
test('Unsupported or ambiguous output cannot present an invented numeric answer without evidence',async()=>{
 const r=await executeQuestion({question:'Preveja receita',context,history:[],query:()=>{throw Error('No query expected');},modelCall:async()=>response([{type:'function_call',name:'unsupported_question',call_id:'c',arguments:JSON.stringify({message:'A previsão é 90000.'})}])});assert.ok(!r.answer.includes('90000'));assert.equal(r.evidence,null);
});
