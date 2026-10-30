export const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(n||0);
export const date=(s:string)=>new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(s));
export const dateTime=(s:string)=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(s));
export const today=()=>new Date().toISOString().slice(0,10);
export const daysFromNow=(days:number)=>{const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)};
export function errorMessage(e:unknown){const raw=e instanceof Error?e.message:String(e);return raw.replace(/^Error invoking remote method '[^']+': Error: /,'');}
