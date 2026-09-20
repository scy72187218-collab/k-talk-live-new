module.exports = async function handler(req,res){
  if(req.method!=='GET'){
    res.statusCode=405;
    res.setHeader('Allow','GET');
    return res.end('Method Not Allowed');
  }

  const ctl=new AbortController();
  const timer=setTimeout(()=>ctl.abort(),5000);

  try{
    const upstream=await fetch(
      'https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-video-feed',
      {
        signal:ctl.signal,
        headers:{'x-ktalk-feed':'shared-public-v1'}
      }
    );
    clearTimeout(timer);

    const body=await upstream.text();
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');

    if(!upstream.ok){
      console.log('ktalk-video-feed upstream',upstream.status,body.slice(0,200));
      res.statusCode=502;
      return res.end(JSON.stringify({error:'feed',status:upstream.status}));
    }

    res.statusCode=200;
    return res.end(body);
  }catch(e){
    clearTimeout(timer);
    console.log('ktalk-video-feed error',String(e&&e.message||e));
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.statusCode=504;
    return res.end(JSON.stringify({error:'timeout'}));
  }
};