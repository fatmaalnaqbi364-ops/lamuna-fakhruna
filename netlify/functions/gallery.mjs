import { getStore } from '@netlify/blobs';
export default async ()=>{try{const store=getStore('student-works');const keys=await store.list({prefix:'entries/'});const items=(await Promise.all(keys.blobs.slice(0,200).map(x=>store.get(x.key,{type:'json'})))).filter(Boolean);items.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));return Response.json(items,{headers:{'Cache-Control':'no-store'}})}catch(e){console.error(e);return Response.json({error:'تعذر تحميل الأعمال'},{status:500})}};
export const config={path:'/.netlify/functions/gallery'};
