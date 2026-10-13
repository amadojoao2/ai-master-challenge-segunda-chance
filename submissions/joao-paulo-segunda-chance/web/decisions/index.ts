import {normalizeScope,validateMetric} from '../domain/decision_scope.mjs';

const url=Deno.env.get('SUPABASE_URL')!;
const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!; // Built-in runtime secret. Never returned.
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type,x-challenge-session','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
const hash=async(bytes:Uint8Array)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
const textHash=(s:string)=>hash(new TextEncoder().encode(s));
async function rpc(name:string,args:Record<string,unknown>={}) {
 const res=await fetch(`${url}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(args)});
 const body=await res.json();if(!res.ok){const e=new Error(body.message??'Erro no banco.');(e as any).code=body.code;throw e;}return body;
}
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return response({error:'Método não permitido.'},405);
 try{
  const path=new URL(req.url).pathname.split('/').pop();
  const token=req.headers.get('x-challenge-session');
  if(!token||token.length>200)return response({error:'Sessão ausente ou expirada.'},401);
  if(Number(req.headers.get('content-length')??0)>16384)return response({error:'Requisição muito grande.'},413);
  const raw=await req.text();if(new TextEncoder().encode(raw).length>16384)return response({error:'Requisição muito grande.'},413);
  const body=JSON.parse(raw),p_token=await textHash(token);
  if(path==='scope-options')return response(await rpc('challenge_web_scope_options',{p_token,p_run:body.run_id}));
  if(path==='scope-preview'){const scope=normalizeScope(body.scope);return response(await rpc('challenge_web_scope_preview',{p_token,p_run:body.run_id,p_scope:scope,p_metric:validateMetric(scope,body.metric)}));}
  if(path==='decide-scoped'){const scope=normalizeScope(body.scope);return response(await rpc('challenge_web_decide_scoped',{p_token,p_request:body.request_key,p_run:body.run_id,p_scope:scope,p_metric:validateMetric(scope,body.metric),p_preview_hash:body.preview_hash,p_title:body.title,p_rationale:body.rationale,p_actor:body.actor,p_action:body.action,p_responsible:body.responsible,p_due:body.due}));}
  return response({error:'Operação desconhecida.'},404);
 }catch(e){return response({error:(e as Error).message},(e as any).code==='28000'?401:(e as any).code==='PT409'?409:400);}
});
