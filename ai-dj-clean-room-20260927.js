/* K-Talk clean AI DJ room rebuild */
(function(){
  if(window.__ktAiDjCleanRoomLoaded20260927)return;
  window.__ktAiDjCleanRoomLoaded20260927=true;

  var KEY='kt_ai_dj_clean_selected_20260927';
  var active=false,greeted={};

  function selected(){try{return localStorage.getItem(KEY)==='1';}catch(e){return false;}}
  function setSelected(on){
    try{on?localStorage.setItem(KEY,'1'):localStorage.removeItem(KEY);}catch(e){}
    try{
      if(!window.state)window.state={};
      state.ktAiDjRoom=!!on;
      if(on){
        state.liveRoomType='group9';
        state.liveRoomName='AI DJ 음악방';
        state.liveRoomMax=6;
        state.prepRoomType='group9';
        state.prepRoomName='AI DJ 음악방';
        state.prepRoomMax=6;
      }
    }catch(e){}
  }

  function ensureButton(){
    var row=document.querySelector('.live-prep .kt-room-bottom5')||document.querySelector('.live-prep .room-switches');
    if(!row)return;
    var b=document.getElementById('ktAiDjCleanPick20260927');
    if(!b){
      b=document.createElement('button');b.type='button';b.id='ktAiDjCleanPick20260927';b.className='kt-ai-dj-clean-pick';b.textContent='🎧 AI DJ';row.appendChild(b);
      b.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(_e){}
        document.querySelectorAll('.live-prep .room-switch,.kt-ai-dj-clean-pick').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');setSelected(true);
        var t=document.getElementById('liveTitle');if(t)t.value='AI DJ 음악방';
      },true);
    }
    b.classList.toggle('on',selected());
    if(!document.getElementById('ktAiDjCleanPickStyle')){
      var s=document.createElement('style');s.id='ktAiDjCleanPickStyle';
      s.textContent='.kt-ai-dj-clean-pick{min-height:48px;border:1px solid #3a3a42;border-radius:16px;background:#1b1b20;color:#fff;font-weight:900;position:relative}.kt-ai-dj-clean-pick.on{background:linear-gradient(135deg,#ff2f8c,#8a4cff);outline:2px solid #ff62d0;box-shadow:0 0 14px #ff3fb177}.kt-ai-dj-clean-pick.on:after{content:"";position:absolute;right:8px;top:7px;width:9px;height:9px;border-radius:50%;background:#ff2424;box-shadow:0 0 9px #ff2424}';
      document.head.appendChild(s);
    }
  }

  document.addEventListener('click',function(e){
    var x=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(x){setSelected(false);var b=document.getElementById('ktAiDjCleanPick20260927');if(b)b.classList.remove('on');}
  },true);

  function bars(){var s='';for(var i=0;i<28;i++)s+='<i></i>';return s;}

  function render(){
    if(!active)return;
    var screen=document.getElementById('screen');if(!screen)return;
    var dj='';try{dj=window.KT_AI_DJ_PHOTO||'';}catch(e){}
    screen.innerHTML=''
    +'<style>#screen{padding:0!important;margin:0!important;height:100dvh!important;background:#020205!important;overflow:hidden!important}.bottom{display:none!important}.ktdj{height:100dvh;display:flex;flex-direction:column;gap:4px;padding:4px 6px;background:#020205;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}.ktdj-h{flex:0 0 54px;display:flex;align-items:center;gap:8px;border:1px solid #ffffff18;border-radius:14px;background:#101015;padding:0 8px}.ktdj-h b{font-size:17px}.ktdj-h .brand{margin-left:auto;color:#ff477d;font-weight:950}.ktdj-a{flex:0 0 28px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:900}.ktdj-a .on{color:#ff315f}.ktdj-a em{margin-left:auto;font-style:normal;color:#8fe8ff}.ktdj-t{flex:0 0 34px;display:grid;grid-template-columns:1fr 1fr;gap:4px}.ktdj-t div{display:grid;place-items:center;border:1px solid #ff3bc766;border-radius:9px;background:#150915;font-size:9px;font-weight:900}.ktdj-m{flex:1;min-height:0;display:grid;grid-template-columns:38% 62%;gap:4px}.ktdj-dj{position:relative;border:1px solid #ff3bc788;border-radius:10px;overflow:hidden;background:#120714}.ktdj-photo{position:absolute;inset:0;background:center/cover no-repeat}.ktdj-name{position:absolute;left:6px;top:6px;padding:4px 7px;border-radius:999px;background:#160b16dd;border:1px solid #ff5ccc88;color:#ffe46e;font-size:8px;font-weight:950}.ktdj-wave{position:absolute;left:6px;right:6px;bottom:6px;height:32px;display:flex;align-items:end;gap:2px}.ktdj-wave i{flex:1;height:20px;border-radius:3px;background:#ff3cc9;animation:w .7s ease-in-out infinite alternate}.ktdj-wave i:nth-child(3n+2){height:31px;background:#2bdcff}.ktdj-wave i:nth-child(3n){height:13px;background:#ffd93e}@keyframes w{from{transform:scaleY(.4)}to{transform:scaleY(1)}}.ktdj-g{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);gap:4px}.ktdj-s{position:relative;border:1px solid #ffffff25;border-radius:9px;background:#15151a;display:grid;place-items:center;color:#bbb;font-size:8px}.ktdj-n{position:absolute;left:4px;top:4px;width:18px;height:18px;border-radius:5px;background:#ff9719;color:#fff;display:grid;place-items:center;font-weight:950}.ktdj-b{flex:0 0 122px;display:grid;grid-template-columns:43% 57%;gap:4px}.ktdj-chat,.ktdj-gifts{border:1px solid #ffffff20;border-radius:10px;background:#0d0d12;padding:5px}.ktdj-chat h5,.ktdj-gifts h5{margin:0 0 4px;font-size:8px;color:#ff72d7}.ktdj-chat div{font-size:7px;line-height:1.4;color:#ddd}.ktdj-input{margin-top:5px;height:25px;border:1px solid #ffffff22;border-radius:7px;display:flex;align-items:center;padding:0 6px;color:#999;font-size:7px}.ktdj-gifts{display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:auto repeat(2,1fr);gap:3px}.ktdj-gifts h5{grid-column:1/-1;text-align:center;color:#ffe16b}.ktdj-gift{border:1px solid #ffffff22;border-radius:7px;background:#141419;color:#fff;display:grid;place-items:center;font-size:7px;font-weight:900;padding:2px}.ktdj-gift i{font-style:normal;font-size:18px}.ktdj-tools{flex:0 0 46px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.ktdj-tools button{border:0;background:none;color:#fff;font-size:7px;font-weight:900}.ktdj-tools i{display:block;margin:auto;width:29px;height:29px;border-radius:50%;background:#121218;border:1px solid #35363d;font-style:normal;font-size:14px;line-height:29px}</style>'
    +'<section class="ktdj"><div class="ktdj-h"><button onclick="ktAiDjCleanLeave20260927()">‹</button><b>● AI DJ 방</b><span class="brand">K-Talk LIVE</span></div>'
    +'<div class="ktdj-a"><span class="on">● ON AIR</span><span>AI MUSIC</span><em>🔓 공개 · 총 6명</em></div>'
    +'<div class="ktdj-t"><div>⭐ 출석체크 눌러주세요 ⭐</div><div>🎵 신청곡 · AI DJ에게 말해 주세요</div></div>'
    +'<div class="ktdj-m"><div class="ktdj-dj"><div class="ktdj-photo" style="background-image:url(&quot;'+dj+'&quot;)"></div><span class="ktdj-name">🎧 K-Talk AI DJ</span><div class="ktdj-wave">'+bars()+'</div></div>'
    +'<div class="ktdj-g">'
    +'<div class="ktdj-s"><span class="ktdj-n">1</span>게스트 1</div><div class="ktdj-s"><span class="ktdj-n">2</span>게스트 2</div><div class="ktdj-s"><span class="ktdj-n">3</span>게스트 3</div><div class="ktdj-s"><span class="ktdj-n">4</span>게스트 4</div><div class="ktdj-s"><span class="ktdj-n">5</span>게스트 5</div><div class="ktdj-s">DJ방</div></div></div>'
    +'<div class="ktdj-b"><div class="ktdj-chat"><h5>채팅</h5><div>AI DJ 음악방에 오신 것을 환영합니다.</div><div>신청곡은 말하기 또는 신청곡 버튼을 이용하세요.</div><div class="ktdj-input">메시지를 입력하세요…</div></div>'
    +'<div class="ktdj-gifts"><h5>🎁 선물 / 후원</h5>'
    +'<button class="ktdj-gift" onclick="openGifts()"><i>🌹</i>장미</button><button class="ktdj-gift" onclick="openGifts()"><i>💗</i>하트</button><button class="ktdj-gift" onclick="openGifts()"><i>⭐</i>별</button><button class="ktdj-gift" onclick="openGifts()"><i>🎈</i>풍선</button><button class="ktdj-gift" onclick="openGifts()"><i>🎤</i>마이크</button><button class="ktdj-gift" onclick="openGifts()"><i>🧸</i>곰인형</button><button class="ktdj-gift" onclick="openGifts()"><i>💍</i>반지</button><button class="ktdj-gift" onclick="openGifts()"><i>🎂</i>케이크</button><button class="ktdj-gift" onclick="openGifts()"><i>👑</i>왕관</button><button class="ktdj-gift" onclick="openGifts()"><i>🎁</i>선물상자</button></div></div>'
    +'<div class="ktdj-tools"><button onclick="if(window.ktAiDjOpenRequest20260927)ktAiDjOpenRequest20260927()"><i>🎵</i>신청곡</button><button onclick="if(window.ktAiDjVoiceSongRequest20260927)ktAiDjVoiceSongRequest20260927()"><i>🎤</i>말하기</button><button onclick="openGifts()"><i>🌹</i>장미</button><button onclick="openGifts()"><i>🎁</i>선물</button><button onclick="shareApp()"><i>↗</i>공유</button><button><i>✨</i>효과</button><button><i>•••</i>더보기</button></div></section>';
  }

  window.ktAiDjCleanLeave20260927=function(){active=false;setSelected(false);try{if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard();}catch(e){}};

  function guestInfo(e){
    var d=e&&e.detail||{},id=String(d.viewer_id||d.viewerId||'').trim(),name=String(d.name||d.nickname||'').trim();
    if(!name&&id)try{name=String((window.__ktApprovedGuestNames20260924||{})[id]||'').trim();}catch(_e){}
    if(!name)name='게스트';return {id:id||name,name:name};
  }
  function greet(e){
    if(!active)return;var g=guestInfo(e);if(greeted[g.id])return;greeted[g.id]=1;
    var msg=g.name+'님, 안녕하세요. K-Talk AI DJ 방에 오신 걸 환영합니다. 만나서 반갑습니다요. 편하게 즐기시고, 듣고 싶은 노래가 있으면 말씀해 주세요.';
    try{if(window.ktSpeak)window.ktSpeak(msg);}catch(_e){}
  }
  ['kt-any-guest-approved','kt-guest-approval-received','kt-approved-guest-stream-ready'].forEach(function(n){window.addEventListener(n,greet);});

  function hookStart(){
    if(typeof window.startBroadcast!=='function'||window.startBroadcast.__ktAiDjCleanWrapped)return;
    var prev=window.startBroadcast;
    var fn=async function(){
      var ai=selected();if(ai){active=true;setSelected(true);}
      var out=await prev.apply(this,arguments);
      if(ai){active=true;render();[80,200,500,1000].forEach(function(ms){setTimeout(function(){if(active&&!document.querySelector('.ktdj'))render();},ms);});}
      return out;
    };
    fn.__ktAiDjCleanWrapped=true;window.startBroadcast=fn;
  }

  try{new MutationObserver(function(){if(active&&!document.querySelector('#screen .ktdj')){clearTimeout(window.__ktDjCleanGuard);window.__ktDjCleanGuard=setTimeout(render,40);}}).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}

  function tick(){ensureButton();hookStart();}
  tick();[100,300,700,1400,2500].forEach(function(ms){setTimeout(tick,ms);});setInterval(tick,900);
})();