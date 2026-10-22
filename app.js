/* LIORA Creative Studio – site script. All text, photos, prices and links come from /content/*.json (edited through Pages CMS). */
var CONTENT={};
(function(){
var names=["site","categories","reviews","pages","portrait-photos","event-photos","posters","commissions","design-projects","trips","services","instagram-posts","tiktok-posts","terms"];
function J(n){return fetch("/content/"+n+".json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})}
function A(x,d){return Array.isArray(x)&&x.length?x:d}
function E(n){var a=[];for(var i=0;i<n;i++)a.push("");return a}
function paras(t){return String(t||"").split(/\n\s*\n/).map(function(x){return x.trim()}).filter(Boolean)}
function meta(t){return String(t||"").split("\n").map(function(l){var i=l.indexOf(":");return i<0?null:[l.slice(0,i).trim(),l.slice(i+1).trim()]}).filter(Boolean)}
function mkph(label,n){var a=[];for(var i=1;i<=n;i++)a.push({img:"",hd:"",caption:label+" "+i,year:""});return a}
function pho(list,label,n){return A(list,mkph(label,n)).map(function(p,i){return{img:p.img||"",hd:p.hd||"",cap:p.caption||label+" "+(i+1),year:p.year||""}})}
function post(p){var t=p.type||"image",im=Array.isArray(p.images)?p.images:[];return t=="video"?{type:"video",src:p.video||"",href:p.link||""}:t=="carousel"?{type:"carousel",src:im.length?im:E(3),href:p.link||""}:{type:"image",src:im[0]||"",href:p.link||""}}
function parseTerms(t){var secs=[],cur=null,para=[],ul=null;
  function ensure(){if(!cur){cur={t:"",b:[]};secs.push(cur)}}
  function flush(){if(para.length){ensure();cur.b.push(["p",para.join(" ")]);para=[]}if(ul){ensure();cur.b.push(["u",ul]);ul=null}}
  String(t||"").split("\n").forEach(function(l){var x=l.trim();
    if(!x){flush();return}
    if(/^##\s/.test(x)&&!/^###/.test(x)){flush();cur={t:x.replace(/^##\s+/,""),b:[]};secs.push(cur);return}
    if(/^###\s/.test(x)){flush();ensure();cur.b.push(["h",x.replace(/^###\s+/,"")]);return}
    if(/^[-*]\s/.test(x)){if(para.length){ensure();cur.b.push(["p",para.join(" ")]);para=[]}ul=ul||[];ul.push(x.replace(/^[-*]\s+/,""));return}
    if(ul){ensure();cur.b.push(["u",ul]);ul=null}para.push(x)});
  flush();return secs}
var GR=["linear-gradient(150deg,#F4C430,#2B2B2D)","linear-gradient(210deg,#F4C430,#4a4528 60%,#2B2B2D)","linear-gradient(120deg,#2B2B2D,#F4C430)","linear-gradient(180deg,#F3F1EA,#F4C430 60%,#2B2B2D)"];
function build(D){
  var site=D.site||{},pg=D.pages||{};
  /* static text + links */
  [].forEach.call(document.querySelectorAll("[data-t]"),function(el){var v=site[el.getAttribute("data-t")];if(typeof v=="string"&&v.trim())el.textContent=v});
  [].forEach.call(document.querySelectorAll("[data-link]"),function(el){var k=el.getAttribute("data-link"),v=site[k];if(typeof v=="string"&&v.trim())el.href=v;
    if(k=="youtube"){var h=document.querySelector('[data-hide="youtube"]');if(h)h.style.display=(v&&v.trim())?"":"none"}});
  if(typeof site.marquee=="string"&&site.marquee.trim())[].forEach.call(document.querySelectorAll("#mq span"),function(s){s.textContent=site.marquee});
  /* data */
  CONTENT.portrait={img:site.my_photo||""};
  var ptr=pho(D["portrait-photos"],"Portrait",9),evt=pho(D["event-photos"],"Event",9);
  var rp=A(site.random_photos,null);
  var seen={};CONTENT.photos=[].concat(rp||[],ptr.map(function(p){return p.img}),evt.map(function(p){return p.img}),A(D.posters,[]).map(function(p){return p.img}),A(D.commissions,[]).map(function(p){return p.img})).filter(function(x){if(!x||seen[x])return false;seen[x]=1;return true}).map(function(x){return{img:x}});
  if(!CONTENT.photos.length)CONTENT.photos=E(11).map(function(){return{img:""}});
  var KNOWN={"/portrait-photography":1,"/event-photography":1,"/graphic-design":1,"/trip-planning":1};
  function catTo(c){var t=(c.to||"").trim();if(KNOWN[t])return t;var n=(c.name||"").toLowerCase();return/portrait/.test(n)?"/portrait-photography":/event/.test(n)?"/event-photography":/design/.test(n)?"/graphic-design":/trip|travel|itiner/.test(n)?"/trip-planning":"/portfolio"}
  CONTENT.categories=A(D.categories,[]).map(function(c,i){return{name:c.name,to:catTo(c),img:c.img||"",grad:GR[i%GR.length]}});
  CONTENT.reviews=A(D.reviews,[{text:"",by:""}]);
  CONTENT.pages={
   ptr:{title:"PORTRAIT PHOTOGRAPHY",next:["/event-photography","NEXT: EVENT PHOTOGRAPHY"],photos:ptr,text:paras(pg.portrait_text),tag:pg.portrait_tagline||""},
   evt:{title:"EVENT PHOTOGRAPHY",next:["/portrait-photography","NEXT: PORTRAIT PHOTOGRAPHY"],photos:evt,text:paras(pg.event_text),tag:pg.event_tagline||""},
   psr:{photos:A(D.posters,mkph("Poster",14)).map(function(p,i){return{img:p.img||"",hd:"",alt:p.alt?p.alt:undefined,ar:.667,arAlt:1.33,cap:p.caption||"Poster "+(i+1),year:p.year||""}})},
   ext:{photos:pho(D.commissions,"Commission",8)}};
  CONTENT.design={intro:paras(pg.design_intro).join("\n\n"),projects:A(D["design-projects"],[]).map(function(p){var im=A(p.images,E(5));var sl=function(x){return Array.isArray(x)?x:[]};return{title:p.title||"",sub:p.subtitle||"",img:p.img||im[0]||"",desc:p.desc||"",ss:[{imgs:sl(p.slideshow_1),at:p.slideshow_1_after},{imgs:sl(p.slideshow_2),at:p.slideshow_2_after}],meta:meta(p.details),imgs:im}})};
  var ti=paras(pg.trip_intro),tt=(pg.trip_tagline||"").trim();if(!tt&&ti.length>1)tt=ti.pop();
  CONTENT.tripIntro=ti;CONTENT.tripTag=tt;CONTENT.designTag=(pg.design_tagline||"").trim()||"Bold ideas. Thoughtful details. Designs made to be remembered.";
  CONTENT.trips=A(D.trips,[]).map(function(t,i){return{title:t.title||"Destination "+(i+1),sub:t.subtitle||"",cover:t.cover||"",stub:t.ticket_text===undefined?"ADMIT ONE":t.ticket_text,stubAt:1,leafAt:4,polyCap:t.slideshow_caption||"",desc:t.desc||"",
    meta:meta(t.details),slides:A(t.slideshow,E(4)),notes:A(t.itinerary_screenshots,E(5)),moments:A(A(t.moments,[]).concat(A(t.moment_videos,[])),E(6)),
    mapImg:t.map_image||"",lat:t.latitude,lon:t.longitude,reviews:[1,2,3].map(function(n){return{text:t["review"+n+"_text"],by:t["review"+n+"_by"]||""}}).filter(function(r){return r.text})}});
  CONTENT.svc=A(D.services,[]).map(function(s){return{name:s.name||"",desc:s.desc||"",price:s.price||"",img:s.img||""}});
  CONTENT.guideUrl=site.guide_pdf||"";
  CONTENT.guide={heading:site.guide_heading||"LIKE WHAT YOU SEE?",text:site.guide_text||""};
  CONTENT.formKey=(site.form_key||"").trim();
  CONTENT.contact={email:(site.email||"lioracreativeagency@gmail.com").trim(),linkedin:site.linkedin||"",instagram:site.instagram||"",tiktok:site.tiktok||"",
    instagramPosts:A(D["instagram-posts"],[]).map(post),tiktokPosts:A(D["tiktok-posts"],[]).map(post)};
  CONTENT.terms=A(D.terms,[]).map(function(t){return{name:t.name||"",sec:parseTerms(t.body)}});
}
Promise.all(names.map(J)).then(function(a){var D={};names.forEach(function(n,i){D[n]=a[i]});build(D);start()});
function start(){
function bg(o,i){return o.img?"url('"+String(o.img).replace(/'/g,"%27")+"') center/cover":(o.grad||"linear-gradient("+((i*47)%360)+"deg,hsl(45 "+(30+(i*13)%60)+"% "+(22+(i*9)%30)+"%),#2B2B2D)")}
function $(i){return document.getElementById(i)}
/* random photos on every load */
var pool=CONTENT.photos.map(function(p,i){return{p:p,i:i}}).sort(function(){return Math.random()-.5});
document.querySelectorAll(".it").forEach(function(t,k){var o=pool[k%pool.length];t.style.background=bg(o.p,o.i)});
if(CONTENT.portrait.img){var meF=$("me").parentNode;meF.classList.add("real");meF.innerHTML=pic(CONTENT.portrait.img,"Sharleen Mahembe")}
/* portfolio list */
var cats=$("cats"),rev=document.createElement("div");rev.className="reveal";cats.appendChild(rev);
CONTENT.categories.forEach(function(c){
  var li=document.createElement("li"),a=document.createElement("a"),p=document.createElement("div");
  a.href=c.to||"/portfolio";a.textContent=c.name;li.appendChild(a);cats.insertBefore(li,rev);p.style.background=bg(c);rev.appendChild(p);
  function on(){document.body.classList.add("hov");p.classList.add("on")}function off(){document.body.classList.remove("hov");p.classList.remove("on")}
  a.addEventListener("pointerenter",on);a.addEventListener("pointerleave",off);a.addEventListener("focus",on);a.addEventListener("blur",off);
});
/* reviews slideshow */
var sl=$("slides"),dt=$("dots"),cur=0,timer;
CONTENT.reviews.forEach(function(r,i){
  var f=document.createElement("figure");f.innerHTML="<blockquote>"+esc(r.text)+"</blockquote><span class='sm'>"+esc(r.by)+"</span>";sl.appendChild(f);
  var b=document.createElement("button");b.setAttribute("aria-label","Review "+(i+1));b.onclick=function(){go(i);auto()};dt.appendChild(b);
});
function go(i){cur=i;var n=sl.children.length;[].forEach.call(sl.children,function(f,k){var o=(k-i+n)%n;f.style.transform=["none","rotate(4deg) translate(22px,16px)","rotate(-4deg) translate(-20px,22px)"][o]||"scale(.9)";f.style.opacity=o==0?1:o<3?.5:0;f.style.zIndex=n-o});[].forEach.call(dt.children,function(b,k){b.classList.toggle("on",k==i)})}
function auto(){clearInterval(timer);timer=setInterval(function(){go((cur+1)%CONTENT.reviews.length)},5500)}
function fitRev(){[].forEach.call(sl.children,function(f){var q=f.querySelector("blockquote");if(!q)return;q.style.fontSize="";var s=parseFloat(getComputedStyle(q).fontSize);while(f.scrollHeight>f.clientHeight+1&&s>13){s-=1;q.style.fontSize=s+"px"}})}
fitRev();addEventListener("resize",fitRev);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitRev);
go(0);auto();
/* page switching with a yellow wipe + real URLs (History API) */
var ROUTES={"/":"home","/portfolio":"pf","/portrait-photography":"ptr","/event-photography":"evt","/graphic-design":"dsn","/trip-planning":"trp","/services":"svc","/contact":"ct","/ts-cs":"tc"},
 META={"home": ["Bristol Photographer & Graphic Designer | LIORA Creative Studio", "LIORA Creative Studio offers portrait, event and wedding photography, graphic design, wedding stationery, custom posters and bespoke trip itineraries. Based in Bristol, working between South-West England and London."], "pf": ["Portfolio | LIORA Creative Studio", "Browse the portfolio of Sharleen Mahembe: portrait and event photography, graphic design and trip itineraries."], "ptr": ["Bristol Portrait Photographer | LIORA Creative Studio", "Relaxed, authentic portrait photography in Bristol: headshots, editorial portraits, couples, families and groups, delivered with professional editing."], "evt": ["Bristol Event Photographer | LIORA Creative Studio", "Event photography in Bristol, the South West and London: weddings, corporate events, concerts, birthdays and celebrations, with fast delivery and professional editing."], "dsn": ["Bristol Graphic Designer | LIORA Creative Studio", "Bristol graphic designer creating wedding stationery, custom posters, brochures, magazines and print-ready design that reflects your story or brand."], "trp": ["Trip Itineraries | LIORA Creative Studio", "Personalised trip itineraries, flights and accommodation planning that take the stress out of travelling, from city breaks to group trips."], "svc": ["Photography & Graphic Design Services in Bristol | LIORA Creative Studio", "Services and starting prices: portrait, event and wedding photography, poster and wedding stationery design, printed materials and bespoke trip planning in Bristol."], "ct": ["Contact | LIORA Creative Studio", "Get in touch with LIORA Creative Studio to book a photoshoot, commission a design or plan a trip."], "tc": ["Terms & Conditions | LIORA Creative Studio", "Terms and conditions for portrait and event photography, graphic design and trip planning services from LIORA Creative Studio."]},
 PATHS={"home": "/", "pf": "/portfolio", "ptr": "/portrait-photography", "evt": "/event-photography", "dsn": "/graphic-design", "trp": "/trip-planning", "svc": "/services", "ct": "/contact", "tc": "/ts-cs"},
 cv="home",wipe=$("wipe"),busy=false;
function norm(p){p=(p||"/").replace(/\/index\.html$/,"/").replace(/\/+$/,"");return p||"/"}
function show(p,h){var k=ROUTES[norm(p)]||"home";["home","pf","ptr","evt","dsn","trp","svc","ct","tc"].forEach(function(n){$(n).classList.toggle("on",n==k)});cv=k;document.body.classList.remove("hov");
  document.title=META[k][0];var md=document.querySelector('meta[name="description"]'),cn=document.querySelector('link[rel="canonical"]');if(md)md.setAttribute("content",META[k][1]);if(cn)cn.setAttribute("href","https://lioracreativestudio.com"+(PATHS[k]=="/"?"/":PATHS[k]));
  var el=null;if(k=="home"&&h&&h.length>1){try{el=document.querySelector(h)}catch(e){}}if(el)el.scrollIntoView();else scrollTo(0,0);if(k=="ptr"||k=="evt")sizeHS(k)}
function nav(p,h,push){h=h||"";var same=(ROUTES[norm(p)]||"home")==cv;
  function doit(){if(push&&(norm(p)+h)!==(location.pathname+location.hash))history.pushState(null,"",norm(p)+h);show(p,h)}
  if(same){doit();return}if(busy)return;busy=true;wipe.className="wipe in";
  setTimeout(function(){doit();wipe.className="wipe out";setTimeout(function(){wipe.className="wipe";busy=false},520)},520)}
document.addEventListener("click",function(e){var a=e.target.closest("a[href]");if(!a||a.target=="_blank"||a.hasAttribute("download")||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;
  var u;try{u=new URL(a.href,location.href)}catch(x){return}if(u.origin!==location.origin||/\.[a-z0-9]{2,4}$/i.test(u.pathname)&&!/\.html$/.test(u.pathname))return;
  e.preventDefault();nav(u.pathname,u.hash,true)});
addEventListener("popstate",function(){show(location.pathname,location.hash)});
try{history.scrollRestoration="manual"}catch(e){}
var EMFN=function(){return EM};
$("f").addEventListener("submit",function(e){e.preventDefault();var f=this,btn=$("sub"),note=$("fn"),key=CONTENT.formKey;
  if(!key){note.textContent="The form isn't connected yet – please email "+EM+" directly.";return}
  var fd=new FormData(f);fd.append("access_key",key);fd.append("name",(fd.get("first_name")||"")+" "+(fd.get("last_name")||""));fd.append("subject","New enquiry from lioracreativestudio.com");fd.append("from_name","LIORA website");
  btn.disabled=true;btn.textContent="SENDING…";note.textContent="";
  fetch("https://api.web3forms.com/submit",{method:"POST",body:fd}).then(function(r){return r.json()}).then(function(j){
    if(j.success){f.reset();btn.textContent="SENT – THANK YOU!";note.textContent="Thank you! I'll be in touch soon.";setTimeout(function(){btn.textContent="SUBMIT";btn.disabled=false},5000)}
    else throw 0}).catch(function(){btn.disabled=false;btn.textContent="SUBMIT";note.textContent="Something went wrong – please try again, or email "+EM+" directly."})});
/* intro: logo fills with yellow while loading, then flies to the header */
var im=$("im"),is=$("is"),hl=$("hl"),loaded=false,t0=Date.now(),p=0,flown=false;
function lay(){var w=Math.min(innerWidth*.5,440),h=w*680/900;im.style.width=is.style.width=w+"px";im.style.left=is.style.left=(innerWidth-w)/2+"px";im.style.top=(innerHeight-h)/2-14+"px";is.style.top=(innerHeight+h)/2+4+"px"}
var skipIntro=norm(location.pathname)!=="/"||location.hash.length>1||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
lay();
if(skipIntro){hl.style.visibility="visible";$("intro").remove();document.body.classList.remove("lock");document.body.classList.add("go");flown=true;loaded=true}
else setTimeout(function(){document.querySelectorAll(".it").forEach(function(t,k){setTimeout(function(){t.classList.add("on")},k*220)})},200);
Promise.all([document.fonts?document.fonts.ready:0,new Promise(function(r){if(document.readyState=="complete")r();else addEventListener("load",r)})]).then(function(){loaded=true});
(function tick(){
  if(skipIntro)return;p+=((loaded?100:88)-p)*.045;im.style.setProperty("--p",p);is.style.setProperty("--p",p);
  if(loaded&&p>99.3&&Date.now()-t0>2400&&!flown){flown=true;fly();return}
  requestAnimationFrame(tick)})();
function fly(){
  var r=hl.getBoundingClientRect();$("intro").classList.add("fly");
  im.style.left=r.left+"px";im.style.top=r.top+"px";im.style.width=r.width+"px";
  setTimeout(function(){hl.style.visibility="visible";$("intro").remove();document.body.classList.remove("lock");document.body.classList.add("go")},1200)}
/* black-and-white cursor reveal */
var rv=$("rv"),lx=-999,ly=-999,lastP=0,vis=false;
function spawn(x,y){var o=pool[Math.floor(Math.random()*pool.length)],w=110+Math.random()*150,r=[.75,.8,1,1.33][Math.floor(Math.random()*4)],d=document.createElement("div");
  d.className="rp";d.style.cssText="width:"+w+"px;height:"+w/r+"px;left:"+(x-w/2)+"px;top:"+(y-w/r/2)+"px;background:"+bg(o.p,o.i);
  rv.appendChild(d);requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add("on")})});
  setTimeout(function(){d.classList.add("off")},1700);setTimeout(function(){d.remove()},2400)}
rv.addEventListener("pointermove",function(e){var b=rv.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;lastP=Date.now();
  if(Math.hypot(x-lx,y-ly)>110){lx=x;ly=y;spawn(x,y)}});
new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(rv);
setInterval(function(){if(vis&&Date.now()-lastP>2000){var b=rv.getBoundingClientRect();spawn(b.width*(.15+Math.random()*.7),b.height*(.2+Math.random()*.6))}},1000);
/* portrait and event pages (edit this block, or let the CMS) */
var AR=[.75,.8,1,.67,.8,.75,1.33,.8,.75],HH=[68,62,72,64,70,63,60,72,66],MT=[0,-7,5,-4,8,-6,4,-8,3],io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
function pad(n){return(n<10?"0":"")+n}
function buildG(id){var P=CONTENT.pages[id],fr=P.photos.map(function(p,i){return'<button class="fr g'+(p.img?' real':'')+'" type="button" data-p="'+id+'" data-i="'+i+'" aria-label="Open '+p.cap+'" style="'+(p.img?'':'aspect-ratio:'+AR[i%AR.length]+';')+'height:'+HH[i%HH.length]+'vh;margin-top:'+MT[i%MT.length]+'vh">'+(p.img?pic(p.img,p.cap):'<div class="ph" style="background:'+bg({img:p.img},i+(id=="evt"?5:0))+'"></div>')+'</button>'}).join("");
  $(id).innerHTML='<a class="sm" href="/portfolio" style="color:var(--yel)">← PORTFOLIO</a><div class="ic" style="margin-top:1.4rem"></div><h1>'+P.title+'</h1><div class="gi"><div>'+P.text.map(function(x){return"<p>"+x+"</p>"}).join("")+'</div><p class="tag">'+P.tag+'</p></div><div class="tg sm"><button class="on" data-m="strip" type="button">STRIP</button><span>/</span><button data-m="grid" type="button">GRID</button></div><div class="hs"><div class="hsv"><div class="hst">'+fr+'</div><div class="hsb"><span class="sm" id="'+id+'n">01 / '+pad(P.photos.length)+'</span><i><b></b></i></div></div></div><div style="text-align:center;padding:4vh 0 2vh"><a class="btn sm" href="'+P.next[0]+'">'+P.next[1]+'</a></div>';
  $(id).querySelectorAll(".g").forEach(function(g){io.observe(g)})}
function hsMax(t){var c=t.children;if(!c.length)return 0;var f=c[0],l=c[c.length-1];t.style.paddingLeft=Math.max(0,(innerWidth-f.offsetWidth)/2)+"px";t.style.paddingRight=Math.max(0,(innerWidth-l.offsetWidth)/2)+"px";return Math.max(0,l.offsetLeft+l.offsetWidth/2-innerWidth/2)}
function sizeHS(id){var v=$(id),t=v.querySelector(".hst");t._mx=hsMax(t);v.querySelector(".hs").style.height=(t._mx+innerHeight)+"px";hsUpdate()}
function hsUpdate(){if(cv!="ptr"&&cv!="evt"||$(cv).classList.contains("gmode"))return;var v=$(cv),hs=v.querySelector(".hs"),t=v.querySelector(".hst"),span=hs.offsetHeight-innerHeight,
  p=span>0?Math.max(0,Math.min(1,-hs.getBoundingClientRect().top/span)):0,c=innerWidth/2,best=0,bd=1e9;
  t.style.transform="translate3d("+(-p*(t._mx||0))+"px,0,0)";
  [].forEach.call(t.children,function(f,i){var b=f.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-c)/innerWidth;if(d<bd){bd=d;best=i}
    f.style.transform="scale("+Math.max(.92,1-d*.16)+")";f.style.opacity=Math.max(.45,1-d*.9)});
  $(cv+"n").textContent=pad(best+1)+" / "+pad(t.children.length);v.querySelector(".hsb b").style.transform="scaleX("+p+")"}
buildG("ptr");buildG("evt");
["ptr","evt"].forEach(function(id){[].forEach.call($(id).querySelectorAll(".pic"),function(im){im.addEventListener("load",function(){if(cv==id)sizeHS(id)})})});
var rafP=0;addEventListener("scroll",function(){if(rafP)return;rafP=requestAnimationFrame(function(){rafP=0;hsUpdate()})},{passive:true});
addEventListener("resize",function(){if(cv=="ptr"||cv=="evt")sizeHS(cv)});
/* click-to-enlarge */
var lb=$("lb"),lbl=null,lbi=0,lbAlt=false,dragMoved=false;
function lbShow(id,i,alt){var P=CONTENT.pages[id].photos;lbl=id;lbi=(i+P.length)%P.length;var p=P[lbi],ph=$("lbph");
  var src=alt?p.alt:(p.hd||p.img);
  if(src){ph.className="lbph real";ph.style.background="none";ph.innerHTML='<img src="'+String(src).replace(/"/g,"%22")+'" alt="">'}
  else{ph.className="lbph";ph.innerHTML="";ph.style.setProperty("--ar",alt?(p.arAlt||1.33):(p.ar||AR[lbi%AR.length]));ph.style.background=bg({img:src},lbi+(id=="evt"?5:0)+(alt?9:0))}
  lbAlt=!!alt;
  $("lbc").textContent=(p.year||"")+"  ·  "+(lbi+1)+" / "+P.length+(p.alt!==undefined?"  ·  CLICK IMAGE FOR IN-PLACE VIEW":"");lb.classList.add("on");document.body.classList.add("lock")}
function lbHide(){lb.classList.remove("on");document.body.classList.remove("lock")}
document.addEventListener("click",function(e){var g=e.target.closest(".g");if(g){if(dragMoved){dragMoved=false;return}lbShow(g.dataset.p,+g.dataset.i);return}
  if(!lb.classList.contains("on"))return;
  if(e.target.closest("#lbx")||e.target===lb)lbHide();else if(e.target.closest("#lbp"))lbShow(lbl,lbi-1);else if(e.target.closest("#lbn"))lbShow(lbl,lbi+1);else if(e.target.closest("#lbph")&&CONTENT.pages[lbl].photos[lbi].alt!==undefined)lbShow(lbl,lbi,!lbAlt)});
addEventListener("keydown",function(e){if(!lb.classList.contains("on"))return;if(e.key=="Escape")lbHide();if(e.key=="ArrowLeft")lbShow(lbl,lbi-1);if(e.key=="ArrowRight")lbShow(lbl,lbi+1)});
/* graphic design + trip pages (content lives here; the CMS fills it) */
var back='<a class="sm" href="/portfolio" style="color:var(--yel)">← PORTFOLIO</a><div class="ic" style="margin-top:1.4rem"></div>';
function card(attr,p,i){return'<button class="card" type="button" '+attr+'="'+i+'"><span class="fr"><div class="ph" style="background:'+bg({img:p.img||p.cover},i+3)+'"></div></span><h3>'+p.title+'</h3><small>'+p.sub+'</small></button>';}
$("dsn").innerHTML=back+'<h1>GRAPHIC DESIGN</h1><div class="gi"><div><p>'+CONTENT.design.intro.split("\n\n").join("</p><p>")+'</p></div><p class="tag">'+CONTENT.designTag+'</p></div><div class="tabs sm"><button data-t="s1">PROJECTS</button><button data-t="s2">POSTERS</button><button data-t="s3">COMMISSIONS</button></div>'
 +'<section class="sec" id="s1"><h2>Projects</h2><p>Case studies with a story behind them. Click one to open it.</p><div class="cards">'+CONTENT.design.projects.map(function(p,i){return card("data-pj",p,i)}).join("")+'</div></section>'
 +'<section class="sec" id="s2"><h2>Poster wall</h2><p>Drag them around. Click one to see it in place.</p><div class="pw" id="pw"><span class="sm">DRAG · CLICK</span></div></section>'
 +'<section class="sec" id="s3"><h2>One-off commissions</h2><p>Bespoke pieces created for a single client or occasion, from custom artwork and merchandise to one-time design requests.</p><div class="ext">'+CONTENT.pages.ext.photos.map(function(p,i){return'<button class="fr g'+(p.img?' real':'')+'" type="button" data-p="ext" data-i="'+i+'" aria-label="Open '+p.cap+'"'+(p.img?'>'+pic(p.img,p.cap):' style="aspect-ratio:'+["4/3","3/4","1/1","4/5"][i%4]+'"><div class="ph" style="background:'+bg({img:p.img},i+11)+'"></div>')+'</button>'}).join("")+'</div></section>';
$("dsn").querySelectorAll(".g").forEach(function(g){io.observe(g)});
$("trp").innerHTML=back+'<h1>TRIP ITINERARIES</h1><div class="gi"><div>'+CONTENT.tripIntro.map(function(x){return"<p>"+x+"</p>"}).join("")+'</div><p class="tag">'+CONTENT.tripTag+'</p></div><div class="cards" style="margin-top:6vh">'+CONTENT.trips.map(function(p,i){return card("data-tr",p,i)}).join("")+'</div>';
var pw=$("pw"),zi=5,dr=null;
CONTENT.pages.psr.photos.forEach(function(p,i){var d=document.createElement("div");d.className="po g";d.dataset.p="psr";d.dataset.i=i;
  d.style.cssText="width:"+(110+(i*29)%60)+"px;"+(p.img?"":"aspect-ratio:2/3;")+"left:"+(4+(i*37)%70)+"%;top:"+(8+(i*53)%62)+"%;--r:"+(((i*7)%9)-4)+"deg";d.innerHTML=p.img?pic(p.img,p.cap):'<div style="background:'+bg({img:p.img},i+2)+'"></div>';pw.appendChild(d)});
pw.addEventListener("pointerdown",function(e){var el=e.target.closest(".po");if(!el)return;dr={el:el,x:e.clientX,y:e.clientY,l:el.offsetLeft,t:el.offsetTop};el.style.zIndex=++zi;el.setPointerCapture(e.pointerId);dragMoved=false});
pw.addEventListener("pointermove",function(e){if(!dr)return;var dx=e.clientX-dr.x,dy=e.clientY-dr.y;if(Math.abs(dx)+Math.abs(dy)>5)dragMoved=true;if(!dragMoved)return;
  dr.el.style.left=Math.max(0,Math.min(pw.clientWidth-dr.el.offsetWidth,dr.l+dx))+"px";dr.el.style.top=Math.max(0,Math.min(pw.clientHeight-dr.el.offsetHeight,dr.t+dy))+"px"});
pw.addEventListener("pointerup",function(){dr=null;setTimeout(function(){dragMoved=false},60)});
/* expanding project panel */
var pj=$("pj"),pjc=null,pjT=null;
function rectClip(c){var r=c.getBoundingClientRect();return"inset("+r.top+"px "+(innerWidth-r.right)+"px "+(innerHeight-r.bottom)+"px "+r.left+"px round 6px)"}
function openPanel(c,html,cb){$("pji").innerHTML=html;pj.style.transition="none";pj.style.clipPath=rectClip(c);pj.classList.add("on");pj.scrollTop=0;document.body.classList.add("lock");pjc=c;
  void pj.offsetWidth;pj.style.transition="clip-path .7s cubic-bezier(.7,0,.2,1)";pj.style.clipPath="inset(0 0 0 0 round 0)";if(cb)cb()}
function closePanel(){if(!pjc)return;clearInterval(pjT);pjTs.forEach(clearInterval);pj.style.clipPath=rectClip(pjc);var c=pjc;pjc=null;setTimeout(function(){pj.classList.remove("on");document.body.classList.remove("lock")},700)}
function ssHTML(imgs){return'<div class="pss">'+imgs.map(function(s,i){return'<img'+(i==0?' class="on"':'')+' src="'+String(s).replace(/"/g,"%22")+'" alt="" decoding="async">'}).join("")+'</div>'}
function projHTML(p){var L=p.imgs.length,out=[],sh=(p.ss||[]).filter(function(s){return s.imgs.length});
  sh.forEach(function(s){var a=parseInt(s.at,10);s._a=(s.at===""||s.at==null||isNaN(a))?L:Math.max(0,Math.min(L,a))});
  function put(n){sh.forEach(function(s){if(s._a===n)out.push(ssHTML(s.imgs))})}
  put(0);p.imgs.forEach(function(s,i){out.push(s?'<img class="pic'+(i==0?' w':'')+'" src="'+String(s).replace(/"/g,"%22")+'" alt="" decoding="async">':'<div'+(i==0?' class="w"':'')+' style="background:'+bg({img:s},i+3)+'"></div>');put(i+1)});
  return'<h2>'+p.title+'</h2><div class="pm"><ul>'+p.meta.map(function(m){return'<li><b>'+m[0]+'</b>'+m[1]+'</li>'}).join("")+'</ul><div class="dp">'+dpar(p.desc)+'</div></div><div class="pim">'+out.join("")+'</div>'}
var pjTs=[];function pshows(){pjTs.forEach(clearInterval);pjTs=[];[].forEach.call(document.querySelectorAll("#pji .pss"),function(el){var im=el.children,k=0;if(im.length<2)return;pjTs.push(setInterval(function(){im[k].classList.remove("on");k=(k+1)%im.length;im[k].classList.add("on")},2000))})}
function dpar(x){return String(x||"").split(/\n\s*\n/).map(function(s){return"<p>"+esc(s.trim())+"</p>"}).join("")}
function fmtC(v,p,n){v=parseFloat(v);if(isNaN(v))return"";return Math.abs(v).toFixed(4)+"° "+(v>=0?p:n)}
function mapHTML(t){var la=fmtC(t.lat,"N","S"),lo=fmtC(t.lon,"E","W");if(!t.mapImg&&!(la&&lo))return"";
  var pin='<svg class="pin" viewBox="0 0 40 52"><path d="M20 2C10 2 3 9.6 3 19c0 12 17 31 17 31s17-19 17-31C37 9.6 30 2 20 2z" fill="#F4C430" stroke="#2B2B2D" stroke-width="2"/><circle cx="20" cy="19" r="6.5" fill="#2B2B2D"/></svg>';
  var art=t.mapImg?'<div class="mimg" style="background:url(\''+String(t.mapImg).replace(/'/g,"%27")+'\') center/cover"></div>':'<svg class="mgr" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice"><rect width="320" height="240" fill="#1d1d1f"/><g stroke="#3b3b3e" stroke-width="1"><path d="M0 40H320M0 80H320M0 120H320M0 160H320M0 200H320M40 0V240M80 0V240M120 0V240M160 0V240M200 0V240M240 0V240M280 0V240"/></g><g fill="none" stroke="#F4C430" stroke-opacity=".35" stroke-width="2.4"><path d="M-10 190C60 170 90 120 150 128S250 70 330 40"/><path d="M-10 60C40 80 70 70 110 100"/></g><g fill="none" stroke="#6a6a6e" stroke-width="1.4"><path d="M20 240L90 150L160 120L300 160M160 120L200 0M90 150L60 0M220 240L240 140"/></g><circle cx="160" cy="120" r="54" fill="none" stroke="#F4C430" stroke-opacity=".25" stroke-dasharray="3 6"/><circle cx="160" cy="120" r="96" fill="none" stroke="#F4C430" stroke-opacity=".15" stroke-dasharray="3 8"/></svg>';
  return'<div class="mapc"><div class="mw">'+art+'<span class="pulse"></span>'+pin+'</div>'+(la&&lo?'<p class="sm">'+la+' · '+lo+'</p>':'')+'</div>'}
function tripHTML(t){var nn=t.notes.filter(Boolean);if(nn.length){CONTENT.pages.itn={photos:nn.map(function(n){var o={img:n,hd:n,cap:t.title+" itinerary",year:"",ar:.5625},im=new Image();im.onload=function(){if(im.naturalWidth)o.ar=im.naturalWidth/im.naturalHeight};im.src=n;return o})}}
  return'<div class="th"><div class="dp"><h2>'+t.title+'</h2>'+dpar(t.desc)+'</div>'+mapHTML(t)+'</div><div class="pm"><ul>'+t.meta.map(function(m){return'<li><b>'+m[0]+'</b>'+m[1]+'</li>'}).join("")+'</ul><div class="poly" id="poly">'+t.slides.map(function(s,i){return'<i'+(i==0?' class="on"':'')+' style="background:'+bg({img:s},i+5)+'"></i>'}).join("")+'<span>'+(t.polyCap||t.title+", 2026")+'</span></div></div>'
  +'<h3>The itinerary</h3><div class="notes">'+t.notes.map(function(n,i){return n?'<button class="note g real" type="button" data-p="itn" data-i="'+i+'" style="--r:'+(((i*5)%7)-3)+'deg" aria-label="Enlarge itinerary page '+(i+1)+'"><img src="'+n+'" alt="Itinerary page '+(i+1)+'" loading="lazy"></button>':'<div class="note" style="--r:'+(((i*5)%7)-3)+'deg">Itinerary screenshot</div>'}).join("")+'</div>'
  +'<h3>Moments</h3><div class="mo">'+t.moments.map(function(m,i){var vid=/\.(mp4|mov|webm|m4v)$/i.test(m);return'<div style="background:'+(vid?'#1b1b1d':bg({img:m},i+7))+'">'+(vid?'<video src="'+m+'" autoplay muted loop playsinline></video>':'')+'</div>'}).join("")+'</div>'
  +'<h3>In their words</h3><div class="rev">'+t.reviews.map(function(r){return'<blockquote>'+r.text+'<span>'+r.by+'</span></blockquote>'}).join("")+'</div>'}
function slideshow(){var s=document.querySelectorAll("#poly i"),k=0;clearInterval(pjT);pjT=setInterval(function(){s[k].classList.remove("on");k=(k+1)%s.length;s[k].classList.add("on")},1800)}
document.addEventListener("click",function(e){var c=e.target.closest("[data-pj]"),t=e.target.closest("[data-tr]"),tb=e.target.closest(".tabs button"),m=e.target.closest(".tg button");
  if(c)openPanel(c,projHTML(CONTENT.design.projects[+c.dataset.pj]),pshows);else if(t)openPanel(t,tripHTML(CONTENT.trips[+t.dataset.tr]),slideshow);else if(e.target.closest("#pjx"))closePanel();
  else if(tb){var s=$(tb.dataset.t);if(s)s.scrollIntoView({behavior:"smooth"})}
  else if(m){var v=m.closest("main");v.classList.toggle("gmode",m.dataset.m=="grid");[].forEach.call(v.querySelectorAll(".tg button"),function(b){b.classList.toggle("on",b==m)});sizeHS(v.id);v.querySelector(".tg").scrollIntoView()}});
addEventListener("keydown",function(e){if(e.key=="Escape")closePanel()});
/* services page (edit this block, or let the CMS) */
$("svc").innerHTML='<div class="ic"></div><h1>SERVICES</h1><div class="sv2" id="sv2">'+CONTENT.svc.map(function(s,i){
 return'<div class="sp'+(i==0?' on':'')+'" tabindex="0"><div class="bgi" style="background:'+bg({img:s.img},i+1)+'"></div><div class="ov"></div><span class="no sm">'+pad(i+1)+'</span><div class="vt"><span>'+s.name+'</span></div><div class="in"><span class="no sm">'+pad(i+1)+'</span><h3>'+s.name+'</h3><p>'+s.desc+'</p><a class="btn sm" href="/#enquire" data-svc="'+i+'">'+s.price+' →</a></div></div>'}).join("")+'</div>'
 +'<div class="guide"><h2>'+esc(CONTENT.guide.heading)+'</h2><p>'+esc(CONTENT.guide.text)+'</p><a class="btn sm" id="gdl" href="/#enquire">DOWNLOAD</a></div>';
if(CONTENT.guideUrl){var gd=$("gdl");gd.href=CONTENT.guideUrl;gd.target="_blank";gd.setAttribute("download","")}
function tc(n){return String(n||"").toLowerCase().replace(/(^|[\s\/&-])([a-z])/g,function(m,a,b){return a+b.toUpperCase()})}
(function(){var sel=document.querySelector("#f select[name=service]");if(sel&&CONTENT.svc.length)sel.innerHTML='<option value="">Choose one</option>'+CONTENT.svc.map(function(x){return"<option>"+esc(tc(x.name))+"</option>"}).join("")+"<option>Something else</option>"})();
document.addEventListener("click",function(e){var a=e.target.closest("[data-svc]");if(!a)return;var x=CONTENT.svc[+a.getAttribute("data-svc")],sel=document.querySelector("#f select[name=service]");if(x&&sel)sel.value=tc(x.name)},true);
function spOn(p){[].forEach.call(document.querySelectorAll("#sv2 .sp"),function(x){x.classList.toggle("on",x==p)})}
[].forEach.call(document.querySelectorAll("#sv2 .sp"),function(p){p.addEventListener("pointerenter",function(e){if(e.pointerType=="mouse"&&innerWidth>800)spOn(p)});p.addEventListener("click",function(){spOn(p)});p.addEventListener("focus",function(){spOn(p)})});
/* contact page (edit this block, or let the CMS) */
var CC=CONTENT.contact,EM=CC.email;
function tileHTML(p,i,ar){var inner="";
 if(p.type=="video"&&p.src)inner='<video src="'+p.src+'" autoplay muted loop playsinline></video>';
 else if(p.type=="carousel")inner='<div class="car">'+p.src.map(function(s,k){return'<div style="background:'+bg({img:s},i+k+2)+'"></div>'}).join("")+'</div><div class="dots">'+p.src.map(function(s,k){return'<i'+(k==0?' class="on"':'')+'></i>'}).join("")+'</div>';
 else inner='<div style="position:absolute;inset:0;background:'+bg({img:p.src},i+9)+'"></div>';
 return'<div class="fr tile" style="aspect-ratio:'+ar+'"><div class="ph">'+inner+'</div><span class="tp sm">'+(p.type=="video"?"▶ VIDEO":p.type=="carousel"?"SWIPE →":"POST")+'</span>'+(p.href?'<a class="go" href="'+p.href+'" target="_blank" rel="noopener" aria-label="Open post">↗</a>':"")+'</div>'}
function soc(name,url,posts,ar){return'<section class="so"><header><h2>'+name+'</h2>'+(url?'<a class="sm" href="'+url+'" target="_blank" rel="noopener">VISIT PAGE ↗</a>':"")+'</header><div class="tl">'+posts.map(function(p,i){return tileHTML(p,i,ar)}).join("")+'</div></section>'}
$("ct").innerHTML='<div class="ic"></div><h1>CONTACT ME</h1><div class="ch"><p>Tell me a little about what you’re dreaming up and let’s start creating something beautiful together.</p><div class="em"><a class="big" id="eml" href="#">…</a><button class="sm" id="cpy" type="button">COPY</button></div><div class="lk sm"><a href="'+(CC.linkedin||"#")+'" target="_blank" rel="noopener">LINKEDIN ↗</a><a href="'+(CC.instagram||"#")+'" target="_blank" rel="noopener">INSTAGRAM ↗</a><a href="'+(CC.tiktok||"#")+'" target="_blank" rel="noopener">TIKTOK ↗</a></div><p style="margin:2.4rem 0 0" class="sm"><a href="/#enquire" style="color:var(--yel);border-bottom:1px solid var(--yel)">PREFER A FORM? SEND AN ENQUIRY</a></p></div>'
 +soc("Instagram",CC.instagram,CC.instagramPosts,"4/5")+soc("TikTok",CC.tiktok,CC.tiktokPosts,"9/16");
$("eml").textContent=EM;$("eml").href="mailto:"+EM;
$("cpy").addEventListener("click",function(){var b=this,ok=function(){b.textContent="COPIED";setTimeout(function(){b.textContent="COPY"},1600)};
 try{navigator.clipboard.writeText(EM).then(ok,fb)}catch(e){fb()}
 function fb(){var a=document.createElement("textarea");a.value=EM;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();ok()}});
[].forEach.call(document.querySelectorAll("#ct .car"),function(c){c.addEventListener("scroll",function(){var k=Math.round(c.scrollLeft/c.clientWidth);[].forEach.call(c.parentNode.querySelectorAll(".dots i"),function(d,j){d.classList.toggle("on",j==k)})},{passive:true})});
/* terms and conditions (edit this block, or let the CMS) */
function pic(src,alt){return'<img class="pic" src="'+String(src).replace(/"/g,"%22")+'" alt="'+esc(alt||"")+'" decoding="async">'}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
$("tc").innerHTML='<div class="ic"></div><h1>TERMS & CONDITIONS</h1><p class="tcl sm" style="color:var(--yel)">SELECT A SERVICE TO READ ITS TERMS</p><div class="tcw">'+CONTENT.terms.map(function(s,i){
 return'<details class="sv3"><summary><span class="sm" style="color:var(--yel)">'+pad(i+1)+'</span><h2>'+esc(s.name)+'</h2></summary><div class="tcb">'+s.sec.map(function(c){
  return'<details class="cl"><summary>'+esc(c.t)+'</summary><div>'+c.b.map(function(b){return b[0]=="h"?"<h4>"+esc(b[1])+"</h4>":b[0]=="u"?"<ul>"+b[1].map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+"</ul>":"<p>"+esc(b[1])+"</p>"}).join("")+'</div></details>'}).join("")+'</div></details>'}).join("")
 +'</div><p class="tcl sm" style="margin-top:3rem">QUESTIONS? <a href="/contact" style="color:var(--yel);border-bottom:1px solid var(--yel)">GET IN TOUCH</a></p>';
/* light cursor */
var L=$("light"),x=0,y=0,tx=0,ty=0;
addEventListener("pointermove",function(e){tx=e.clientX;ty=e.clientY});
(function f(){x+=(tx-x)*.18;y+=(ty-y)*.18;L.style.transform="translate("+x+"px,"+y+"px)";requestAnimationFrame(f)})();
document.addEventListener("pointerover",function(e){L.classList.toggle("big",!!e.target.closest("a,button"))});

/* open the page the URL points to */
show(location.pathname,location.hash);
}
})();
