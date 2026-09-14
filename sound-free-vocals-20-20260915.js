/* K-Talk 사운드 목록 전용: 외부 유명곡/벅스 이동 없이 자유 이용 보컬곡 20곡만 표시·재생. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktFreeVocal20Installed20260915)return;
  window.__ktFreeVocal20Installed20260915=true;

  var tracks=[
    {name:'Like a Child',source:'Toni Willé · 사람 보컬 · CC BY-SA 3.0',time:'3:10',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Like_a_Child_Radio_Version_Toni_Wille.ogg'},
    {name:'Wikipedia Pop Anthem',source:'Paul Dreifus · 사람 보컬 · CC BY-SA 3.0',time:'3:37',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Wikipedia_Pop_Anthem.ogg'},
    {name:'Binbataye',source:'Gadadharadas · 사람 보컬 · CC BY-SA 3.0',time:'2:36',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Binbataye_Hindi_pop.oga'},
    {name:'오빠는 풍각쟁이',source:'박향림 · 한국 가요 · 퍼블릭도메인',time:'2:52',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Park_Hyang-rim_-_Oppaneun_punggakjaeng-i.ogg'},
    {name:'청춘계급',source:'김해송 · 사람 보컬 · 퍼블릭도메인',time:'3:08',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kim_Hae-Song,_Cheong-chun-gye-geup.ogg'},
    {name:'전화일기',source:'박향림·김해송 · 사람 보컬 · 퍼블릭도메인',time:'3:06',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bak_Hyang_Rim_Kim_Hae_Song_jeonhwa_ilgi.ogg'},
    {name:'사의 찬미',source:'윤심덕 · 사람 보컬 · 퍼블릭도메인',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Yun_Sim-Deok_-_In_Praise_of_Death.ogg'},
    {name:'진국명산',source:'송만갑 · 사람 보컬 · 퍼블릭도메인',time:'3:28',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Song_Mangab_-_Jingukmyeongsan.ogg'},
    {name:'Frankie and Johnny',source:'전통 포크 · 사람 보컬 · 퍼블릭도메인',time:'3:20',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/FrankieandJohnny_Live.ogg'},
    {name:'Jesse James',source:'Bentley Ball · 사람 보컬 · 퍼블릭도메인',time:'3:00',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jesse_James_(Bentley_Ball).ogg'},
    {name:'Au Clair de la Lune',source:'고전 성악 · 사람 보컬 · 퍼블릭도메인',time:'2:46',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Au_Clair_de_la_Lune_1913.ogg'},
    {name:'Old Folks at Home',source:'고전 보컬 · 사람 보컬 · 퍼블릭도메인',time:'4:02',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Foster_-_Schumann-Heink_-_Old_Folks_at_Home_(rec._1918).ogg'},
    {name:'In My Merry Oldsmobile',source:'Billy Murray · 사람 보컬 · 퍼블릭도메인',time:'2:51',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bill_Murray_-_In_My_Merry_Oldsmobile.ogg'},
    {name:'Avalon',source:'Al Jolson · 사람 보컬 · 퍼블릭도메인',time:'2:58',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Al_Jolson_-_Avalon_(1920).ogg'},
    {name:'I Shall Not Be Moved',source:'전통 포크 · 사람 보컬 · 퍼블릭도메인',time:'3:06',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/IShallNotBeMoved.ogg'},
    {name:"Nobody Knows the Trouble I've Seen",source:'Vernon Dalhart · 전통 보컬 · 퍼블릭도메인',time:'3:33',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/NobodyKnowsTheTroubleISee.ogg'},
    {name:'O mio babbino caro',source:'Frances Alda · 성악 보컬 · 퍼블릭도메인 표시',time:'2:37',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Frances_Alda,_O_mio_babbino_caro_(Gianni_Schicchi)_unrestored.ogg'},
    {name:'Chanson du toréador',source:'Pasquale Amato · 성악 보컬 · 퍼블릭도메인 표시',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pasquale_Amato,_Georges_Bizet,_Chanson_du_tor%C3%A9ador,_Carmen.ogg'},
    {name:'Retseh',source:'Gershon Sirota · 사람 보컬 · 퍼블릭도메인',time:'3:03',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Retseh_(1908).ogg'},
    {name:'Wěseeraw olecho',source:'Gershon Sirota · 사람 보컬 · 퍼블릭도메인',time:'2:58',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/W%C4%9Bseeraw_olecho_(1902).ogg'}
  ];

  function apply(){
    window.ktCreatorTracks=tracks.slice(0,20);
    window.ktSearchFreeMusicOnline=function(){ return Promise.resolve(); };
    window.ktOpenLicensedSongSearch=function(index,ev){
      if(ev){try{ev.stopPropagation();ev.preventDefault();}catch(e){}}
      if(typeof window.ktPlaySoundPreview==='function')window.ktPlaySoundPreview(index,ev);
    };
  }

  apply();
  setTimeout(apply,0);
  setTimeout(apply,600);

  var oldOpen=window.openSoundPanel;
  if(typeof oldOpen==='function'){
    window.openSoundPanel=function(){
      apply();
      oldOpen.apply(this,arguments);
      setTimeout(function(){
        var note=document.querySelector('.kt-sound-panel .note');
        if(note)note.textContent='사람이 직접 부른 자유 이용 보컬곡 20곡만 들어 있습니다. ▶ 버튼을 누르면 K-Talk 안에서 바로 재생됩니다.';
      },0);
    };
  }
})();