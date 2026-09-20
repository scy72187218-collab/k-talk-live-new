module.exports=async function handler(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  try{
    const asset=await fetch('https://k-talk-live-final.vercel.app/live-presence.js?t='+Date.now(),{cache:'no-store'});
    const js=await asset.text();
    const m=js.match(/var KEY='([^']+)'/);
    if(!m) throw new Error('key_not_found');
    const key=m[1];
    const r=await fetch('https://zupwbfmacwzexyvznlzq.supabase.co/realtime/v1/api/broadcast',{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':key},
      body:JSON.stringify({messages:[{
        topic:'ktalk-live-signal-v2',
        event:'probe',
        payload:{ok:true,at:new Date().toISOString()}
      }]})
    });
    const txt=await r.text();
    res.statusCode=200;
    res.end(JSON.stringify({status:r.status,ok:r.ok,body:txt.slice(0,300)}));
  }catch(e){
    res.statusCode=500;
    res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};