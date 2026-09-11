/* K-Talk 파장만 변경: 1인/13명/구독자/비밀방의 파장을 개별 막대가 따로 움직이는 무지개 파장으로 표시. 다른 UI/기능은 건드리지 않음. */
(function(){
  if(window.__ktIndividualWaveBarsInstalled)return;
  window.__ktIndividualWaveBarsInstalled=true;

  function addStyle(){
    if(document.getElementById('ktIndividualWaveBarsStyle'))return;
    var s=document.createElement('style');
    s.id='ktIndividualWaveBarsStyle';
    s.textContent=`
      @keyframes ktIndividualWaveMove{
        0%{transform:scaleY(.22)}
        35%{transform:scaleY(.72)}
        70%{transform:scaleY(1)}
        100%{transform:scaleY(.38)}
      }

      html body .ktsolo-wave,
      html body .ktsubscriber-wave,
      html body .ktsecret-wave,
      html body .kt-secret-wave,
      html body .secret-wave,
      html body .ktg13-wave-bars{
        background:none!important;
        background-image:none!important;
        animation:none!important;
        transform:none!important;
        filter:none!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:1px!important;
        overflow:hidden!important;
        pointer-events:none!important;
        opacity:.98!important;
      }

      html body .ktsolo-wave,
      html body .ktsubscriber-wave,
      html body .ktsecret-wave,
      html body .kt-secret-wave,
      html body .secret-wave{
        height:42px!important;
        padding:0 2px!important;
      }

      html body .ktsolo-wave::before,
      html body .ktsubscriber-wave::before,
      html body .ktsecret-wave::before,
      html body .kt-secret-wave::before,
      html body .secret-wave::before,
      html body .ktg13-wave-bars::before{
        content:""!important;
        position:absolute!important;
        left:0!important;
        right:0!important;
        top:50%!important;
        height:1px!important;
        transform:translateY(-50%)!important;
        background:linear-gradient(90deg,#f0f,#ff315f,#ff9b2f,#ffe83d,#77ff39,#28fff0,#3190ff,#3144ff,#b935ff,#ff2bdc)!important;
        opacity:.88!important;
        box-shadow:0 0 6px rgba(255,80,220,.55)!important;
      }

      html body .ktsolo-wave>i,
      html body .ktsubscriber-wave>i,
      html body .ktsecret-wave>i,
      html body .kt-secret-wave>i,
      html body .secret-wave>i,
      html body .ktg13-wave-bars>i{
        display:block!important;
        flex:1 1 0!important;
        min-width:1px!important;
        max-width:4px!important;
        width:auto!important;
        height:var(--kt-wave-h,22px)!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:999px!important;
        background:var(--kt-wave-color,#ff35d2)!important;
        box-shadow:0 0 5px var(--kt-wave-color,#ff35d2)!important;
        transform-origin:center center!important;
        animation:ktIndividualWaveMove var(--kt-wave-d,.58s) ease-in-out var(--kt-wave-delay,0s) infinite alternate!important;
      }

      html body .ktg13-main::after{
        content:none!important;
        display:none!important;
        background:none!important;
        animation:none!important;
      }

      html body .ktg13-wave-bars{
        position:absolute!important;
        left:0!important;
        right:0!important;
        bottom:2px!important;
        height:36px!important;
        z-index:8!important;
        padding:0 2px!important;
      }
    `;
    document.head.appendChild(s);
  }

  function colorFor(i,total){
    var stops=[
      [255,0,255],[255,30,93],[255,138,25],[255,233,58],[124,255,52],
      [37,255,242],[47,123,255],[37,52,255],[179,44,255],[255,38,239]
    ];
    var p=total>1?i/(total-1):0;
    var x=p*(stops.length-1);
    var a=Math.floor(x),b=Math.min(stops.length-1,a+1),t=x-a;
    var c=stops[a],d=stops[b];
    var r=Math.round(c[0]+(d[0]-c[0])*t);
    var g=Math.round(c[1]+(d[1]-c[1])*t);
    var bl=Math.round(c[2]+(d[2]-c[2])*t);
    return 'rgb('+r+','+g+','+bl+')';
  }

  function tuneBars(box,count){
    if(!box)return;
    box.classList.add('kt-individual-wave');
    var bars=[].slice.call(box.querySelectorAll(':scope > i'));
    if(bars.length<8){
      box.innerHTML='';
      for(var i=0;i<count;i++){
        var bar=document.createElement('i');
        box.appendChild(bar);
      }
      bars=[].slice.call(box.querySelectorAll(':scope > i'));
    }
    var total=bars.length;
    bars.forEach(function(bar,i){
      var wave1=Math.abs(Math.sin((i+2)*0.47));
      var wave2=Math.abs(Math.sin((i+5)*0.19));
      var h=Math.round(8+24*(0.58*wave1+0.42*wave2));
      var d=(0.34+((i*7)%13)*0.026).toFixed(3)+'s';
      var delay=('-'+(((i*17)%29)*0.021).toFixed(3))+'s';
      bar.style.setProperty('--kt-wave-h',h+'px');
      bar.style.setProperty('--kt-wave-d',d);
      bar.style.setProperty('--kt-wave-delay',delay);
      bar.style.setProperty('--kt-wave-color',colorFor(i,total));
    });
  }

  function installWaves(){
    addStyle();
    document.querySelectorAll('.ktsolo-wave,.ktsubscriber-wave,.ktsecret-wave,.kt-secret-wave,.secret-wave').forEach(function(box){
      tuneBars(box,56);
    });

    document.querySelectorAll('.ktg13-main').forEach(function(main){
      var box=main.querySelector(':scope > .ktg13-wave-bars');
      if(!box){
        box=document.createElement('div');
        box.className='ktg13-wave-bars';
        main.appendChild(box);
      }
      tuneBars(box,64);
    });
  }

  setTimeout(installWaves,0);
  setTimeout(installWaves,120);
  setTimeout(installWaves,500);

  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktWaveBarsTimer);
      window.__ktWaveBarsTimer=setTimeout(installWaves,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
