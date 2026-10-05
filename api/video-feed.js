module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }

  try{
    var key=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
    if(!key)throw new Error('missing publishable key');

    var url='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/ktalk_videos'
      +'?select=id,author_name,title,video_url,created_at,likes'
      +'&order=created_at.desc&limit=40';

    var r=await fetch(url,{
      cache:'no-store',
      headers:{apikey:key}
    });
    if(!r.ok)throw new Error('feed '+r.status);

    var rows=await r.json();
    if(!Array.isArray(rows))rows=[];

    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store, max-age=0');
    res.statusCode=200;
    return res.end(JSON.stringify(rows));
  }catch(e){
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store, max-age=0');
    res.statusCode=200;
    return res.end('[]');
  }
};
