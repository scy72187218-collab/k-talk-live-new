module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }

  const base='https://zupwbfmacwzexyvznlzq.supabase.co';
  const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  const url=base+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40';

  try{
    const r=await fetch(url,{
      headers:{apikey:key,Authorization:'Bearer '+key,'Cache-Control':'no-cache'}
    });
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