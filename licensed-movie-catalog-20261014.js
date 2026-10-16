/* Verified creator sources; no user-supplied or unlicensed URLs. */
(function(){
  var films=[
    {id:'indie-online',title:'한국 독립영화 온라인 상영관',originalTitle:'인디그라운드 · 최근 한국영화',genre:'한국 독립영화 · 온라인 상영',country:'KR',creator:'인디그라운드',credit:'공식 온라인 상영관 · 상영 기간 및 회원가입 조건 확인',license:'외부 공식 상영관에서 재생',sourceUrl:'https://www.indieground.kr/indie/selectOnlineList.do',rightsUrl:'https://www.indieground.kr/indie/selectOnlineList.do'}
  ];
  films.forEach(Object.freeze);Object.freeze(films);
  window.ktLicensedMovieCatalog=films;
  function weekly(when){
    var week=Math.floor((Number(when)-Date.UTC(2026,9,11,15))/604800000);
    return [films[((week%films.length)+films.length)%films.length]];
  }
  window.ktWeeklyLicensedMovies=weekly;
  window.ktOpenLicensedMovieCatalog=function(){
    if(!window.showSheet)return;
    window.showSheet('영화 목록 · 이번 주 추천','');
    var body=document.getElementById('sheetBody');if(!body)return;
    var panel=document.createElement('div');panel.className='kt-licensed-movie-catalog';
    var note=document.createElement('p');note.textContent='최근 한국 독립영화를 공식 온라인 상영관에서 찾아보실 수 있습니다. 상영 중인 작품과 이용 조건은 인디그라운드에서 확인해 주세요. K-Talk LIVE 내부에서 직접 재생하는 방식은 아닙니다.';panel.appendChild(note);
    var featured=weekly(Date.now()).map(function(f){return f.id;});
    var ordered=weekly(Date.now()).concat(films),seen={};
    var order=ordered.filter(function(f){if(seen[f.id])return false;seen[f.id]=true;return true;});
    order.forEach(function(f){
      var row=document.createElement('section');row.className='kt-licensed-film';
      var poster=document.createElement('button');poster.type='button';poster.className='kt-film-poster';poster.setAttribute('aria-label',f.title+' 보기');
      var image=document.createElement('img');image.src=f.youtubeId?'https://i.ytimg.com/vi/'+f.youtubeId+'/hqdefault.jpg':'';image.alt=f.title;image.loading='lazy';poster.appendChild(image);poster.onclick=function(){if(f.youtubeId&&window.ktPlayLicensedCatalogFilm)window.ktPlayLicensedCatalogFilm(f.id);else window.open(f.sourceUrl,'_blank','noopener');};row.appendChild(poster);
      var name=document.createElement('b');name.textContent=f.title+' · '+f.originalTitle+(featured.indexOf(f.id)>=0?' · 이번 주 추천':'');row.appendChild(name);
      var genre=document.createElement('p');genre.textContent=f.genre;row.appendChild(genre);
      var credit=document.createElement('p');credit.textContent=(f.credit||('© '+f.creator))+' · '+f.license;row.appendChild(credit);
      (f.youtubeId?[['공식 YouTube','https://www.youtube.com/watch?v='+f.youtubeId]]:[]).concat([['작품 정보',f.sourceUrl],['이용 조건',f.rightsUrl]]).concat(f.licenseUrl?[['라이선스',f.licenseUrl]]:[]).forEach(function(item){var a=document.createElement('a');a.textContent=item[0];a.href=item[1];a.target='_blank';a.rel='noopener noreferrer';row.appendChild(a);});
      var play=document.createElement('button');play.type='button';play.textContent=f.youtubeId?'▶ 이 영화 보기':'공식 상영관 열기';play.onclick=function(){if(f.youtubeId&&window.ktPlayLicensedCatalogFilm)window.ktPlayLicensedCatalogFilm(f.id);else window.open(f.sourceUrl,'_blank','noopener');};row.appendChild(play);panel.appendChild(row);
    });
    var style=document.createElement('style');style.textContent='.kt-licensed-movie-catalog{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.kt-licensed-movie-catalog>p{grid-column:1/-1}.kt-licensed-movie-catalog .kt-licensed-film{min-width:0;margin:0;padding:8px}.kt-licensed-film .kt-film-poster{width:100%;padding:0;margin:0 0 8px;overflow:hidden;border-radius:9px;background:#08080c}.kt-film-poster img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.kt-licensed-film b{font-size:13px;overflow-wrap:anywhere}.kt-licensed-film a{font-size:10px}@media(min-width:700px){.kt-licensed-movie-catalog{grid-template-columns:repeat(3,minmax(0,1fr))}}';panel.prepend(style);
    var more=document.createElement('a');more.href='https://www.indieground.kr/indie/selectOnlineList.do';more.target='_blank';more.rel='noopener noreferrer';more.textContent='최신 한국 독립영화 상영관 열기 →';more.style.cssText='grid-column:1/-1;display:block;padding:12px;text-align:center;font-weight:bold';panel.appendChild(more);
    body.appendChild(panel);
  };
})();