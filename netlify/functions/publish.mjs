import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
const types=['image/jpeg','image/png','image/webp','image/gif','application/pdf','video/mp4','video/webm'];
export default async (request)=>{
 if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405});
 try{
  const body=await request.json();const {name,grade,mime,data}=body;
  if(typeof name!=='string'||name.trim().length<3||name.length>90||!['التاسع','العاشر','الحادي عشر','الثاني عشر'].includes(grade)||!types.includes(mime)||typeof data!=='string'||data.length>5_600_000)return Response.json({error:'بيانات غير صالحة أو ملف أكبر من 4MB'},{status:400});
  const bytes=Buffer.from(data,'base64');if(bytes.length>4*1024*1024||bytes.length===0)return Response.json({error:'حجم الملف غير مسموح'},{status:400});
  const id=randomUUID();const store=getStore('student-works');
  await store.set('media/'+id,bytes,{metadata:{mime}});
  await store.setJSON('entries/'+id,{id,name:name.trim(),grade,mime,createdAt:new Date().toISOString()});
  return Response.json({ok:true,id});
 }catch(e){console.error(e);return Response.json({error:'حدث خطأ أثناء الحفظ'},{status:500})}
};
export const config={path:'/.netlify/functions/publish'};
