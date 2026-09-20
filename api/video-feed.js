module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }
  const base='https://zupwbfmacwzexyvznlzq.supabase.co';
  const key='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  const url=base+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40';
  try{
    const r=await fetch(url,{headers:{apikey:key,'Cache-Control':'no-cache'}});
    const body=await r.text();
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
    res.statusCode=r.ok?200:502;
    return res.end(r.ok?body:JSON.stringify({error:'feed',status:r.status}));
  }catch(e){
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.statusCode=500;
    return res.end(JSON.stringify({error:'server'}));
  }
};