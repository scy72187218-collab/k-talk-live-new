/* K-Talk creator automatic youth beauty. */
(function(){
  if(window.__ktCreatorAutoYouthBeauty20261002)return;
  window.__ktCreatorAutoYouthBeauty20261002=true;
  function setDefaults(){
    try{
      if(!window.state)return;
      state.beautyOn=true;
      state.beautyMode='natural';
      state.beautySkin=78;
      state.beautyWrinkle=85;
      state.beautyBright=68;
      state.beautyTone=64;
      state.beautySharp=58;
      state.beautyFace=56;
      state.beautyEyes=57;
      state.beautyNose=53;
      state.beautyMouth=52;
      state.beautyJaw=56;
      state.beautyMakeup=60;
    }catch(e){}
  }
  function applyYouthLook(){
    setDefaults();
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('beauty-on','beauty-natural');
    }catch(e){}
    try{if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();}catch(e){}
    try{
      var camera=document.getElementById('camera');
      if(camera){
        camera.style.setProperty('filter','brightness(1.135) saturate(1.060) contrast(.965) blur(.48px) sepia(.018)','important');
      }
    }catch(e){}
  }
  function wrapAsync(name,delay){
    try{
      var old=window[name];
      if(typeof old!=='function'||old.__ktYouthWrapped)return;
      var fn=async function(){
        var out=await old.apply(this,arguments);
        setTimeout(applyYouthLook,delay||30);
        setTimeout(applyYouthLook,180);
        return out;
      };
      fn.__ktYouthWrapped=true;
      window[name]=fn;
    }catch(e){}
  }
  wrapAsync('openCreator',40);
  wrapAsync('ensureLiveCamera',40);
  try{
    var oldStart=window.ktStartLiveRoomNow;
    if(typeof oldStart==='function'&&!oldStart.__ktYouthWrapped){
      var start=function(){applyYouthLook();return oldStart.apply(this,arguments);};
      start.__ktYouthWrapped=true;
      window.ktStartLiveRoomNow=start;
    }
  }catch(e){}
  applyYouthLook();
  [80,250,700].forEach(function(ms){setTimeout(applyYouthLook,ms);});
})();