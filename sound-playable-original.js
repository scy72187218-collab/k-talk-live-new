/* K-Talk sound picker: CC0 Korean vocal songs. Only the sound list is changed. */
(function(){
  if(window.__ktPlayableOriginalSoundsInstalled)return;
  window.__ktPlayableOriginalSoundsInstalled=true;

  function commonsOriginal(filename){
    return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(filename);
  }

  var defs=[
    {name:'부산항구는',artist:'양승만',file:'02 양승만-부산항구는 (Dm) AR stereo 2023.wav'},
    {name:'해변의 연인',artist:'양승만',file:'05 양승만-해변의연인 (C) AR stereo.wav'},
    {name:'비 오는 거리에서',artist:'양승만',file:'06 양승만-비오는거리에서 (Dm) AR stereo.wav'},
    {name:'백년해로',artist:'양승만',file:'07 양승만-백년해로 (Dm)남 AR stereo.wav'},
    {name:'할미꽃 사랑',artist:'양승만',file:'10 양승만-할미꽃사랑 (Em) AR stereo 2022.wav'}
  ];

  function resolveSmallAudio(track){
    var api='https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&prop=videoinfo&viprop=derivatives&titles='+encodeURIComponent('File:'+track.file);
    return fetch(api).then(function(r){return r.json();}).then(function(j){
      var pages=j&&j.query&&j.query.pages?j.query.pages:{};
      var keys=Object.keys(pages);
      if(!keys.length)return;
      var vi=pages[keys[0]]&&pages[keys[0]].videoinfo&&pages[keys[0]].videoinfo[0];
      var ds=vi&&vi.derivatives||[];
      var pick=null;
      for(var i=0;i<ds.length;i++){
        var d=ds[i]||{};
        var src=String(d.src||'');
        var type=String(d.type||'');
        if(type==='audio/mpeg'||/\.mp3(?:$|\?)/i.test(src)){pick=src;break;}
      }
      if(!pick){
        for(var k=0;k<ds.length;k++){
          var d2=ds[k]||{};
          var src2=String(d2.src||'');
          var type2=String(d2.type||'');
          if(type2.indexOf('audio/')===0||/\.(ogg|oga)(?:$|\?)/i.test(src2)){pick=src2;break;}
        }
      }
      if(pick)track.url=pick;
    }).catch(function(){});
  }

  function install(){
    if(typeof window.renderCreatorSoundList!=='function')return false;

    window.ktCreatorTracks=defs.map(function(d){
      return {
        name:d.name,
        source:d.artist+' · 가수 보컬 · CC0 자유이용 음원',
        time:'',
        url:commonsOriginal(d.file),
        searchOnly:false,
        file:d.file,
        artist:d.artist
      };
    });

    window.ktCreatorTracks.forEach(function(t){
      resolveSmallAudio(t).then(function(){
        try{window.renderCreatorSoundList('');}catch(e){}
      });
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
        if((txt.indexOf('이 곡은 K-Talk에서 바로 재생할 정식 음원 연결')!==-1 || txt.indexOf('정식 음원 연결이 아직 없습니다')!==-1) && el.children.length<=3){
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
})();
