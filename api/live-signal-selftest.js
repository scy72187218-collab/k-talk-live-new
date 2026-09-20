module.exports=async function handler(req,res){
  const edge='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-live-signal';
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  const id='selftest_'+Date.now();
  try{
    const pub=await fetch(edge,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        action:'publish',
        host_id:id,
        host_name:'K-Talk Test',
        title:'signal test',
        room_type:'test',
        room_name:'test'
      })
    });
    const pubText=await pub.text();

    const get=await fetch(edge+'?t='+Date.now(),{cache:'no-store'});
    const getText=await get.text();

    const end=await fetch(edge,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'end',host_id:id})
    });
    const endText=await end.text();

    res.statusCode=200;
    return res.end(JSON.stringify({
      publish_status:pub.status,
      publish:pubText,
      get_status:get.status,
      get:getText,
      end_status:end.status,
      end:endText
    }));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({error:String(e&&e.message||e)}));
  }
};