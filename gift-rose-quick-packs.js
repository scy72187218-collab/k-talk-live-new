/* K-Talk 장미 빠른 선물 수량만 추가: 기존 선물/방송 UI는 그대로 유지. */
(function(){
  if(window.__ktRoseQuickPacksInstalled)return;
  window.__ktRoseQuickPacksInstalled=true;

  function install(){
    if(!Array.isArray(window.ktalkGifts))return false;
    var amounts=[5,10,20,30,50,100];
    var existing={};
    window.ktalkGifts.forEach(function(g){
      if(!g)return;
      var name=String(g[0]||'');
      var cost=parseInt(g[1]||0,10)||0;
      if(name.indexOf('장미')===0)existing[cost]=true;
    });

    var packs=[];
    amounts.forEach(function(n){
      if(!existing[n])packs.push(['장미 '+n+'송이',String(n),'🌹','꽃/하트']);
    });
    if(!packs.length)return true;

    var firstRose=-1;
    for(var i=0;i<window.ktalkGifts.length;i++){
      if(String(window.ktalkGifts[i]&&window.ktalkGifts[i][0]||'').indexOf('장미')===0){firstRose=i;break;}
    }
    var at=firstRose>=0?firstRose+1:0;
    Array.prototype.splice.apply(window.ktalkGifts,[at,0].concat(packs));
    return true;
  }

  if(!install()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(install()||tries>40)clearInterval(timer);
    },100);
  }
})();
