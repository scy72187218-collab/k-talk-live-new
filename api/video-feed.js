module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }

  try{
    var host=String(req.headers&&req.headers.host||'').trim();
    if(!host)throw new Error('missing host');
    var proto=String(req.headers&&req.headers['x-forwarded-proto']||'https').split(',')[0].trim()||'https';

    /* Read the current publishable key from the already-deployed realtime file.
       This keeps video-feed in sync with the app without storing another stale key here. */
    var keyResp=await fetch(proto+'://'+host+'/direct-realtime-webrtc-20260922.js?v=feed-key-sync',{cache:'no-store'});
    if(!keyResp.ok)throw new Error('key source '+keyResp.status);
    var keyText=await keyResp.text();
    var m=keyText.match(/sb_publishable_[A-Za-z0-9_-]+/);
    if(!m)throw new Error('publishable key not found');
    var key=m[0];

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
