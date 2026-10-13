// Component acceptance in an emulated DOM. This is NOT browser/visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';
const {Window}=await import(process.env.TEST_DOM_MODULE??'happy-dom');
const window=new Window({url:'https://component-test.invalid'});
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','HTMLTextAreaElement','Event','KeyboardEvent','MouseEvent','FormData','File','Blob','localStorage']) Object.defineProperty(globalThis,name,{value:name==='window'?window:window[name],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {default:React,act}=await import('react');
const {createRoot}=await import('react-dom/client');
const folder=path.dirname(fileURLToPath(import.meta.url)),generated=path.join(folder,'.generated');await fs.mkdir(generated,{recursive:true});
const source=await fs.readFile(process.env.TEST_PAGE_SOURCE??path.join(folder,'../app/page.tsx'),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace("'../lib/api'","'./api.mjs'").replace("'../lib/contracts.mjs'","'../../lib/contracts.mjs'");
await fs.writeFile(path.join(generated,'page.mjs'),output);await fs.writeFile(path.join(generated,'api.mjs'),'export const api=(...args)=>globalThis.__api(...args);\n');
const {default:Dashboard}=await import('./.generated/page.mjs');
const {contracts}=await import('../lib/contracts.mjs');
const run={id:'run-original',version_id:'version-original',reference_date:'2024-12-31',published_at:'2026-10-12',metrics:{accounts:25,contract_mrr:2500}};
function fixture(){return {run,workspace:{name:'Example'},accounts:Array.from({length:25},(_,i)=>({id:`snapshot-${i}`,account_id:`QA-${i}`,account_name:`Example ${String(i).padStart(3,'0')}`,signup_date:'2024-01-01',industry:i<20?'Alpha':'Beta',country:'BR',cadastral_churn:i===0,has_any_event:false,churn_events:0,reactivation_events:0,reconciliation_state:i===0?'flag_without_event':'no_observed_churn_history',open_contracts:1,contract_mrr:100,coherent_usage_rows_30d:0,coherent_usage_rows_previous_30d:0,recorded_usage_30d:null,recorded_usage_previous_30d:null,eligible_tickets_30d:0,closed_tickets_30d:0,satisfaction_responses:0,mean_satisfaction:null,quality_flags:['telemetry_coverage_not_confirmed']})),evidence:[{id:'evidence-coverage',rule_code:'usage_coverage',summary:'Cobertura não confirmada.'}],quality:[],sources:Object.keys(contracts).map(k=>({source_type:k,filename:`${k}.csv`,rows:25,file_hash:'0'.repeat(64),received_at:'2026-10-12'})),decisions:[],actions:[],history:[],versions:[run],uploads:[]};}
let root,container,state,calls,handler;
async function setup(){state=fixture();calls=[];handler=null;document.body.innerHTML='<div id="root"></div>';container=document.getElementById('root');globalThis.__api=async(name,body)=>{calls.push({name,body});if(handler){const r=await handler(name,body);if(r!==undefined)return r;}if(name==='dashboard')return structuredClone(state);if(name==='scope-options')return {run_id:run.id,metrics:[...['missing_cancel','cadastral_churn','contract_mrr','observed_usage','satisfaction'].map(code=>({code,label:code,scope_types:['account','segment','portfolio']})),{code:'quality_check',label:'Qualidade',scope_types:['quality']}],quality:[{code:'usage.before_subscription',sources:['usage','subscriptions'],interpretation:'Uso anterior',affected_count:2,denominator:5}]};if(name==='scope-preview'){const members=body.scope.type==='quality'?[]:state.accounts.filter(a=>body.scope.type==='portfolio'||(body.scope.type==='account'?a.account_id===body.scope.account_id:(!body.scope.industry||a.industry===body.scope.industry)&&(!body.scope.country||a.country===body.scope.country))).map(a=>({snapshot_id:a.id,account_id:a.account_id,account_name:a.account_name,highlighted:a.cadastral_churn}));if(!members.length&&body.scope.type!=='quality')throw Error('Nenhuma conta elegível neste recorte');return {run,scope:body.scope,scope_label:body.scope.type==='account'?'Conta: '+members[0].account_name:body.scope.type==='segment'?'Segmento: '+(body.scope.industry??'Todos'):'Carteira inteira',metric:body.metric,preview_hash:'a'.repeat(64),population_count:members.length,affected_count:members.filter(a=>a.highlighted).length,members,measure:{label:body.metric,value:1,numerator:1,denominator:members.length,unit:'contas',state:'indeterminate'},warnings:['Limites explícitos']};}if(name==='detail')return {snapshot:state.accounts.find(a=>a.id===body.id),evidence:[],events:[],subscriptions:[],usage:[],support:[]};throw Error('Unhandled '+name);};root=createRoot(container);await act(async()=>{root.render(React.createElement(Dashboard));});}
async function cleanup(){await act(async()=>root.unmount());}
const text=()=>container.textContent;
const button=(name,within=container)=>[...within.querySelectorAll('button')].find(b=>b.textContent.trim()===name);
async function click(el){assert.ok(el,'Clickable element exists');await act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));}
async function nav(name){await click([...container.querySelectorAll('nav button')].find(b=>b.textContent.trim().startsWith(name)));}
async function change(el,value){await act(async()=>{el.value=value;el.dispatchEvent(new window.Event('change',{bubbles:true}));});}
async function input(el,value){await act(async()=>{const proto=el.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new window.Event('input',{bubbles:true}));el.dispatchEvent(new window.Event('change',{bubbles:true}));});}
async function submit(form){await act(async()=>form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));}

test('Navegação nas seis áreas, filtro por setor e paginação',async()=>{await setup();try{
 assert.match(text(),/Uma visão clara/);await nav('Contas');assert.equal(container.querySelectorAll('tbody tr').length,20);await click(button('Próxima'));assert.equal(container.querySelectorAll('tbody tr').length,5);
 await change(container.querySelector('.filters select'),'Alpha');assert.equal(container.querySelectorAll('tbody tr').length,20);assert.match(text(),/Página 1/);
 for(const name of ['Diagnóstico','Decisões e ações','Dados e qualidade','Metodologia','Visão executiva']){await nav(name);assert.equal(container.querySelector('h1').textContent,name==='Visão executiva'?'Uma visão clara. Decisões melhores.':name);}
 }finally{await cleanup();}});

test('Detalhe de conta abre, Escape fecha e restaura o foco',async()=>{await setup();try{
 await nav('Contas');const link=container.querySelector('.account-link');link.focus();await click(link);assert.ok(document.querySelector('[role="dialog"]'));assert.match(text(),/Nenhum evento de churn registrado/);
 await act(async()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('[role="dialog"]'),null);assert.equal(document.activeElement,link);
 }finally{await cleanup();}});

test('Decisão enviada com a evidência; falha mantém formulário e mensagem',async()=>{await setup();try{
 await click(button('Registrar decisão'));const form=document.querySelector('.modal form');for(const [k,v]of Object.entries({title:'Validar extração',rationale:'Ausência de eventos limita o diagnóstico.',actor:'Pessoa declarada',action:'Conferir origem',responsible:'Equipe de dados',due:'2026-10-13'}))form.elements.namedItem(k).value=v;
 handler=async(name)=>{if(name==='decide-scoped')throw Error('Falha controlada na gravação');};await click(button('Revisar evidência',form));await submit(form);assert.match(document.querySelector('[role="dialog"]').textContent,/Falha controlada/);assert.equal(form.elements.namedItem('title').value,'Validar extração');assert.equal(calls.find(c=>c.name==='decide-scoped').body.scope.type,'portfolio');assert.equal(calls.find(c=>c.name==='decide-scoped').body.preview_hash,'a'.repeat(64));
 }finally{await cleanup();}});

test('Erro ao concluir ação precisa aparecer dentro do modal e preservar o resultado',async()=>{await setup();try{
 state.decisions=[{id:'d',title:'Investigar dados',rationale:'Verificar origem e cobertura.',actor_display_name:'QA',evidence_context:{run}}];state.actions=[{id:'a',decision_id:'d',title:'Conferir origem',responsible:'QA',due_date:'2026-10-13',status:'in_progress',revision:1}];await click(container.querySelector('[aria-label="Atualizar dados"]'));await nav('Decisões e ações');await click(button('Concluir'));
 const result=document.querySelector('.modal textarea');result.focus();await input(result,'Resultado completo do teste');assert.equal(document.activeElement,result);handler=async(name)=>{if(name==='transition')throw Error('Revisão desatualizada');};await submit(document.querySelector('.modal form'));
 assert.match(document.querySelector('[role="dialog"]').textContent,/Revisão desatualizada/);assert.equal(result.value,'Resultado completo do teste');
 }finally{await cleanup();}});

test('Falha ao carregar detalhe de conta precisa aparecer no diálogo e permitir retry',async()=>{await setup();try{
 handler=async(name)=>{if(name==='detail')throw Error('Detalhe indisponível');};await nav('Contas');await click(container.querySelector('.account-link'));
 assert.match(document.querySelector('[role="dialog"]').textContent,/Detalhe indisponível/);assert.ok(button('Tentar novamente',document.querySelector('[role="dialog"]')));handler=null;await click(button('Tentar novamente',document.querySelector('[role="dialog"]')));assert.match(document.querySelector('[role="dialog"]').textContent,/Nenhum evento de churn registrado/);
 }finally{await cleanup();}});

test('Upload: mapear, revisar prévia, pausar após etapa e retomar publicação',async()=>{await setup();try{
 const headers=Object.keys(contracts.accounts);let count=0,releaseSecond;const second=new Promise(resolve=>{releaseSecond=resolve;});
 handler=async(name)=>{if(name==='inspect')return {headers,sheets:[],rows:600};if(name==='preview')return {accepted:true,id:'upload-qa',preview:{new_rows:600,added:0,changed:0,removed:0,quality:[]}};if(name==='begin')return {stage:'processing'};if(name==='advance'){count++;if(count===1)return {stage:'processing',processed:300,total:600};if(count===2)return second;return {stage:'published',processed:600,total:600};}};
 await nav('Dados e qualidade');const file=document.querySelector('input[type="file"]');Object.defineProperty(file,'files',{value:[new window.File(['synthetic'],'test.csv',{type:'text/csv'})],configurable:true});await act(async()=>file.dispatchEvent(new window.Event('change',{bubbles:true})));assert.match(text(),/600 linhas/);
 await click(button('Validar e gerar prévia'));assert.match(text(),/PRÉVIA VALIDADA/);assert.equal(calls.filter(c=>c.name==='begin').length,0);
 await click(button('Confirmar e publicar'));assert.equal(count,2);await click(button('Pausar após esta etapa'));await act(async()=>releaseSecond({stage:'verified',processed:600,total:600}));assert.match(text(),/Processamento pausado/);assert.equal(count,2);
 await click(button('Retomar'));assert.match(text(),/Versão publicada/);assert.equal(count,3);
 }finally{await cleanup();}});

test('Upload inválido conserva painel, apresenta erro e não confirma publicação',async()=>{await setup();try{
 handler=async(name)=>{if(name==='inspect')return {headers:Object.keys(contracts.accounts),sheets:[],rows:1};if(name==='preview')return {accepted:false,error_count:1,errors:[{row:2,message:'seats: inteiro inválido'}]};};await nav('Dados e qualidade');const file=document.querySelector('input[type="file"]');Object.defineProperty(file,'files',{value:[new window.File(['synthetic'],'bad.csv')],configurable:true});await act(async()=>file.dispatchEvent(new window.Event('change',{bubbles:true})));await click(button('Validar e gerar prévia'));assert.match(text(),/seats: inteiro inválido/);assert.equal(button('Confirmar e publicar'),undefined);assert.equal(calls.filter(c=>c.name==='begin'||c.name==='advance').length,0);assert.equal(state.run.id,'run-original');
 }finally{await cleanup();}});

test('Busca por conta reduz lista sem confundir ausência de uso com zero',async()=>{await setup();try{await nav('Contas');await input(container.querySelector('.search input'),'Example 024');assert.equal(container.querySelectorAll('tbody tr').length,1);assert.match(container.querySelector('tbody').textContent,/Não observado/);}finally{await cleanup();}});


test('Decisão permite escolher conta, revisar prévia e invalidar ao trocar escopo',async()=>{await setup();try{
 await click(button('Registrar decisão'));const dialog=document.querySelector('[role="dialog"]');assert.match(dialog.querySelector('#decision-review-guidance').textContent,/clique em “Revisar evidência”/);assert.equal(button('Registrar decisão e ação',dialog).getAttribute('aria-describedby'),'decision-review-guidance');await change(dialog.querySelector('[aria-label="Escopo da decisão"]'),'account');await input(dialog.querySelector('[aria-label="Buscar conta para decisão"]'),'Example 024');await change(dialog.querySelector('[aria-label="Conta da decisão"]'),'QA-24');await click(button('Revisar evidência',dialog));assert.match(dialog.textContent,/Conta: Example 024/);assert.equal(calls.find(c=>c.name==='scope-preview').body.scope.account_id,'QA-24');
 assert.equal(button('Registrar decisão e ação',dialog).disabled,false);assert.match(dialog.querySelector('#decision-review-guidance').textContent,/Evidência revisada/);await change(dialog.querySelector('[aria-label="Escopo da decisão"]'),'segment');assert.equal(button('Registrar decisão e ação',dialog).disabled,true);assert.equal(dialog.querySelector('.scope-evidence'),null);assert.match(dialog.querySelector('#decision-review-guidance').textContent,/Revise a evidência antes de registrar/);
 }finally{await cleanup();}});

test('Decisão herda setor/país do painel e exige revisar o recorte',async()=>{await setup();try{
 await change(container.querySelector('.filters select'),'Alpha');await click(button('Registrar decisão'));const dialog=document.querySelector('[role="dialog"]');assert.equal(dialog.querySelector('[aria-label="Escopo da decisão"]').value,'segment');assert.equal(dialog.querySelector('[aria-label="Setor da decisão"]').value,'Alpha');await click(button('Revisar evidência',dialog));assert.equal(dialog.querySelector('.scope-measures b').textContent,'20');assert.match(dialog.querySelector('.scope-measures').textContent,/contas no recorte/);assert.equal(calls.find(c=>c.name==='scope-preview').body.scope.industry,'Alpha');
 }finally{await cleanup();}});

test('Qualidade oferece só regras relacionadas à fonte e não permite métrica de carteira',async()=>{await setup();try{
 await click(button('Registrar decisão'));const dialog=document.querySelector('[role="dialog"]');await change(dialog.querySelector('[aria-label="Escopo da decisão"]'),'quality');await change(dialog.querySelector('[aria-label="Fonte da decisão"]'),'usage');await change(dialog.querySelector('[aria-label="Verificação da decisão"]'),'usage.before_subscription');assert.equal(dialog.querySelector('[aria-label="Dado da decisão"]').value,'quality_check');assert.equal(dialog.querySelector('[aria-label="Dado da decisão"]').options.length,1);await click(button('Revisar evidência',dialog));assert.equal(calls.find(c=>c.name==='scope-preview').body.scope.source,'usage');
 }finally{await cleanup();}});


test('Atualizar contexto invalida prévia e preserva rascunho da decisão',async()=>{await setup();try{
 await click(button('Registrar decisão'));const dialog=document.querySelector('[role="dialog"]'),title=dialog.querySelector('[name="title"]');await input(title,'Investigar cobertura');await click(button('Revisar evidência',dialog));assert.equal(button('Registrar decisão e ação',dialog).disabled,false);state.run={...run,id:'run-new'};await click(button('Atualizar contexto',dialog));assert.equal(title.value,'Investigar cobertura');assert.equal(button('Registrar decisão e ação',dialog).disabled,true);assert.equal(dialog.querySelector('.scope-evidence'),null);assert.equal(calls.filter(c=>c.name==='scope-options').at(-1).body.run_id,'run-new');
 }finally{await cleanup();}});

test('Lista filtra escopo novo e preserva leitura de decisão anterior',async()=>{await setup();try{
 state.decisions=[{id:'old',title:'Registro anterior',rationale:'Conferir cobertura.',actor_display_name:'QA',evidence_context:{run}},{id:'new',scope_type:'segment',title:'Investigar setor',rationale:'Conferir extração.',actor_display_name:'QA',evidence_context:{run,scope:{type:'segment',industry:'Alpha'},scope_label:'Segmento: Alpha / Todos os países'}}];state.actions=state.decisions.map(d=>({id:'a-'+d.id,decision_id:d.id,title:'Conferir origem',responsible:'QA',due_date:'2026-10-13',status:'completed',revision:2}));await click(container.querySelector('[aria-label="Atualizar dados"]'));await nav('Decisões e ações');assert.equal(container.querySelectorAll('.decision-card').length,2);await change(container.querySelector('[aria-label="Filtrar decisões por escopo"]'),'segment');assert.equal(container.querySelectorAll('.decision-card').length,1);assert.match(text(),/Investigar setor/);await change(container.querySelector('[aria-label="Filtrar decisões por escopo"]'),'legacy');assert.equal(container.querySelectorAll('.decision-card').length,1);await click(button('Evidência e histórico'));assert.match(document.querySelector('[role="dialog"]').textContent,/Registro anterior/);assert.match(document.querySelector('[role="dialog"]').textContent,/Evidência geral · registro anterior/);
 }finally{await cleanup();}});
