/* K-Talk sound picker: built-in original instrumental loops that play inside K-Talk and can be recorded with video. */
(function(){
  if(window.__ktPlayableOriginalSoundsInstalled)return;
  window.__ktPlayableOriginalSoundsInstalled=true;

  var urls=[];

  function midi(n){return 440*Math.pow(2,(n-69)/12);}
  function clamp(v){return Math.max(-1,Math.min(1,v));}
  function putText(view,off,s){for(var i=0;i<s.length;i++)view.setUint8(off+i,s.charCodeAt(i));}

  function makeLoop(cfg){
    var sr=22050;
    var beats=16;
    var dur=beats*60/cfg.bpm;
    var count=Math.floor(sr*dur);
    var buf=new ArrayBuffer(44+count*2);
    var view=new DataView(buf);
    putText(view,0,'RIFF');view.setUint32(4,36+count*2,true);putText(view,8,'WAVE');
    putText(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);
    view.setUint32(24,sr,true);view.setUint32(28,sr*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);
    putText(view,36,'data');view.setUint32(40,count*2,true);

    var twoPi=Math.PI*2;
    var seq=cfg.seq;
    var roots=cfg.roots;
    var lcg=(cfg.seed||1)>>>0;
    for(var i=0;i<count;i++){
      var t=i/sr;
      var beat=t*cfg.bpm/60;
      var beatPos=beat-Math.floor(beat);
      var eighth=Math.floor(beat*2);
      var ep=(beat*2)-eighth;
      var bar=Math.floor(beat/4);
      var root=roots[bar%roots.length];
      var note=root+seq[eighth%seq.length];
      var f=midi(note);
      var leadEnv=Math.min(1,ep*14)*Math.exp(-2.8*ep);
      var lead=(Math.sin(twoPi*f*t)+0.32*Math.sin(twoPi*f*2*t))*leadEnv*0.27;

      var bassF=midi(root-12);
      var bassEnv=Math.min(1,beatPos*18)*Math.exp(-3.2*beatPos);
      var bass=Math.sin(twoPi*bassF*t)*bassEnv*0.24;

      var chordPhase=(beat*1.0)%1;
      var chordEnv=0.55+0.45*Math.cos(twoPi*chordPhase);
      var chord=(Math.sin(twoPi*midi(root)*t)+Math.sin(twoPi*midi(root+4)*t)+Math.sin(twoPi*midi(root+7)*t))*0.045*chordEnv;

      var kick=Math.sin(twoPi*(48+34*Math.exp(-11*beatPos))*t)*Math.exp(-14*beatPos)*0.36;
      var back=Math.abs((beat%4)-1)<0.05||Math.abs((beat%4)-3)<0.05;
      lcg=(1664525*lcg+1013904223)>>>0;
      var noise=((lcg/4294967295)*2-1);
      var snare=back?noise*Math.exp(-24*((beat%1)))*0.15:0;

      var hatPhase=(beat*2)%1;
      var hat=(Math.sin(twoPi*6200*t)>0?1:-1)*Math.exp(-28*hatPhase)*0.028;
      var v=(lead+bass+chord+kick+snare+hat)*(cfg.gain||0.9);
      var fade=Math.min(1,t/0.025,(dur-t)/0.025);
      v*=Math.max(0,fade);
      view.setInt16(44+i*2,Math.round(clamp(v)*32767),true);
    }
    return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));
  }

  function install(){
    if(typeof window.renderCreatorSoundList!=='function')return false;
    if(urls.length)return true;

    var defs=[
      {name:'신나는 트로트 연주',bpm:126,roots:[60,65,67,60],seq:[0,4,7,9,7,4,2,4,0,4,7,11,9,7,4,2],seed:11},
      {name:'밤거리 연주',bpm:104,roots:[57,60,64,62],seq:[0,3,7,10,7,5,3,0,0,5,8,10,8,5,3,2],seed:22},
      {name:'설렘 연주',bpm:116,roots:[62,67,64,69],seq:[0,4,7,4,9,7,4,2,0,2,4,7,11,9,7,4],seed:33},
      {name:'바다 드라이브',bpm:120,roots:[55,60,62,57],seq:[0,7,4,9,7,4,2,0,0,4,7,12,9,7,4,2],seed:44},
      {name:'별빛 댄스',bpm:132,roots:[64,60,67,62],seq:[0,3,7,10,12,10,7,3,0,5,8,12,10,8,5,3],seed:55}
    ];

    window.ktCreatorTracks=defs.map(function(d){
      var u=makeLoop(d);urls.push(u);
      return {name:d.name,source:'K-Talk 무료 연주곡 · 바로 재생',time:'',url:u,searchOnly:false};
    });

    try{window.renderCreatorSoundList('');}catch(e){}
    return true;
  }

  function hideOldNotice(){
    try{
      var all=document.querySelectorAll('div');
      for(var i=0;i<all.length;i++){
        var el=all[i];
        var txt=String(el.textContent||'').trim();
        if(txt.indexOf('이 곡은 K-Talk에서 바로 재생할 정식 음원 연결')!==-1 && el.children.length<=3){
          el.style.display='none';
        }
      }
    }catch(e){}
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(install()||tries>40)clearInterval(timer);
    hideOldNotice();
  },150);

  try{
    var ob=new MutationObserver(function(){hideOldNotice();});
    ob.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('beforeunload',function(){
    urls.forEach(function(u){try{URL.revokeObjectURL(u);}catch(e){}});
  });
})();
