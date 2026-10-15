/* Original low-poly 3D gift presentation. Visual hooks only: no sending, balances,
   rewards, media, recorder or network changes. No third-party model assets. */
(function(){
  'use strict';
  if(window.__ktGiftCenter3D20261014)return;
  window.__ktGiftCenter3D20261014=true;
  var TAU=Math.PI*2,active=null,queue=[],visualSeen20261015=Object.create(null),visualFinished20261015=Object.create(null);
  function giftText20261015(job){return job.sender+'님이 '+job.name+' '+job.cost+'개를 선물했습니다.';}
  function giftKey20261015(text){return String(text||'').replace(/님이|님께서|님/g,'').replace(/선물했습니다|선물하셨습니다|선물을\s*보냈습니다|선물/g,'').replace(/개를/g,'개').replace(/[^가-힣a-zA-Z0-9]/g,'').toLowerCase();}
  function oldGift20261015(job,at){return !job.createdAt||job.createdAt<=at;}
  var gold='#efb83e',pink='#f15195',blue='#67caff',white='#e9f5ff',dark='#202744';
  function rotate(p,rx,ry,rz){
    var x=p[0],y=p[1],z=p[2],c=Math.cos(rx),s=Math.sin(rx),v=y*c-z*s;z=y*s+z*c;y=v;
    c=Math.cos(ry);s=Math.sin(ry);v=x*c+z*s;z=-x*s+z*c;x=v;
    c=Math.cos(rz);s=Math.sin(rz);return [x*c-y*s,x*s+y*c,z];
  }
  function build(name){
    var faces=[],isGold=/황금|골드|로열|황제|VIP/.test(name),metal=isGold?gold:blue;
    function face(points,color){faces.push({points:points,color:color});}
    function part(vertices,indices,color,pos,rot){
      pos=pos||[0,0,0];rot=rot||[0,0,0];
      var vs=vertices.map(function(p){var q=rotate(p,rot[0],rot[1],rot[2]);return q.map(function(v,i){return v+pos[i];});});
      indices.forEach(function(ix){face(ix.map(function(i){return vs[i];}),color);});
    }
    function box(x,y,z,w,h,d,color,rot){
      part([[-w/2,-h/2,-d/2],[w/2,-h/2,-d/2],[w/2,h/2,-d/2],[-w/2,h/2,-d/2],[-w/2,-h/2,d/2],[w/2,-h/2,d/2],[w/2,h/2,d/2],[-w/2,h/2,d/2]],[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]],color,[x,y,z],rot);
    }
    function orb(x,y,z,rx,ry,rz,color,rings,segments){
      rings=rings||9;segments=segments||16;
      var vs=[],ix=[];
      for(var a=0;a<=rings;a++)for(var b=0;b<segments;b++){var t=a*Math.PI/rings,u=b*TAU/segments;vs.push([rx*Math.sin(t)*Math.cos(u),ry*Math.cos(t),rz*Math.sin(t)*Math.sin(u)]);}
      for(a=0;a<rings;a++)for(b=0;b<segments;b++){var j=a*segments+b,k=a*segments+(b+1)%segments;ix.push([j,k,k+segments,j+segments]);}
      part(vs,ix,color,[x,y,z]);
    }
    function cylinder(x,y,z,r,h,color,top,rot){
      var vs=[],ix=[],n=16;top=top==null?r:top;
      for(var a=0;a<n;a++){var u=a*TAU/n;vs.push([r*Math.cos(u),-h/2,r*Math.sin(u)]);vs.push([top*Math.cos(u),h/2,top*Math.sin(u)]);}
      for(a=0;a<n;a++)ix.push([a*2,((a+1)%n)*2,((a+1)%n)*2+1,a*2+1]);
      ix.push(Array.from({length:n},function(_,i){return i*2;}));ix.push(Array.from({length:n},function(_,i){return i*2+1;}));part(vs,ix,color,[x,y,z],rot);
    }
    function gem(x,y,z,r,color){
      var vs=[[0,-r*1.15,0]],ix=[],n=8;
      for(var a=0;a<n;a++){var u=a*TAU/n;vs.push([Math.cos(u)*r,r*.1,Math.sin(u)*r]);}
      for(a=0;a<n;a++){u=a*TAU/n;vs.push([Math.cos(u)*r*.52,r*.65,Math.sin(u)*r*.52]);}
      for(a=0;a<n;a++){var b=(a+1)%n;ix.push([0,a+1,b+1],[a+1,n+a+1,n+b+1,b+1]);}ix.push(Array.from({length:n},function(_,i){return n+i+1;}));part(vs,ix,color,[x,y,z]);
    }
    function ring(x,y,z,r,t,color,rot){
      var vs=[],ix=[],n=24,m=6;
      for(var a=0;a<n;a++)for(var b=0;b<m;b++){var u=a*TAU/n,v=b*TAU/m;vs.push([(r+t*Math.cos(v))*Math.cos(u),(r+t*Math.cos(v))*Math.sin(u),t*Math.sin(v)]);}
      for(a=0;a<n;a++)for(b=0;b<m;b++)ix.push([a*m+b,((a+1)%n)*m+b,((a+1)%n)*m+(b+1)%m,a*m+(b+1)%m]);part(vs,ix,color,[x,y,z],rot);
    }
    function star(x,y,z,r,color){
      var vs=[],ix=[];for(var a=0;a<10;a++){var u=a*Math.PI/5+Math.PI/2,k=a%2?r*.43:r;vs.push([Math.cos(u)*k,Math.sin(u)*k,.12],[Math.cos(u)*k,Math.sin(u)*k,-.12]);}
      vs.push([0,0,.22],[0,0,-.22]);for(a=0;a<10;a++){var b=(a+1)%10;ix.push([20,a*2,b*2],[21,b*2+1,a*2+1],[a*2,a*2+1,b*2+1,b*2]);}part(vs,ix,color,[x,y,z]);
    }
    function heart(x,y,z,r,color){
      var vs=[],ix=[],n=32;
      for(var a=0;a<n;a++){var t=a*TAU/n;var px=16*Math.pow(Math.sin(t),3)/18,py=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/18;vs.push([px*r,py*r,.20*r],[px*r,py*r,-.20*r]);}
      vs.push([0,0,.42*r],[0,0,-.42*r]);for(a=0;a<n;a++){var b=(a+1)%n;ix.push([n*2,a*2,b*2],[n*2+1,b*2+1,a*2+1],[a*2,a*2+1,b*2+1,b*2]);}part(vs,ix,color,[x,y,z]);
    }
    function rose(x,y,z,s){
      cylinder(x,y-s*.5,z,s*.035,s*1.4,'#328b68');
      orb(x+s*.22,y-s*.65,z,s*.28,s*.08,s*.15,'#55b980',5,8);
      for(var a=0;a<16;a++){
        var t=a*2.399,layer=a/15,r=s*(.08+layer*.28),vs=[],ix=[],cols=8,rows=4;
        for(var u=0;u<=rows;u++)for(var v=0;v<=cols;v++){
          var angle=t+(v/cols-.5)*2.4,spread=r*(.45+u/rows*.85);
          vs.push([x+Math.cos(angle)*spread,y+Math.sin(angle)*spread*.85,z+s*(.24-layer*.24)+Math.sin(u/rows*Math.PI)*s*.13]);
        }
        for(u=0;u<rows;u++)for(v=0;v<cols;v++){var k=u*(cols+1)+v;ix.push([k,k+1,k+cols+2,k+cols+1]);}
        part(vs,ix,isGold?(a%2?'#e7a82d':'#ffe4a1'):(a%3?'#ed3978':'#ff80b1'));
      }
      orb(x,y,z+s*.3,s*.07,s*.07,s*.1,isGold?'#d19522':'#a91550',5,9);
    }
    var kind='box';
    if(/장미|꽃다발/.test(name)){
      kind='flowers';if(/꽃다발/.test(name)){rose(-.42,.35,0,.7);rose(.42,.35,0,.7);rose(0,.65,.12,.8);cylinder(0,-.65,0,.25,.6,white,.5);}else rose(0,.55,0,1.15);
    }else if(/반지/.test(name)){kind='ring';ring(0,-.1,0,.68,.13,gold);gem(0,.75,0,.46,blue);
    }else if(/목걸이/.test(name)){kind='necklace';ring(0,.2,0,.85,.055,gold);gem(0,-.8,0,.4,blue);
    }else if(/시계/.test(name)){kind='watch';box(0,0,0,.55,2,.12,dark);cylinder(0,0,.15,.58,.25,gold,null,[Math.PI/2,0,0]);box(0,.2,.32,.035,.4,.04,white);box(.16,0,.33,.35,.035,.04,white);
    }else if(/왕좌/.test(name)){kind='throne';box(0,.15,-.35,1.35,1.9,.25,gold);box(0,-.4,.05,1.3,.35,1.1,'#8e2160');[-.7,.7].forEach(function(x){box(x,-.15,.05,.2,.65,1.2,gold);box(x,-.9,.3,.16,.65,.16,gold);});gem(0,.6,-.15,.22,blue);
    }else if(/왕관|크라운/.test(name)){kind='crown';cylinder(0,-.35,0,.85,.32,gold);for(var i=0;i<8;i++){var t=i*TAU/8;cylinder(Math.cos(t)*.75,.08,Math.sin(t)*.75,.18,.65,gold,0);orb(Math.cos(t)*.75,.43,Math.sin(t)*.75,.11,.11,.11,metal,5,8);}gem(0,-.3,.85,.22,pink);
    }else if(/트로피/.test(name)){kind='trophy';box(0,-.95,0,.85,.25,.7,dark);cylinder(0,-.5,0,.13,.7,gold);cylinder(0,.3,0,.28,.9,gold,.7);ring(-.65,.3,0,.36,.08,gold);ring(.65,.3,0,.36,.08,gold);
    }else if(/자동차|슈퍼카|스포츠카/.test(name)){kind='car';
      part([[-1.2,-.4,-.48],[1.2,-.4,-.48],[1.12,-.1,-.48],[-1.1,.05,-.48],[-1.2,-.4,.48],[1.2,-.4,.48],[1.12,-.1,.48],[-1.1,.05,.48]],[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]],isGold?gold:'#e42e62');
      part([[-.65,0,-.4],[.6,0,-.4],[.22,.38,-.33],[-.4,.38,-.33],[-.65,0,.4],[.6,0,.4],[.22,.38,.33],[-.4,.38,.33]],[[0,1,2,3],[4,7,6,5],[3,2,6,7],[1,5,6,2],[0,3,7,4]],'#24466a');box(-.1,.4,0,.62,.04,.68,isGold?gold:'#ed5278');
      [-.75,.75].forEach(function(x){[-.48,.48].forEach(function(z){cylinder(x,-.4,z,.26,.14,dark,null,[Math.PI/2,0,0]);cylinder(x,-.4,z*1.16,.14,.025,white,null,[Math.PI/2,0,0]);});});box(1.14,-.14,0,.04,.08,.7,white);box(-1.12,.14,0,.15,.06,1.1,dark);
    }else if(/요트/.test(name)){kind='yacht';cylinder(0,-.45,0,.6,.45,white,.43,[0,0,Math.PI/2]);box(0,-.3,0,2.3,.32,.8,white);box(-.1,.08,0,1.25,.45,.66,metal);box(-.2,.4,0,.7,.2,.56,white);box(0,.05,.35,.95,.16,.03,dark);cylinder(-.25,.8,0,.035,.8,gold);
    }else if(/제트|우주선/.test(name)){kind='rocket';orb(0,0,0,.36,1.1,.36,white);cylinder(0,.95,0,.36,.6,metal,0);box(0,-.5,0,1.6,.15,.58,metal,[0,0,.15]);orb(0,.32,.32,.17,.2,.1,blue);cylinder(0,-1.15,0,.24,.45,'#ff965b',0);
    }else if(/고래|백조|드래곤|피닉스/.test(name)){
      kind=/고래/.test(name)?'whale':/백조/.test(name)?'swan':/드래곤/.test(name)?'dragon':'phoenix';
      var color=kind==='swan'?white:kind==='phoenix'?gold:metal;
      orb(-.1,-.15,0,.95,.48,.43,color);orb(.65,.1,0,.48,.4,.4,color);orb(.86,.22,.36,.055,.065,.045,dark,5,8);
      box(-1,-.1,0,.7,.15,.8,color,[0,.15,.3]);
      if(kind==='swan'){orb(.6,.65,0,.14,.65,.15,color);orb(.65,1.1,0,.28,.25,.23,color);box(.95,1.07,0,.3,.09,.12,gold);}
      if(kind==='phoenix'){orb(.65,.5,0,.28,.6,.25,color);orb(.72,.97,0,.25,.24,.23,color);gem(.85,1.15,0,.18,'#ff8754');}
      if(kind==='dragon'){orb(.8,.36,0,.38,.35,.3,color);cylinder(.75,.82,0,.13,.5,gold,0);cylinder(1,.72,0,.09,.3,gold,0);for(i=0;i<5;i++)gem(-.8+i*.28,.35,0,.15,pink);[-.5,.35].forEach(function(x){box(x,-.6,.3,.18,.45,.2,color);box(x,-.6,-.3,.18,.45,.2,color);});}
      var wing=kind==='whale'?.55:1.0;
      part([[-.65,.2,.25],[.05,.4,.4],[-.7,.7,wing],[-.9,.15,wing*.75]],[[0,1,2],[0,2,3]],color);part([[-.65,.2,-.25],[.05,.4,-.4],[-.7,.7,-wing],[-.9,.15,-wing*.75]],[[0,1,2],[0,2,3]],color);
    }else if(/성|궁전|왕국/.test(name)){kind='castle';box(0,-.3,0,1.65,1.1,1.05,isGold?gold:'#a3b4e8');[-.85,.85].forEach(function(x){[-.5,.5].forEach(function(z){cylinder(x,.1,z,.25,1.7,white);cylinder(x,1.1,z,.34,.5,isGold?gold:pink,0);});});box(0,-.55,.54,.36,.58,.035,dark);box(0,.5,0,.75,.45,.65,metal);
    }else if(/무대/.test(name)){kind='stage';cylinder(0,-.6,0,1.2,.25,dark);[-.85,.85].forEach(function(x){box(x,.2,0,.12,1.5,.15,gold);star(x,.95,0,.25,metal);});box(0,.85,0,1.7,.12,.16,gold);star(0,.15,0,.7,pink);
    }else if(/행성|달/.test(name)){kind='planet';orb(0,0,0,.85,.85,.85,/달/.test(name)?gold:'#9c83f5',10,18);if(/행성/.test(name))ring(0,0,0,1.2,.10,blue,[.6,.2,0]);else orb(-.3,.4,.7,.15,.15,.1,'#c89331',5,8);
    }else if(/하트|풍선/.test(name)){kind='heart';heart(0,0,0,1,/다이아/.test(name)?blue:pink);if(/풍선/.test(name))box(0,-1,0,.015,.6,.015,white);
    }else if(/별|불꽃|폭죽/.test(name)){kind='star';star(0,0,0,1.1,gold);star(-.9,.7,.1,.28,pink);star(.9,.4,0,.25,blue);
    }else if(/초콜릿/.test(name)){kind='chocolate';for(i=0;i<3;i++)for(var j=0;j<3;j++)box((i-1)*.48,(j-1)*.48,0,.43,.43,.3,'#80483c');box(0,-.6,.18,1.5,.42,.06,isGold?gold:pink);
    }else if(/케이크/.test(name)){kind='cake';cylinder(0,-.45,0,.9,.55,'#e6a481');cylinder(0,.05,0,.8,.5,pink);cylinder(0,.4,0,.7,.2,white);cylinder(0,.72,0,.04,.5,gold);orb(0,1.03,0,.07,.14,.07,'#ffab52',5,8);
    }else if(/향수/.test(name)){kind='perfume';box(0,-.2,0,1.15,1.15,.6,'#af8de8');box(0,.52,0,.38,.28,.34,gold);box(0,.82,0,.6,.3,.45,dark);gem(0,-.15,.33,.26,pink);
    }else if(/다이아|99만/.test(name)){kind='diamond';gem(0,0,0,1.1,blue);
    }else{kind='box';box(0,-.2,0,1.4,1.2,1.25,isGold?gold:'#9445be');box(0,.5,0,1.52,.22,1.38,isGold?'#ffe5a1':pink);box(0,-.1,.64,.2,1.1,.03,gold);box(0,.63,0,.22,.05,1.38,gold);ring(-.25,.83,0,.26,.07,gold,[0,.3,0]);ring(.25,.83,0,.26,.07,gold,[0,-.3,0]);}
    return {faces:faces,kind:kind};
  }
  function shade(hex,light){var n=parseInt(hex.slice(1),16);return 'rgb('+[n>>16,(n>>8)&255,n&255].map(function(v){return Math.round(Math.min(255,v*light+10));}).join(',')+')';}
  function draw(ctx,model,time,size,opacity,reduced){
    ctx.clearRect(0,0,size,size);ctx.globalAlpha=opacity;
    var turn=reduced?.35:Math.sin(time*.7)*.45+time*.18,tilt=-.12,scale=size*.25;
    var glow=ctx.createRadialGradient(size/2,size*.5,0,size/2,size*.5,size*.46);glow.addColorStop(0,'#9363dd45');glow.addColorStop(1,'#9363dd00');ctx.fillStyle=glow;ctx.fillRect(0,0,size,size);
    ctx.save();ctx.translate(size/2,size*.83);ctx.scale(1,.24);var shadow=ctx.createRadialGradient(0,0,0,0,0,size*.28);shadow.addColorStop(0,'#050617aa');shadow.addColorStop(1,'#05061700');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,size*.28,0,TAU);ctx.fill();ctx.restore();
    var fs=model.faces.map(function(f){var vs=f.points.map(function(p){return rotate(p,tilt,turn,0);});var a=vs[0],b=vs[1],c=vs[2],u=b.map(function(v,i){return v-a[i];}),v=c.map(function(k,i){return k-a[i];});var nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],len=Math.hypot(nx,ny,nz)||1;var light=.58+.45*Math.abs((nx*-.4+ny*.65+nz*.65)/len);return {vs:vs,z:vs.reduce(function(s,p){return s+p[2];},0)/vs.length,color:shade(f.color,light)};}).sort(function(a,b){return a.z-b.z;});
    fs.forEach(function(f){ctx.beginPath();f.vs.forEach(function(p,i){var perspective=5/(5-p[2]),x=size*.5+p[0]*scale*perspective,y=size*.48-p[1]*scale*perspective+(reduced?0:Math.sin(time*2)*size*.014);if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.color;ctx.lineWidth=.5;ctx.stroke();});
    if(!reduced)for(var i=0;i<22;i++){var angle=i*2.399+time*.18,r=size*(.3+.12*Math.sin(time+i)),x=size/2+Math.cos(angle)*r,y=size*.48+Math.sin(angle)*r*.85;ctx.globalAlpha=opacity*(.35+.6*Math.pow(Math.sin(time*2+i),2));ctx.fillStyle=i%3?'#ffe49c':'#baf1ff';ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x,y-5);ctx.lineTo(x+3,y);ctx.lineTo(x,y+5);ctx.closePath();ctx.fill();}
    ctx.globalAlpha=1;
  }
  function clear(){if(active){cancelAnimationFrame(active.raf);clearTimeout(active.timer);active.node.remove();active=null;}}
  function next(){
    if(active||!queue.length||document.hidden)return;
    var job=queue.shift(),root=document.querySelector('#screen .kt-remote-live,#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
    if(!root){queue=[];return;}
    var node=document.createElement('div');node.className='kt-gift-center-3d'+(job.singleRose?' kt-gift-single-rose':'');node.setAttribute('aria-hidden','true');
    var canvas=document.createElement('canvas'),size=Math.min(440,window.innerWidth*.85)*(job.singleRose?.1:1),ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(size*ratio);canvas.height=canvas.width;canvas.style.width=size+'px';canvas.style.height=size+'px';node.appendChild(canvas);
    var giftIndex=(window.ktalkGifts||[]).findIndex(function(g){return String(g[0])===job.name;}),originalIcon=null;
    if(giftIndex>=0&&giftIndex<50){
      originalIcon=document.createElement('div');originalIcon.style.cssText='width:'+size+'px;height:'+size+'px;filter:drop-shadow(0 0 18px #ffca7b99);';
      var x,y,view,src,w,h;
      if(giftIndex<25){x=[175,310,445,580,715][giftIndex%5];y=[205,475,742,1008,1272][Math.floor(giftIndex/5)];view=x+' '+y+' 125 130';src='gift-source.svg?v=1';w=864;h=1536;}
      else{var j=giftIndex-25;view=(j%5)*75+' '+Math.floor(j/5)*78+' 75 78';src='gift-premium-photo-source.jpg?v=20260902-fixed2';w=375;h=390;}
      originalIcon.innerHTML='<svg width="100%" height="100%" viewBox="'+view+'" preserveAspectRatio="xMidYMid meet"><image href="'+src+'" width="'+w+'" height="'+h+'"/></svg>';
      canvas.style.display='none';node.appendChild(originalIcon);
    }
    var label=document.createElement('div');label.className='kt-gift-3d-label';var title=document.createElement('b');title.textContent=job.name;label.appendChild(title);var from=document.createElement('small');from.textContent=(job.sender||'회원')+'님 · '+Number(job.cost).toLocaleString('ko-KR')+'개';label.appendChild(from);node.appendChild(label);
    var ctx=canvas.getContext('2d',{alpha:true});if(!ctx){job.fallback();next();return;}ctx.scale(ratio,ratio);document.body.appendChild(node);
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,model=build(job.name),cycleDuration=job.singleRose?1800:(reduced?2400:(job.cost>=1000?3000:2400)),duration=cycleDuration*(job.singleRose?1:3),start=performance.now(),last=0;
    active={node:node,raf:0,timer:0,job:job};var current=active;
    function finish(){if(active!==current)return;visualFinished20261015[job.key]=Date.now();clear();next();}
    function frame(now){if(active!==current)return;if(!root.isConnected||document.hidden){queue=[];clear();return;}var elapsed=now-start;if(elapsed>=duration){finish();return;}try{if(now-last>=33){last=now;var cycleElapsed=elapsed%cycleDuration,pass=Math.min(job.singleRose?1:3,Math.floor(elapsed/cycleDuration)+1);node.setAttribute('data-kt-gift-pass',String(pass));var opacity=Math.min(1,cycleElapsed/350,(cycleDuration-cycleElapsed)/500);if(originalIcon){originalIcon.style.opacity=String(Math.max(0,opacity));originalIcon.style.transform=reduced?'none':'translateY('+Math.sin(elapsed/500)*6+'px) scale('+(1+Math.sin(elapsed/350)*.025)+')';}else draw(ctx,model,elapsed/1000,size,Math.max(0,opacity),reduced);label.style.opacity=String(Math.max(0,opacity));}current.raf=requestAnimationFrame(frame);}catch(error){clear();try{job.fallback();}catch(ignore){}next();}}
    current.raf=requestAnimationFrame(frame);current.timer=setTimeout(finish,duration+300);
  }
  function present(name,cost,sender,fallback,receipt){
    if(!(Number(cost)>0))return false;
    receipt=receipt||{};
    var job={name:String(name||'선물'),cost:Number(cost),sender:String(sender||''),fallback:typeof fallback==='function'?fallback:function(){},createdAt:Date.parse(receipt.createdAt||'')||0,eventId:String(receipt.eventId||'')};
    job.singleRose=job.name==='장미'&&job.cost===1;
    job.key=giftKey20261015(giftText20261015(job));
    if(job.eventId&&visualSeen20261015[job.eventId])return true;
    if(job.createdAt&&window.ktGiftChatIsCompleted20261015&&window.ktGiftChatIsCompleted20261015(giftText20261015(job),receipt.createdAt))return true;
    var finished=visualFinished20261015[job.key]||0;
    if(finished&&(job.createdAt?oldGift20261015(job,finished):Date.now()-finished<1500))return true;
    function duplicate(other){return other&&other.key===job.key&&(!job.createdAt||!other.createdAt||Math.abs(job.createdAt-other.createdAt)<1500);}
    if((active&&duplicate(active.job))||queue.some(duplicate))return true;
    if(job.eventId)visualSeen20261015[job.eventId]=true;
    if(queue.length>=6)queue.shift();queue.push(job);next();return true;
  }
  window.addEventListener('kt-gift-announcement-finished',function(e){
    var d=e&&e.detail||{},key=giftKey20261015(d.text),at=Number(d.at||Date.now());
    if(!key)return;
    visualFinished20261015[key]=at;
    queue=queue.filter(function(job){return job.key!==key||!oldGift20261015(job,at);});
    if(active&&active.job.key===key&&oldGift20261015(active.job,at)&&Number(active.node.getAttribute('data-kt-gift-pass')||0)>=(active.job.singleRose?1:3)){clear();next();}
  });
  window.addEventListener('kt-broadcast-ended',function(){queue=[];clear();visualSeen20261015=Object.create(null);visualFinished20261015=Object.create(null);});
  window.ktPresentReceivedGift3D20261014=present;
  function hook(key){
    var original=window[key];if(typeof original!=='function'||original.__ktGiftCenter3D)return;
    var wrapped=function(name,cost,sender){var args=arguments,self=this;try{
      if(!(Number(cost)>0))return original.apply(self,args);
      return present(name,cost,sender,function(){original.apply(self,args);});
    }catch(error){queue=[];clear();return original.apply(self,args);}};
    Object.keys(original).forEach(function(k){wrapped[k]=original[k];});
    wrapped.__ktGiftCenter3D=true;window[key]=wrapped;
  }
  var style=document.createElement('style');style.textContent='.kt-gift-center-3d{position:fixed;left:50%;top:46%;transform:translate(-50%,-50%);z-index:2147483646;pointer-events:none!important;display:flex;flex-direction:column;align-items:center;max-width:95vw}.kt-gift-center-3d canvas{display:block;pointer-events:none!important}.kt-gift-3d-label{max-width:85vw;margin-top:-18px;padding:9px 22px;border:1px solid #ffe39988;border-radius:20px;background:linear-gradient(120deg,#20152ee8,#4a2a45e8);box-shadow:0 8px 28px #0005;color:#fff;text-align:center;font:700 16px system-ui}.kt-gift-3d-label b,.kt-gift-3d-label small{display:block;overflow-wrap:anywhere}.kt-gift-3d-label small{font-size:11px;margin-top:4px;color:#ffe5a2}';style.textContent+='.kt-gift-single-rose .kt-gift-3d-label{margin-top:4px;padding:5px 10px;font-size:12px;border-radius:12px}.kt-gift-single-rose .kt-gift-3d-label small{font-size:10px;margin-top:2px}';document.head.appendChild(style);
  hook('showPremiumGiftFx');hook('showSmallGiftFx');
  window.addEventListener('pagehide',function(){queue=[];clear();});document.addEventListener('visibilitychange',function(){if(document.hidden){queue=[];clear();}});
  /* Pure renderer for offline visual checks; it never sends a gift. */
  window.ktGift3DRenderer={build:build,draw:draw};
})();

