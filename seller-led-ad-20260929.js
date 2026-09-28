/* K-Talk 판매방송 LED 광고 스위치
   월 판매방송 판매자가 시작/종료 시간을 정하고, 10분마다 3회 LED 광고 노출
*/
(function(){
  if(window.__ktSellerLedAd20260929)return;
  window.__ktSellerLedAd20260929=true;

  var REF='zupwbfmacwzexyvznlzq';
  var APIKEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var PROFILE_KEY='ktalk_seller300_profile_v1';
  var AD_KEY='ktalk_seller_led_ad_v1';
  var remoteAd=null,lastRemoteId='',pollBusy=false,lastPostAt=0;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function isOwner(){try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){return false;}}
  function sellerProfile(){
    try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')||{};}catch(e){return {};}
  }
  function sellerAllowed(){
    var p=sellerProfile();
    return isOwner()||!!(p&&p.active&&Number(p.plan)===300000);
  }
  function readAd(){
    try{return JSON.parse(localStorage.getItem(AD_KEY)||'{}')||{};}catch(e){return {};}
  }
  function saveAd(x){try{localStorage.setItem(AD_KEY,JSON.stringify(x||{}));}catch(e){}}
  function toMin(s){
    var m=String(s||'').match(/^(\d{1,2}):(\d{2})$/);
    if(!m)return null;
    var h=Number(m[1]),n=Number(m[2]);
    if(h<0||h>23||n<0||n>59)return null;
    return h*60+n;
  }
  function inDailyRange(nowMin,start,end){
    if(start==null||end==null)return true;
    if(start===end)return true;
    if(start<end)return nowMin>=start&&nowMin<end;
    return nowMin>=start||nowMin<end;
  }
  function adActiveNow(ad){
    if(!ad||!ad.enabled)return false;
    var d=new Date(),nowMin=d.getHours()*60+d.getMinutes();
    var start=toMin(ad.startTime),end=toMin(ad.endTime);
    if(!inDailyRange(nowMin,start,end))return false;
    var startSec=(start==null?0:start*60);
    var nowSec=d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
    var delta=nowSec-startSec;
    if(delta<0)delta+=86400;
    var pos=((delta%600)+600)%600;
    /* 10분 안에 0초, 200초, 400초 지점에서 각각 30초 노출 */
    return (pos>=0&&pos<30)||(pos>=200&&pos<230)||(pos>=400&&pos<430);
  }
  function adText(ad){
    var bits=[];
    if(ad.shopName)bits.push(ad.shopName);
    if(ad.where)bits.push(ad.where);
    if(ad.message)bits.push(ad.message);
    return '📺 판매방송 · '+bits.join(' · ');
  }
  function hasTreasure(){
    try{return !!(window.ktGetTreasure&&window.ktGetTreasure());}catch(e){return false;}
  }
  function applyLed(ad){
    var led=document.getElementById('globalLed');
    if(!led||hasTreasure())return;
    if(adActiveNow(ad)){
      led.classList.add('kt-seller-led-ad-on');
      led.textContent=adText(ad);
      led.dataset.ktSellerLed='1';
    }else if(led.dataset.ktSellerLed==='1'){
      led.classList.remove('kt-seller-led-ad-on');
      led.removeAttribute('data-kt-seller-led');
      led.innerHTML='♛ K-Talk · 신곡 광고 신청하세요! 🎵 🎤';
    }
  }

  async function postAd(ad){
    if(!sellerAllowed())return;
    var now=Date.now();
    if(now-lastPostAt<8000)return;
    lastPostAt=now;
    var p=sellerProfile();
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:deviceId(),
          sender_id:'sellerled:'+deviceId(),
          sender_name:p.shopName||'판매자',
          message:JSON.stringify(ad||{}),
          message_type:'seller_led_ad'
        })
      });
    }catch(e){}
  }

  async function pollRemoteAd(){
    if(pollBusy)return;
    pollBusy=true;
    try{
      var since=new Date(Date.now()-25000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message,created_at'
        +'&message_type=eq.seller_led_ad'
        +'&created_at=gte.'+enc(since)
        +'&order=created_at.desc&limit=10';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY}});
      if(r&&r.ok){
        var rows=await r.json();
        var row=(rows||[])[0];
        if(row&&String(row.id)!==lastRemoteId){
          lastRemoteId=String(row.id||'');
          var x={};try{x=JSON.parse(row.message||'{}')||{};}catch(e){}
          remoteAd=x;
        }
      }
    }catch(e){}
    pollBusy=false;
  }

  window.ktSaveSellerLedAd20260929=function(){
    if(!sellerAllowed()){alert('월 30만원 판매방송 판매자 전용 기능입니다.');return false;}
    function v(id){var e=document.getElementById(id);return e?String(e.value||'').trim():'';}
    var on=document.getElementById('ktSellerLedOn20260929');
    var p=sellerProfile();
    var ad={
      enabled:!!(on&&on.checked),
      shopName:p.shopName||'',
      where:v('ktSellerLedWhere20260929'),
      message:v('ktSellerLedMessage20260929'),
      startTime:v('ktSellerLedStart20260929')||'09:00',
      endTime:v('ktSellerLedEnd20260929')||'22:00',
      hostId:deviceId(),
      updatedAt:Date.now()
    };
    if(ad.enabled&&!ad.message&&!ad.where){alert('어디서 무엇을 판매하는지 문구를 입력해 주세요.');return false;}
    saveAd(ad);postAd(ad);applyLed(ad);
    alert(ad.enabled?'LED 판매광고 스위치를 켰습니다. 10분마다 3번 표시됩니다.':'LED 판매광고 스위치를 껐습니다.');
    return false;
  };

  window.ktOpenSellerLedAd20260929=function(){
    if(!sellerAllowed()){
      if(window.showSheet)window.showSheet('🔒 판매자 전용','<div class="rowbox"><b>월 30만원 판매방송 판매자 전용 기능입니다.</b></div>');
      return false;
    }
    var a=readAd(),p=sellerProfile();
    var html='<div class="rowbox"><b>🛍️ 월 300,000원 판매방송 이용 안내</b><br>월 이용료 <strong>300,000원</strong>을 회사 사업자 계좌로 입금하고 판매자 등록·승인 후 사용하는 판매방송 혜택입니다.</div>'
      +'<div class="rowbox"><b>📺 LED 판매광고</b><br>어디서 무엇을 판매 중인지 LED 간판에 알립니다. 판매자가 직접 광고 시간을 정하고 스위치를 켜면 설정한 시간 동안 <strong>10분에 3번</strong> 자동으로 광고합니다.</div>'
      +'<div class="rowbox"><b>판매방송 혜택</b><br>상호명 · 사업자등록번호 · 전화번호 · 계좌번호 · 예금주 · 안내문구 표시<br>시청자 주문 자동 접수 · 주문목록 자동 정리 · 입금했다고 알림 · 판매자 실제 입금 확인 · 처리 완료 표시 · 주문 상세 크게 보기/캡처</div>'
      +'<div class="rowbox"><b>사용 순서</b><br>① 회사 사업자 계좌로 월 300,000원 입금<br>② 판매자 정보 등록 및 승인<br>③ 방송 시작 후 상품 판매<br>④ 주문은 화면 오른쪽에 자동 정리<br>⑤ 구매자가 입금했다고 알리면 판매자가 실제 통장을 확인<br>⑥ LED 광고 시간·문구 설정 후 스위치 ON</div>'
      +'<div class="rowbox"><b>광고 스위치</b><label style="display:flex;align-items:center;gap:8px;margin-top:8px"><input id="ktSellerLedOn20260929" type="checkbox" '+(a.enabled?'checked':'')+' style="width:22px;height:22px"><strong>LED 광고 사용</strong></label></div>'
      +'<div class="rowbox"><b>판매 위치 · 방송 이름</b><input id="ktSellerLedWhere20260929" value="'+esc(a.where||p.shopName||'')+'" placeholder="예: K-Talk 태권1 방송에서 판매 중" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>광고 문구</b><textarea id="ktSellerLedMessage20260929" placeholder="예: 오늘 의류 특가 판매 중 · 방송을 눌러 주문하세요" style="width:100%;min-height:70px;box-sizing:border-box;margin-top:6px;padding:9px">'+esc(a.message||'')+'</textarea></div>'
      +'<div class="rowbox"><b>광고 시간</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px"><label>시작<input id="ktSellerLedStart20260929" type="time" value="'+esc(a.startTime||'09:00')+'" style="width:100%;box-sizing:border-box;padding:9px"></label><label>종료<input id="ktSellerLedEnd20260929" type="time" value="'+esc(a.endTime||'22:00')+'" style="width:100%;box-sizing:border-box;padding:9px"></label></div><small>설정한 시간 안에서 10분마다 3번 자동 표시됩니다.</small></div>'
      +'<button class="act" onclick="ktSaveSellerLedAd20260929()">LED 광고 설정 저장</button>';
    if(window.showSheet)window.showSheet('📺 LED 판매광고 설정',html);
    return false;
  };

  function patchSellerCenter(){
    var old=window.openSellerCenter;
    if(typeof old!=='function'||old.__ktSellerLedPatched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-seller-led-entry-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-seller-led-entry-20260929';
          box.style.marginTop='8px';
          box.innerHTML='<b>🛍️ 월 300,000원 판매방송 혜택</b><br>회사 사업자 계좌로 월 300,000원을 입금하고 승인된 판매자는 상호명·전화번호·계좌번호·안내문구를 방송에 표시하고 주문을 자동으로 받을 수 있습니다. 주문은 오른쪽에 정리되고 입금알림·실제 입금확인·처리완료까지 관리합니다.<br><br><b>📺 LED 광고 스위치</b><br>판매자가 시작·종료 시간을 직접 정하고 LED 간판에 판매방송을 <strong>10분에 3번</strong> 자동으로 알릴 수 있습니다.<br><button class="act" style="margin-top:7px" onclick="ktOpenSellerLedAd20260929()">LED 광고 설정</button>';
          body.appendChild(box);
        }catch(e){}
      },30);
      return false;
    };
    fn.__ktSellerLedPatched=true;
    window.openSellerCenter=fn;
  }

  function hookLedClick(){
    var old=window.handleLedClick;
    if(typeof old!=='function'||old.__ktSellerLedPatched)return;
    var fn=function(){
      var ad=readAd();
      if(!sellerAllowed())ad=remoteAd||ad;
      if(adActiveNow(ad)){
        try{
          if(ad.hostId)sessionStorage.setItem('kt_remote_host_id',ad.hostId);
        }catch(e){}
        if(typeof window.ktOpenLiveOrderForm20260929==='function'){
          window.ktOpenLiveOrderForm20260929();
          return;
        }
      }
      return old.apply(this,arguments);
    };
    fn.__ktSellerLedPatched=true;
    window.handleLedClick=fn;
  }

  function tick(){
    patchSellerCenter();hookLedClick();
    var local=readAd();
    if(sellerAllowed()&&local.enabled){
      applyLed(local);
      if(Date.now()-lastPostAt>9000)postAd(local);
    }else{
      pollRemoteAd();
      if(remoteAd)applyLed(remoteAd);
    }
  }

  patchSellerCenter();hookLedClick();
  [200,600,1300,2500].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(tick,1000);
})();