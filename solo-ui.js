window.home=function(){
  const s=document.getElementById('screen');
  s.innerHTML=`<style>
  #screen{padding:0!important;height:100dvh!important;min-height:100dvh!important;background:#000!important;overflow:hidden!important}
  .approvedSolo{height:100dvh;display:flex;flex-direction:column;background:#050507;color:#fff;font-family:Arial,'Noto Sans KR',sans-serif;overflow:hidden}
  .approvedStage{position:relative;flex:1;min-height:0;overflow:hidden;background:#171319 url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=90') center 30%/cover no-repeat}
  .approvedStage:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12) 0%,rgba(0,0,0,.02) 35%,rgba(0,0,0,.55) 72%,rgba(0,0,0,.88) 100%);pointer-events:none}
  .approvedTop{position:absolute;z-index:6;top:14px;left:16px;right:16px;display:flex;align-items:center;gap:10px}
  .approvedAvatar{width:46px;height:46px;border-radius:50%;border:1px solid #ffffffaa;background:url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=90') center/cover}
  .approvedName{font-size:17px;font-weight:900;line-height:1.08;text-shadow:0 1px 3px #000}.approvedName small{display:block;font-size:13px;margin-top:5px;color:#fff}
  .approvedOn{padding:11px 17px;border-radius:16px;background:#ff3159;font-size:15px;font-weight:950;box-shadow:0 3px 12px #0004}
  .approvedViews{padding:10px 14px;border-radius:18px;background:#08080bb8;font-size:15px;font-weight:900}
  .approvedClose{margin-left:auto;border:0;background:none;color:#fff;font-size:46px;line-height:1}
  .approvedMeta{position:absolute;z-index:6;top:94px;left:16px;right:16px;display:flex;justify-content:space-between}.approvedMeta span{padding:10px 14px;border-radius:18px;background:#08080bb8;font-size:14px;font-weight:800}
  .approvedSide{position:absolute;z-index:7;right:13px;bottom:260px;display:grid;gap:12px}.approvedSide button{width:66px;height:66px;border-radius:50%;border:1px solid #ffffff28;background:#111116c9;color:#fff;font-size:27px;box-shadow:0 3px 12px #0005}.approvedSide small{display:block;font-size:12px;margin-top:2px;color:#eee}
  .approvedChat{position:absolute;z-index:7;left:16px;bottom:302px;display:grid;gap:7px;max-width:72%}.approvedChat span{width:max-content;max-width:100%;padding:8px 12px;border-radius:18px;background:#111116a8;font-size:14px;box-shadow:0 2px 8px #0003}.approvedChat b{font-weight:950;margin-right:10px}
  .approvedToast{position:absolute;z-index:7;left:16px;bottom:252px;padding:10px 14px;border:1px solid #ff5a9566;border-radius:18px;background:#09090bd9;color:#ff5d94;font-size:14px;font-weight:900}
  .approvedInput{position:absolute;z-index:7;left:16px;right:88px;bottom:196px;height:48px;border:1px solid #ffffff70;border-radius:26px;background:#09090b99;display:flex;align-items:center;padding:0 18px;font-size:14px;color:#ddd}.approvedInput:after{content:'☺';margin-left:auto;font-size:24px;color:#fff}
  .approvedGiftRow{position:absolute;z-index:8;left:14px;right:14px;bottom:10px;height:176px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.approvedGift{border:1px solid #ffffff30;border-radius:18px;background:#08080cd9;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:8px 4px 14px;text-align:center;box-shadow:inset 0 0 20px #ffffff05,0 6px 18px #0005}.approvedGift img{width:90%;height:112px;object-fit:contain;filter:drop-shadow(0 5px 7px #0008)}.approvedGift b{font-size:14px;margin-top:2px}.approvedGift em{font-style:normal;color:#ff5c9b;font-size:12px;margin-top:5px}
  .approvedRewards{flex:0 0 132px;background:#050507;padding:8px 14px 6px}.rewardBox{height:100%;border:1px solid #ffffff25;border-radius:18px;background:#08080b;display:grid;grid-template-columns:104px repeat(5,1fr);gap:0;align-items:stretch;padding:10px}.rewardTitle{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;color:#ff5f99;font-size:19px;font-weight:950;line-height:1.25;padding-left:8px}.rewardTitle small{font-size:12px;color:#aaa;margin-top:6px}.rewardItem{position:relative;border-left:1px solid #ffffff1d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.rewardItem .heart{font-size:14px;font-weight:950}.rewardItem img{width:32px;height:38px;object-fit:contain}.rewardItem .roseCount{font-size:12px;font-weight:900}.rewardItem .badge{position:absolute;bottom:-2px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#ff3f7e;color:#fff;font-size:12px;font-weight:950}
  .approvedStart{flex:0 0 92px;border:0;margin:0 14px 12px;border-radius:26px;background:linear-gradient(110deg,#ff315d 0%,#ff3f8c 48%,#894fff 100%);color:#fff;font-size:27px;font-weight:950;box-shadow:0 8px 24px #0006}
  @media(max-width:390px){.approvedAvatar{width:40px;height:40px}.approvedName{font-size:15px}.approvedName small{font-size:11px}.approvedOn,.approvedViews{font-size:13px;padding:9px 12px}.approvedClose{font-size:38px}.approvedMeta{top:78px}.approvedMeta span{font-size:12px;padding:8px 10px}.approvedSide{bottom:238px}.approvedSide button{width:56px;height:56px;font-size:22px}.approvedChat{bottom:278px}.approvedChat span,.approvedToast,.approvedInput{font-size:12px}.approvedToast{bottom:232px}.approvedInput{bottom:182px;height:42px}.approvedGiftRow{height:164px}.approvedGift img{height:98px}.approvedGift b{font-size:12px}.approvedRewards{flex-basis:118px}.rewardBox{grid-template-columns:90px repeat(5,1fr);padding:7px}.rewardTitle{font-size:16px}.rewardItem .heart{font-size:11px}.rewardItem .roseCount{font-size:10px}.approvedStart{flex-basis:78px;font-size:23px}}
  </style>
  <section class="approvedSolo">
    <div class="approvedStage">
      <div class="approvedTop"><div class="approvedAvatar"></div><div class="approvedName">K-Talk LIVE 👑<small>1인 방송</small></div><span class="approvedOn">ON AIR</span><span class="approvedViews">◉ 1,234</span><button class="approvedClose">×</button></div>
      <div class="approvedMeta"><span>🔥 실시간 랭킹 12위</span><span>방송 시간 00:32:45</span></div>
      <div class="approvedSide"><button onclick="needJoin('좋아요를 누르려면 가입해 주세요.')">💗<small>12.5K</small></button><button onclick="openComments()">💬<small>356</small></button><button onclick="shareApp()">↗<small>128</small></button><button onclick="openGifts()">🎁</button></div>
      <div class="approvedChat"><span><b>민수</b> 안녕하세요 💕</span><span><b>지호</b> 오늘 노래 너무 좋아요!</span><span><b>사랑해</b> 응원합니다 👍</span></div>
      <div class="approvedToast">🎁 K-Talk 에서 장미 3,000개를 선물했습니다!</div>
      <div class="approvedInput">메시지 입력...</div>
      <div class="approvedGiftRow">
        <button class="approvedGift" onclick="openGifts()"><img src="rose-single.svg" alt="장미"><b>장미 1개</b></button>
        <button class="approvedGift" onclick="openGifts()"><img src="rose-bouquet-50.svg" alt="장미 50개"><b>장미 50개</b></button>
        <button class="approvedGift" onclick="openGifts()"><img src="rose-bouquet-100.svg" alt="장미 100개"><b>장미 100개</b></button>
        <button class="approvedGift" onclick="openGifts()"><img src="gift-box.svg" alt="선물 상자"><b>선물 상자</b><em>큰 선물 보기</em></button>
      </div>
    </div>
    <div class="approvedRewards"><div class="rewardBox"><div class="rewardTitle">좋아요<br>보상<small>?</small></div>
      <div class="rewardItem"><div class="heart">💗 3,000</div><img src="rose-single.svg" alt="장미"><div class="roseCount">장미 1송이</div><div class="badge">1</div></div>
      <div class="rewardItem"><div class="heart">💗 6,000</div><img src="rose-single.svg" alt="장미"><div class="roseCount">장미 2송이</div><div class="badge">2</div></div>
      <div class="rewardItem"><div class="heart">💗 9,000</div><img src="rose-single.svg" alt="장미"><div class="roseCount">장미 3송이</div><div class="badge">3</div></div>
      <div class="rewardItem"><div class="heart">💗 12,000</div><img src="rose-single.svg" alt="장미"><div class="roseCount">장미 4송이</div><div class="badge">4</div></div>
      <div class="rewardItem"><div class="heart">💗 15,000</div><img src="rose-single.svg" alt="장미"><div class="roseCount">장미 5송이</div><div class="badge">5</div></div>
    </div></div>
    <button class="approvedStart" onclick="openCreator()">● 방송 시작</button>
  </section>`;
};
window.home();