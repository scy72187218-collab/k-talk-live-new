module.exports=async function handler(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  try{
    const base='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
    const url=base+'ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,active,started_at,updated_at&order=updated_at.desc&limit=20';
    const r=await fetch(url,{headers:{apikey:'sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3'}});
    const body=await r.text();
    res.statusCode=r.status;
    return res.end(body);
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({error:String(e&&e.message||e)}));
  }
};