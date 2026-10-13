import {getAuthClient,SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './auth';
const BASE=SUPABASE_URL+'/functions/v1/challenge-auth-web';
const DECISIONS_BASE=SUPABASE_URL+'/functions/v1/challenge-auth-decisions';
const scopedRoutes=new Set(['scope-options','scope-preview','decide-scoped']);
export class ApiError extends Error{constructor(message:string,public status:number){super(message);}}
function expired(){window.dispatchEvent(new Event('ravenstack:auth-expired'));return new ApiError('Sua sessão expirou. Entre novamente.',401);}
export async function api(path:string,body?:unknown,retry=true):Promise<any>{
 const client=getAuthClient();const {data,error}=await client.auth.getSession();
 if(error||!data.session?.access_token)throw expired();
 const multipart=body instanceof FormData;
 const r=await fetch((scopedRoutes.has(path)?DECISIONS_BASE:BASE)+'/'+path,{method:body===undefined?'GET':'POST',cache:'no-store',headers:{Authorization:'Bearer '+data.session.access_token,apikey:SUPABASE_PUBLISHABLE_KEY,...(multipart?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:multipart?body:JSON.stringify(body)});
 const d:any=await r.json();
 if(r.status===401){
  if(retry){const refreshed=await client.auth.refreshSession();if(!refreshed.error&&refreshed.data.session)return api(path,body,false);}
  throw expired();
 }
 if(!r.ok)throw new ApiError(d.error??'Falha na operação.',r.status);return d;
}
