/* K-Talk premium gift host-face overlay (2026-09-27)
   Large gifts (existing premium threshold) show the same gift art over the host face/tile for 5 seconds.
   This only changes the premium gift visual; gift accounting/network logic is untouched. */
(function(){
  if(window.__ktPremiumGiftHostFace5s20260927)return;
  window.__ktPremiumGiftHostFace5s20260927=true;

  function giftIcon(name){
    var icon='🎁';
    try{
      var list=window.ktalkGifts||[];
      for(var i=0;i<list.length;i++){
        if(String(list[i][0])===String(name)){
          icon=String(list[i][2]||icon);
          break;
        }
      }
    }catch(e){}
    return icon;
  }

  function hostTarget(){
    var selectors=[
      '.ktsolo-main',
      '.ktg13-host',
      '.ktg13-room[data-kt-room="9"] .ktg13-host',
      '.ktsubscriber-host',
      '.ktsecret-slot.host',
      '.ktsecret-host',
      '.kt-remote-live .kt-remote-host',
      '.kt-remote-live video'
    ];
    for(var i=0;i<selectors.length;i++){
      try{
        var el=document.querySelector(selectors[i]);
        if(el){
          var r=el.getBoundingClientRect();
          if(r.width>30&&r.height>30)return el;
        }
      }catch(e){}
    }
    return null;
  }

  function ensureStyle(){
    if(document.getElementById('ktPremiumGiftHostFace5sStyle'))return;
    var s=document.createElement('style');
    s.id='ktPremiumGiftHostFace5sStyle';
    s.textContent=''
      +'.kt-premium-hostface-gift{position:fixed;z-index:10035;pointer-events:none;display:grid;place-items:center;text-align:center;overflow:visible;animation:ktHostGift5s 5s ease both}'
      +'.kt-premium-hostface-gift .kt-hostgift-art{width:min(78%,180px);height:min(62%,160px);display:grid;place-items:center;font-size:min(18vw,92px);line-height:1;filter:drop-shadow(0 0 14px rgba(255,215,90,.9)) drop-shadow(0 8px 14px rgba(0,0,0,.55))}'
      +'.kt-premium-hostface-gift .kt-hostgift-art svg{width:100%;height:100%;display:block}'
      +'.kt-premium-hostface-gift .kt-hostgift-name{max-width:92%;margin-top:-4px;padding:5px 10px;border-radius:999px;background:rgba(10,8,14,.78);border:1px solid #ffd85f;color:#fff5a6;font-size:11px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 0 12px #ffca4f55}'
      +'.kt-premium-hostface-gift .kt-hostgift-from{max-width:92%;margin-top:3px;color:#fff;font-size:9px;font-weight:900;text-shadow:0 2px 5px #000}'
      +'@keyframes ktHostGift5s{0%{opacity:0;transform:scale(.45) translateY(8px)}10%{opacity:1;transform:scale(1.08) translateY(0)}18%,82%{opacity:1;transform:scale(1) translateY(0)}100%{opacity:0;transform:scale(1.06) translateY(-8px)}}';
    document.head.appendChild(s);
  }

  window.showPremiumGiftFx=function(name,cost,sender){
    ensureStyle();
    var old=document.getElementById('ktPremiumGiftFx');
    if(old)old.remove();

    var target=hostTarget();
    var rect=null;
    try{rect=target&&target.getBoundingClientRect?target.getBoundingClientRect():null;}catch(e){rect=null;}

    var wrap=document.createElement('div');
    wrap.id='ktPremiumGiftFx';
    wrap.className='kt-premium-hostface-gift';

    if(rect&&rect.width>30&&rect.height>30){
      var w=Math.max(110,Math.min(rect.width,260));
      var h=Math.max(110,Math.min(rect.height,260));
      wrap.style.left=(rect.left+(rect.width-w)/2)+'px';
      wrap.style.top=(rect.top+(rect.height-h)/2)+'px';
      wrap.style.width=w+'px';
      wrap.style.height=h+'px';
    }else{
      wrap.style.left='50%';
      wrap.style.top='50%';
      wrap.style.width='240px';
      wrap.style.height='240px';
      wrap.style.marginLeft='-120px';
      wrap.style.marginTop='-120px';
    }

    var art='';
    try{
      var type=typeof window.getPremiumGiftFxType==='function'
        ?window.getPremiumGiftFxType(name,cost):'';
      if(type&&typeof window.getPremiumGiftSvg==='function'){
        art=window.getPremiumGiftSvg(type)||'';
      }
    }catch(e){}
    if(!art)art=giftIcon(name);

    var who=sender?String(sender):'누군가';
    wrap.innerHTML=''
      +'<div class="kt-hostgift-art">'+art+'</div>'
      +'<div class="kt-hostgift-name">'+String(name||'큰 선물')+' · '+String(cost||'')+'개</div>'
      +'<div class="kt-hostgift-from">'+who+'님이 보냈습니다</div>';

    document.body.appendChild(wrap);
    setTimeout(function(){
      try{if(wrap&&wrap.parentNode)wrap.remove();}catch(e){}
    },5000);
    return true;
  };
})();
