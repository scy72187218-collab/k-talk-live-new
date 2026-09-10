/* K-Talk 사용방법·혜택 안내 보강: 카메라/보정 사용법만 추가. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktHelpBeautyGuideInstalled)return;
  window.__ktHelpBeautyGuideInstalled=true;

  function installGuide(){
    if(typeof window.openMenu!=='function'||typeof window.showSheet!=='function')return false;
    var oldOpenMenu=window.openMenu;
    if(oldOpenMenu.__ktBeautyGuideWrapped)return true;

    window.openBeautyUseGuide=function(){
      showSheet('✨ 카메라·보정 사용법',
        '<div class="rowbox"><b>1. 카메라 켜기</b><br>방송하기 또는 촬영 화면에 들어가면 카메라 화면을 확인할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>2. AI 보정 열기</b><br>촬영 화면의 AI 보정을 누르면 보정 메뉴가 열립니다.</div>'+ 
        '<div class="rowbox"><b>3. 1~100 조절</b><br>피부·주름 완화·눈·코·입·턱 항목을 하나씩 선택한 뒤 슬라이더를 1~100 사이에서 조절합니다.</div>'+ 
        '<div class="rowbox"><b>4. 부위별 따로 조절</b><br>눈, 코, 입, 턱은 각각 따로 조절할 수 있어 원하는 정도만 적용할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>5. 기본 보정</b><br>카메라를 켜면 기본 자연 보정이 적용되며, 필요하면 각 항목을 다시 조절하거나 초기화할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>6. 편집 효과</b><br>하트·모자·선글라스 같은 화면 효과와 무대·바다 같은 배경 효과는 편집 효과 메뉴에서 선택합니다.</div>'+ 
        '<div class="note">보정과 효과는 화면 연출 기능입니다. 기기 성능이나 조명에 따라 보이는 정도가 달라질 수 있습니다.</div>');
    };

    window.openMenu=function(){
      oldOpenMenu.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('[data-kt-beauty-guide]'))return;
          var grid=body.querySelector('div[style*="grid-template-columns"]');
          if(!grid)return;
          var b=document.createElement('button');
          b.setAttribute('data-kt-beauty-guide','1');
          b.onclick=function(){window.openBeautyUseGuide();};
          b.style.cssText='display:flex;min-height:118px;border-radius:22px;padding:16px 14px;align-items:center;gap:12px;text-align:left;color:#fff;background:linear-gradient(145deg,#10111b,#07070d);font-weight:900;border:1.5px solid #9ff7d1;box-shadow:0 0 18px #35d89b,inset 0 0 24px #35d89b33';
          b.innerHTML='<span style="width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;flex:0 0 54px;background:radial-gradient(circle,#58efb5,#145b43);box-shadow:0 0 20px #35d89b">✨</span><span><b style="display:block;font-size:17px;line-height:1.15;margin-bottom:5px;color:#9ff7d1">카메라·보정 사용법</b><small style="display:block;font-size:11px;color:#c9c9d1;font-weight:700">1~100 · 눈·코·입·턱 조절</small></span>';
          grid.insertBefore(b,grid.firstChild);
        }catch(e){}
      },0);
    };
    window.openMenu.__ktBeautyGuideWrapped=true;
    return true;
  }

  if(!installGuide()){
    var tries=0;
    var t=setInterval(function(){
      tries++;
      if(installGuide()||tries>40)clearInterval(t);
    },100);
  }
})();
