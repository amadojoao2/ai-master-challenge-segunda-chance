const BASE='https://uxpcrjryxrbwgpakesti.supabase.co/functions/v1/challenge-web';
let inflight:Promise<string>|null=null;
async function session(){
 const existing=localStorage.getItem('ravenstack_session');if(existing)return existing;
 if(!inflight)inflight=fetch(BASE+'/session',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(async r=>{const d:any=await r.json();if(!r.ok)throw Error(d.error);localStorage.setItem('ravenstack_session',d.token);return d.token;}).finally(()=>{inflight=null;});return inflight;
}
export async function api(path:string,body?:unknown,retry=true):Promise<any>{
 const token=await session(),multipart=body instanceof FormData;
 const r=await fetch(BASE+'/'+path,{method:body===undefined?'GET':'POST',headers:{'x-challenge-session':token,...(multipart?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:multipart?body:JSON.stringify(body)});
 const d:any=await r.json();if(r.status===401&&retry){localStorage.removeItem('ravenstack_session');return api(path,body,false);}if(!r.ok)throw Error(d.error??'Falha na operação.');return d;
}
