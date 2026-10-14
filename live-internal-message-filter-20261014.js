/* Presentation/speech filter only. Does not discard transport events. */
(function(){
  if(window.ktIsInternalLiveMessage)return;
  window.ktIsInternalLiveMessage=function(message,type){
    type=String(type||'');
    if(/^(movie_mode|gift|host_gift:.*|guest_gift:.*|guest_offer:.*|guest_answer:.*|guest_ice:.*|offer|answer|ice|signal)$/.test(type))return true;
    var text=String(message||'').trim(),start=text.indexOf('{');
    if(start<0||text.charAt(text.length-1)!=='}')return false;
    try{
      var p=JSON.parse(text.slice(start));
      if(!p||typeof p!=='object'||Array.isArray(p))return false;
      return (typeof p.on==='boolean'&&('film_id' in p||'run' in p))||
        (typeof p.sdp==='string'&&/^(offer|answer)$/.test(p.type||''))||
        (typeof p.candidate==='string'&&('sdpMid' in p||'sdpMLineIndex' in p));
    }catch(e){return false;}
  };
})();

