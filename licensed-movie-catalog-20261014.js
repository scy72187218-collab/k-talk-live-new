/* Verified creator sources; no user-supplied or unlicensed URLs. */
(function(){
  var films=[
{"id":"wedding-day","title":"시집가는 날","originalTitle":"시집가는 날 (1956)","genre":"한국 고전 · 코미디/로맨스","country":"KR","youtubeId":"r-vWPHzI7ZI","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreanculture.org/from-korea-films/korean-classic-film-1930-1990s-film-series-1950s-lpcge"},
{"id":"madame-freedom","title":"자유부인","originalTitle":"자유부인 (1956)","genre":"한국 고전 · 드라마","country":"KR","youtubeId":"FkAbVQhfpmw","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreanculture.org/from-korea-films/korean-classic-film-1930-1990s-film-series-1950s-lpcge"},
{"id":"coachman","title":"마부","originalTitle":"마부 (1961)","genre":"한국 고전 · 가족 드라마","country":"KR","youtubeId":"UqqB0HUFmUU","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreafilm.or.kr/kofa/news/news/BC_0000059393"},
{"id":"general-son","title":"장군의 아들","originalTitle":"장군의 아들 (1990)","genre":"한국 고전 · 액션","country":"KR","creator":"한국영상자료원 작품 정보","credit":"한국영상자료원 작품 정보 · 영상 재생 링크 확인 필요","license":"상영 권한 미확인","sourceUrl":"https://www.koreafilm.or.kr/movie/PM_009925","rightsUrl":"https://www.koreafilm.or.kr/movie/PM_009925"},
{"id":"obalthan","title":"오발탄","originalTitle":"오발탄 (1961)","genre":"한국 고전 · 드라마","country":"KR","youtubeId":"LfxIfK8ThFc","creator":"한국영상자료원 한국고전영화","credit":"한국영상자료원 공식 유튜브 영상","license":"공식 YouTube 무료 재생","sourceUrl":"https://www.youtube.com/watch?v=LfxIfK8ThFc","rightsUrl":"https://www.youtube.com/t/terms"},
{"id":"sarangbang","title":"사랑방 손님과 어머니","originalTitle":"사랑방 손님과 어머니 (1961)","genre":"한국 고전 · 드라마","country":"KR","youtubeId":"mOt2PW_F6Nk","creator":"한국영상자료원 한국고전영화","credit":"한국영상자료원 공식 유튜브 영상","license":"공식 YouTube 무료 재생","sourceUrl":"https://www.youtube.com/watch?v=mOt2PW_F6Nk","rightsUrl":"https://www.youtube.com/t/terms"}
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
    var note=document.createElement('p');note.textContent='한국영상자료원이 공식 공개한 한국 고전영화를 모았습니다. 이번 주 추천은 매주 월요일 바뀌며, 공식 유튜브 영상은 제공되는 플레이어에서 볼 수 있습니다. 장군의 아들은 작품 정보만 제공하며 재생은 지원하지 않습니다.';panel.appendChild(note);
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
      var play=document.createElement('button');play.type='button';play.textContent=f.youtubeId?'▶ 이 영화 보기':'작품 정보 보기 (재생 불가)';play.onclick=function(){if(f.youtubeId&&window.ktPlayLicensedCatalogFilm)window.ktPlayLicensedCatalogFilm(f.id);else window.open(f.sourceUrl,'_blank','noopener');};row.appendChild(play);panel.appendChild(row);
    });
    var style=document.createElement('style');style.textContent='.kt-licensed-movie-catalog{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.kt-licensed-movie-catalog>p{grid-column:1/-1}.kt-licensed-movie-catalog .kt-licensed-film{min-width:0;margin:0;padding:8px}.kt-licensed-film .kt-film-poster{width:100%;padding:0;margin:0 0 8px;overflow:hidden;border-radius:9px;background:#08080c}.kt-film-poster img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.kt-licensed-film b{font-size:13px;overflow-wrap:anywhere}.kt-licensed-film a{font-size:10px}@media(min-width:700px){.kt-licensed-movie-catalog{grid-template-columns:repeat(3,minmax(0,1fr))}}';panel.prepend(style);
    var more=document.createElement('a');more.href='https://www.youtube.com/@KoreanFilm';more.target='_blank';more.rel='noopener noreferrer';more.textContent='한국영상자료원 한국영화 더 보기 →';more.style.cssText='grid-column:1/-1;display:block;padding:12px;text-align:center;font-weight:bold';panel.appendChild(more);
    body.appendChild(panel);
  };
})();