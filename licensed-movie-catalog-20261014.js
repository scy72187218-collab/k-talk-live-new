/* Verified creator sources; no user-supplied or unlicensed URLs. */
(function(){
  var films=[
{"id":"wedding-day","title":"시집가는 날","originalTitle":"시집가는 날 (1956)","genre":"한국 고전 · 코미디/로맨스","country":"KR","youtubeId":"r-vWPHzI7ZI","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreanculture.org/from-korea-films/korean-classic-film-1930-1990s-film-series-1950s-lpcge"},
{"id":"madame-freedom","title":"자유부인","originalTitle":"자유부인 (1956)","genre":"한국 고전 · 드라마","country":"KR","youtubeId":"FkAbVQhfpmw","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreanculture.org/from-korea-films/korean-classic-film-1930-1990s-film-series-1950s-lpcge"},
{"id":"coachman","title":"마부","originalTitle":"마부 (1961)","genre":"한국 고전 · 가족 드라마","country":"KR","youtubeId":"UqqB0HUFmUU","creator":"한국영상자료원 공식 공개","credit":"공식 제공: 한국영상자료원 한국고전영화","license":"공식 YouTube 무료 재생","licenseUrl":"https://www.youtube.com/t/terms","rightsUrl":"https://www.koreafilm.or.kr/pages/PC_00000065","sourceUrl":"https://www.koreafilm.or.kr/kofa/news/news/BC_0000059393"},
    {id:'big-buck-bunny',title:'빅 벅 버니',originalTitle:'Big Buck Bunny',genre:'애니메이션',country:'INTL',youtubeId:'aqz-KE-bpKQ',creator:'Blender Foundation',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',rightsUrl:'https://peach.blender.org/about/',sourceUrl:'https://studio.blender.org/films/big-buck-bunny/'},
    {id:'sintel',title:'신텔',originalTitle:'Sintel',genre:'판타지 애니메이션',country:'INTL',youtubeId:'eRsGyueVLvQ',creator:'Blender Foundation',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',rightsUrl:'https://durian.blender.org/sharing/',sourceUrl:'https://studio.blender.org/films/sintel/'},
    {id:'tears-of-steel',title:'티어스 오브 스틸',originalTitle:'Tears of Steel',genre:'SF 액션 단편',country:'INTL',youtubeId:'R6MlUcmOul8',creator:'Blender Foundation',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',rightsUrl:'https://mango.blender.org/sharing/',sourceUrl:'https://studio.blender.org/films/tears-of-steel/'}
  ];
  films.forEach(Object.freeze);Object.freeze(films);
  window.ktLicensedMovieCatalog=films;
  function weekly(when){
    var week=Math.floor((Number(when)-Date.UTC(2026,9,11,15))/604800000),kr=films.filter(function(f){return f.country==='KR';}),intl=films.filter(function(f){return f.country!=='KR';});
    return [kr[((week%kr.length)+kr.length)%kr.length],intl[((week%intl.length)+intl.length)%intl.length]];
  }
  window.ktWeeklyLicensedMovies=weekly;
  window.ktOpenLicensedMovieCatalog=function(){
    if(!window.showSheet)return;
    window.showSheet('영화 목록 · 이번 주 추천','');
    var body=document.getElementById('sheetBody');if(!body)return;
    var panel=document.createElement('div');panel.className='kt-licensed-movie-catalog';
    var note=document.createElement('p');note.textContent='한국영상자료원 공식 공개 한국 영화와 공개 라이선스 단편입니다. 이번 주 추천은 매주 월요일 바뀌며, YouTube에서 제공하는 공식 플레이어입니다. 각 기기에서 재생 버튼을 누르면 무료로 볼 수 있습니다.';panel.appendChild(note);
    var featured=weekly(Date.now()).map(function(f){return f.id;});
    var order=weekly(Date.now()).concat(films.filter(function(f){return featured.indexOf(f.id)<0;}));
    order.forEach(function(f){
      var row=document.createElement('section');row.className='kt-licensed-film';
      var poster=document.createElement('button');poster.type='button';poster.className='kt-film-poster';poster.setAttribute('aria-label',f.title+' 보기');
      var image=document.createElement('img');image.src='https://i.ytimg.com/vi/'+f.youtubeId+'/hqdefault.jpg';image.alt=f.title;image.loading='lazy';poster.appendChild(image);poster.onclick=function(){if(window.ktPlayLicensedCatalogFilm)window.ktPlayLicensedCatalogFilm(f.id);};row.appendChild(poster);
      var name=document.createElement('b');name.textContent=f.title+' · '+f.originalTitle+(featured.indexOf(f.id)>=0?' · 이번 주 추천':'');row.appendChild(name);
      var genre=document.createElement('p');genre.textContent=f.genre;row.appendChild(genre);
      var credit=document.createElement('p');credit.textContent=(f.credit||('© '+f.creator))+' · '+f.license;row.appendChild(credit);
      [['공식 YouTube','https://www.youtube.com/watch?v='+f.youtubeId],['작품·제작사',f.sourceUrl],['이용 조건',f.rightsUrl],['라이선스',f.licenseUrl]].forEach(function(item){var a=document.createElement('a');a.textContent=item[0];a.href=item[1];a.target='_blank';a.rel='noopener noreferrer';row.appendChild(a);});
      var play=document.createElement('button');play.type='button';play.textContent='▶ 이 영화 보기';play.onclick=function(){if(window.ktPlayLicensedCatalogFilm)window.ktPlayLicensedCatalogFilm(f.id);};row.appendChild(play);panel.appendChild(row);
    });
    var style=document.createElement('style');style.textContent='.kt-licensed-movie-catalog{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.kt-licensed-movie-catalog>p{grid-column:1/-1}.kt-licensed-movie-catalog .kt-licensed-film{min-width:0;margin:0;padding:8px}.kt-licensed-film .kt-film-poster{width:100%;padding:0;margin:0 0 8px;overflow:hidden;border-radius:9px;background:#08080c}.kt-film-poster img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.kt-licensed-film b{font-size:13px;overflow-wrap:anywhere}.kt-licensed-film a{font-size:10px}@media(min-width:700px){.kt-licensed-movie-catalog{grid-template-columns:repeat(3,minmax(0,1fr))}}';panel.prepend(style);
    body.appendChild(panel);
  };
})();