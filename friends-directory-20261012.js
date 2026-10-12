/* Friends discovery only; reuse existing identity, follow and live entry providers. */
(function(){
  'use strict';
  if(window.__ktFriendsDirectory20261012)return;
  window.__ktFriendsDirectory20261012=true;
  var people=[],view='all',query='',generation=0,busy=false,entering=false,pending=new Set();
  var liveSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.kt-remote-live';
  function page(){return document.querySelector('#screen .kt-friends-directory');}
  function el(tag,cls,value){var n=document.createElement(tag);n.className=cls;if(value!==undefined)n.textContent=value;return n;}
  function button(label,fn,cls){var b=el('button',cls||'',label);b.type='button';b.onclick=fn;return b;}
  function note(message){var n=page()&&page().querySelector('[role="status"]');if(n)n.textContent=message;}
  function style(){
    if(document.getElementById('ktFriendsDirectoryStyle'))return;
    var s=el('style','');s.id='ktFriendsDirectoryStyle';
    s.textContent='#screen .kt-friends-directory{box-sizing:border-box;min-height:calc(100dvh - 78px);padding:22px 16px 96px;background:#0a0a11;color:#fff;font-family:system-ui}#screen .kt-friends-directory button,#screen .kt-friends-directory input{font:inherit}#screen .kt-friends-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}#screen .kt-friends-heading h1{font-size:26px;margin:0}#screen .kt-friends-heading button{border:1px solid #363344;border-radius:12px;padding:9px 12px;background:#191722;color:#fff}#screen .kt-friends-subtitle{color:#b4afc1;font-size:13px;margin:10px 0 20px}#screen .kt-friends-live-rail{display:flex;overflow-x:auto;gap:12px;padding:4px 2px 16px;scrollbar-width:none}#screen .kt-friends-signal{flex:0 0 106px;min-width:106px;color:#fff;background:none;border:0;padding:0;text-align:left;cursor:pointer}#screen .kt-friends-signal-art{position:relative;display:grid;place-items:center;width:100%;height:104px;box-sizing:border-box;border:2px solid #388dff;border-radius:20px;background:linear-gradient(145deg,#14294a,#101523);overflow:hidden;font-size:35px;font-weight:900}#screen .kt-friends-signal.live .kt-friends-signal-art{border-color:#ff365f;background:linear-gradient(145deg,#4a172d,#1c111c)}#screen .kt-friends-signal-art img{width:100%;height:100%;object-fit:cover}#screen .kt-friends-signal-label{position:absolute;left:5px;right:5px;bottom:6px;background:#14335de8;border-radius:8px;font-size:10px;padding:5px;text-align:center}#screen .live .kt-friends-signal-label{background:#d81f50ef}#screen .kt-friends-signal-name{display:block;font-size:12px;margin-top:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#screen .kt-friends-legend{display:flex;gap:16px;color:#c7c2cf;font-size:12px;margin:0 0 20px}#screen .kt-friends-filter{display:flex;gap:7px;margin:0 0 14px;overflow-x:auto}#screen .kt-friends-filter button{white-space:nowrap;border:1px solid #302b3c;border-radius:12px;padding:9px 13px;background:#17141e;color:#c9c3d3}#screen .kt-friends-filter button[aria-pressed="true"]{background:#e72d82;color:#fff;border-color:#e72d82}#screen .kt-friends-search{width:100%;box-sizing:border-box;height:44px;border:1px solid #383144;background:#15121d;color:#fff;border-radius:13px;padding:0 14px;margin-bottom:16px}#screen .kt-friends-person-list{display:grid;gap:10px}#screen .kt-friends-person{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:11px;align-items:center;padding:13px 10px;border:1px solid #282331;border-radius:17px;background:#121018}#screen .kt-friends-avatar{width:50px;height:50px;display:grid;place-items:center;border-radius:14px;overflow:hidden;background:#243047;color:#fff;font-size:23px;font-weight:bold}#screen .kt-friends-avatar img{width:100%;height:100%;object-fit:cover}#screen .kt-friends-person-info{min-width:0}#screen .kt-friends-person-info strong{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:15px}#screen .kt-friends-person-info small{display:block;margin-top:5px;font-size:11px;color:#74adff}#screen .kt-friends-person.live small{color:#ff688a}#screen .kt-friends-person-actions{display:grid;gap:6px;min-width:80px}#screen .kt-friends-person-actions button{border:0;border-radius:10px;padding:8px 10px;background:#292231;color:#fff;font-size:12px;font-weight:800}#screen .kt-friends-person-actions .kt-follow-action{background:#e72d82}#screen .kt-friends-person-actions .following{background:#343044}#screen .kt-friends-person-actions button:disabled{opacity:.55}#screen .kt-friends-empty{padding:28px 12px;text-align:center;color:#aca5b8;font-size:13px;line-height:1.7}#screen .kt-friends-directory [role="status"]{min-height:18px;font-size:12px;color:#e3b7ca;margin-top:12px}#screen .kt-friends-directory dialog{max-width:340px;width:calc(100% - 56px);box-sizing:border-box;background:#17111f;color:white;border:1px solid #51415f;border-radius:20px;padding:24px}#screen .kt-friends-directory dialog::backdrop{background:#000a}#screen .kt-friends-directory dialog button{width:100%;padding:12px;margin-top:10px;border:0;border-radius:12px;background:#d9297a;color:#fff}#screen .kt-friends-directory dialog input{width:100%;box-sizing:border-box;padding:10px;color:#fff;background:#08070b;border:1px solid #57465e;border-radius:8px}@media(min-width:800px){#screen .kt-friends-directory{padding-left:max(24px,calc((100% - 760px)/2));padding-right:max(24px,calc((100% - 760px)/2))}}';
    document.head.appendChild(s);
  }
  function avatar(p,cls){var a=el('span',cls,(p.name||'K').charAt(0));if(/^https:\/\//i.test(p.photo||'')){var i=el('img','');i.src=p.photo;i.alt='';i.loading='lazy';i.onerror=function(){i.remove();};a.textContent='';a.appendChild(i);}return a;}
  async function enter(p){
    if(!p.live)return details(p);
    if(entering)return;
    if(typeof window.ktEnterRemoteLive!=='function')return note('방송 연결을 준비 중입니다. 잠시 후 다시 눌러 주세요.');
    entering=true;
    try{document.querySelectorAll('.kt-public-video,#homeVideo').forEach(function(v){v.pause();});await window.ktEnterRemoteLive(p.id);}catch(e){note('방송 입장을 다시 시도해 주세요.');}finally{entering=false;}
  }
  async function follow(p,b){
    if(pending.has(p.id))return;pending.add(p.id);b.disabled=true;note('');
    try{
      if(typeof window.ktFriendsChangeFollow!=='function')throw Error('provider');
      var desired=!p.following,ok=await window.ktFriendsChangeFollow(p.id,p.name,desired);
      if(!ok)throw Error('save');p.following=desired;p.friend=desired&&p.followsMe;pending.delete(p.id);draw();note(desired?'팔로우했습니다.':'팔로우를 취소했습니다.');
    }catch(e){note('팔로우를 저장하지 못했습니다. 다시 눌러 주세요.');}
    finally{pending.delete(p.id);if(b.isConnected)b.disabled=false;}
  }
  function shareUrl(p){var u=new URL('/',location.origin);u.searchParams.set('kt_live_host',p.id);return u.href;}
  async function share(p){
    var url=shareUrl(p),data={title:p.name+' · K-Talk LIVE',text:p.name+'님의 방송에 함께 들어오세요.',url:url};
    try{
      if(navigator.share){await navigator.share(data);return;}
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(url);note('방송 주소를 복사했습니다. 카카오톡 등에 붙여 넣어 초대하세요.');return;}
    }catch(e){if(e.name==='AbortError')return;}
    var root=page();if(!root)return;var d=el('dialog','');d.appendChild(el('h2','','방송 공유·초대'));var input=el('input','');input.value=url;input.readOnly=true;input.setAttribute('aria-label','공유할 방송 주소');d.appendChild(input);d.appendChild(button('닫기',function(){d.close();d.remove();}));root.appendChild(d);d.showModal();input.select();
  }
  function details(p){var root=page();if(!root)return;var d=el('dialog','');d.appendChild(el('h2','',p.name));d.appendChild(el('p','','현재 방송 중이 아닙니다. 팔로우하면 이 목록에서 다시 확인할 수 있습니다.'));var b=button(p.following?'팔로잉 취소':'팔로우',function(){follow(p,b);d.close();d.remove();});d.appendChild(b);d.appendChild(button('닫기',function(){d.close();d.remove();}));root.appendChild(d);d.showModal();}
  function draw(){
    var root=page();if(!root)return;
    var rail=root.querySelector('.kt-friends-live-rail'),list=root.querySelector('.kt-friends-person-list');
    rail.replaceChildren();list.replaceChildren();
    people.slice(0,40).forEach(function(p){
      var tile=button('',function(){enter(p);},'kt-friends-signal '+(p.live?'live':'offline'));
      tile.setAttribute('aria-label',p.name+' · '+(p.live?'방송 중, 입장':'방송 안 함, 정보 보기'));
      var art=avatar(p,'kt-friends-signal-art');art.appendChild(el('span','kt-friends-signal-label',p.live?'● 방송 중':'■ 방송 안 함'));tile.appendChild(art);tile.appendChild(el('span','kt-friends-signal-name',p.name));rail.appendChild(tile);
    });
    if(!people.length)rail.appendChild(el('p','kt-friends-empty','아직 표시할 사람이 없습니다.'));
    var filtered=people.filter(function(p){return (!query||p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))&&(view==='all'||(view==='following'&&p.following)||(view==='friends'&&p.friend));});
    filtered.forEach(function(p){
      var row=el('article','kt-friends-person '+(p.live?'live':'offline'));row.dataset.personId=p.id;row.appendChild(avatar(p,'kt-friends-avatar'));
      var info=el('div','kt-friends-person-info');info.appendChild(el('strong','',p.name));info.appendChild(el('small','',(p.live?'● 방송 중':'■ 방송 안 함')+(p.friend?' · 친구':p.following?' · 팔로잉':'')));row.appendChild(info);
      var actions=el('div','kt-friends-person-actions');var b=button(p.friend?'친구 ✓':p.following?'팔로잉 ✓':'+ 팔로우',function(){follow(p,b);},'kt-follow-action '+(p.following?'following':''));b.disabled=pending.has(p.id);b.setAttribute('aria-label',p.name+' '+(p.following?'팔로우 취소':'팔로우'));actions.appendChild(b);
      if(p.live){actions.appendChild(button('방송 입장',function(){enter(p);}));actions.appendChild(button('공유·초대',function(){share(p);}));}
      row.appendChild(actions);list.appendChild(row);
    });
    if(!filtered.length)list.appendChild(el('p','kt-friends-empty',view==='friends'?'서로 팔로우하면 친구로 표시됩니다.':query?'검색 결과가 없습니다.':'팔로우할 사람들이 여기에 표시됩니다.'));
  }
  async function refresh(){
    var root=page();if(!root||busy||pending.size||document.hidden)return;
    busy=true;var token=generation;
    try{
      if(typeof window.ktFriendsDirectoryData!=='function')throw Error('provider');
      var next=await window.ktFriendsDirectoryData();
      if(token!==generation||page()!==root||pending.size)return;
      people=Array.isArray(next)?next:[];draw();note('');
    }catch(e){if(page()===root)note('사람 목록을 불러오지 못했습니다. 새로고침을 눌러 주세요.');}
    finally{busy=false;}
  }
  function open(){
    generation++;query='';view='all';style();var screen=document.getElementById('screen');if(!screen)return;
    document.body.classList.remove('kt-home','kt-video-mode');
    var root=el('section','kt-friends-directory');
    var head=el('div','kt-friends-heading');head.appendChild(el('h1','','친구 · 방송'));head.appendChild(button('새로고침',refresh));root.appendChild(head);
    root.appendChild(el('p','kt-friends-subtitle','방송을 발견하고, 팔로우하고, 함께 들어가세요.'));
    root.appendChild(el('div','kt-friends-live-rail'));
    root.appendChild(el('div','kt-friends-legend','🔴 방송 중   🔵 방송 안 함'));
    var filters=el('div','kt-friends-filter');[['all','사람 목록'],['following','팔로잉'],['friends','친구']].forEach(function(pair){var b=button(pair[1],function(){view=pair[0];filters.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});draw();});b.setAttribute('aria-pressed',String(view===pair[0]));filters.appendChild(b);});root.appendChild(filters);
    var search=el('input','kt-friends-search');search.type='search';search.placeholder='이름으로 사람 찾기';search.setAttribute('aria-label','이름으로 사람 찾기');search.oninput=function(){query=search.value.trim();draw();};root.appendChild(search);
    root.appendChild(el('div','kt-friends-person-list'));var status=el('p','','사람 목록을 불러오는 중…');status.setAttribute('role','status');status.setAttribute('aria-live','polite');root.appendChild(status);
    screen.replaceChildren(root);draw();refresh();
  }
  function install(){
    var previous=window.friends;if(typeof previous!=='function'||previous.__ktFriendsDirectory)return;
    var wrapped=function(){var result=previous.apply(this,arguments);open();return result;};wrapped.__ktFriendsDirectory=true;window.friends=wrapped;
  }
  // Invitation opens a confirmation page; it never bypasses existing access checks.
  function invite(){
    var id=new URLSearchParams(location.search).get('kt_live_host');if(!id||id.length>80||document.getElementById('ktFriendsInvitePrompt'))return;
    if(document.querySelector('#screen '+liveSelector.split(',').join(',#screen ')))return;
    var d=el('dialog','');d.id='ktFriendsInvitePrompt';d.appendChild(el('h2','','K-Talk 방송 초대'));d.appendChild(el('p','','초대받은 방송으로 들어가시겠어요?'));
    d.appendChild(button('방송 들어가기',async function(){d.close();d.remove();await enter({id:id,live:true});}));d.appendChild(button('나중에',function(){d.close();d.remove();}));document.body.appendChild(d);d.showModal();
  }
  install();setTimeout(invite,700);
  setInterval(function(){install();if(page())refresh();},10000);
  window.addEventListener('focus',function(){if(page())refresh();});
})();