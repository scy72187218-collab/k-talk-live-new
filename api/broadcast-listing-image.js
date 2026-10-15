const {createHash}=require('node:crypto');
module.exports=async function(req,res){
 if(req.method!=='GET'){res.statusCode=405;res.setHeader('Allow','GET');return res.end();}
 const query=req.query||{},id=String(query.room||''),kind=String(query.kind||''),version=String(query.v||'');
 if(!/^[0-9a-f-]{36}$/i.test(id)||!['product_image','icon_image'].includes(kind)||! /^[0-9a-f]{32}$/.test(version)){res.statusCode=400;return res.end();}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
 try{
  const key=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();if(!key)throw Error('configuration');
  const url='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/ktalk_live_rooms?select=image:listing_details->>'+kind+'&id=eq.'+encodeURIComponent(id)+'&limit=1';
  const response=await fetch(url,{headers:{apikey:key},signal:controller.signal});if(!response.ok)throw Error('image lookup');
  const rows=await response.json(),source=String(rows&&rows[0]&&rows[0].image||'');
  if(!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(source)||source.length>190000||createHash('md5').update(source).digest('hex')!==version){res.statusCode=404;return res.end();}
  const body=Buffer.from(source.slice(source.indexOf(',')+1),'base64');if(body.length<3||body[0]!==255||body[1]!==216||body[2]!==255){res.statusCode=404;return res.end();}
  res.setHeader('Content-Type','image/jpeg');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','public, max-age=86400, s-maxage=604800, immutable');res.statusCode=200;return res.end(body);
 }catch(e){res.setHeader('Cache-Control','no-store');res.statusCode=503;return res.end();}finally{clearTimeout(timer);}
};