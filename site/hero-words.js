/* Hero background: rows of the words that matter (money, time, demand, learning...) drift sideways behind the form.
   When someone types an idea it joins one of the rows and the rest slow down and fade.
   WZWords.init({ layer, input, lang }) ; WZWords.setLang(lang) ; the layer is decorative (aria-hidden). */
(function(){
const WORDS={
 he:["כסף","זמן","ביקוש","עבודה משותפת","לקוחות","יחד","יצירה אישית","השבוע","לחדד","להתחיל","תוכנית","למידה","שימושי","אנושי"],
 en:["Money","Time","Demand","Working together","Customers","Together","Personal creation","This week","Refine","Start","A plan","Learning","Useful","Human"],
 es:["Dinero","Tiempo","Demanda","Trabajo en equipo","Clientes","Juntos","Creación personal","Esta semana","Afinar","Empezar","Un plan","Aprendizaje","Útil","Humano"],
 fr:["Argent","Temps","Demande","Travail d'équipe","Clients","Ensemble","Création personnelle","Cette semaine","Affiner","Commencer","Un plan","Apprentissage","Utile","Humain"]
};
const ROWS=4, SECS=[170,140,190,155];     /* seconds for one full pass: slow on purpose */
const mobile=matchMedia("(max-width:960px)"), calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let layer=null,input=null,lang="he",rows=[],mine="",timer=0;
const mineRow=()=>mobile.matches?1:2;

function seq(r){
  const list=WORDS[lang]||WORDS.en, out=[];
  list.forEach((_,i)=>{ out.push(`<span class="w">${esc(list[(i+r*3)%list.length])}</span>`);
    if(mine&&r===mineRow()&&(i===0||i===Math.floor(list.length/2))) out.push(`<span class="w mine" dir="auto">${esc(mine)}</span>`); });
  return out.join("");
}
function fill(r){ const s=seq(r); rows[r].track.innerHTML=`<div class="w-seq">${s}</div><div class="w-seq" aria-hidden="true">${s}</div>`; }
function play(r,at){
  const row=rows[r]; if(row.anim){ row.anim.cancel(); row.anim=null; }
  if(calm) return;
  row.anim=row.track.animate([{transform:"translateX(0)"},{transform:"translateX(-50%)"}],{duration:SECS[r]*1000,iterations:Infinity,direction:r%2?"reverse":"normal",easing:"linear"});
  if(at!=null) row.anim.currentTime=at;
  row.anim.playbackRate=mine?.35:1;
}
function build(){
  if(!layer) return; layer.innerHTML=""; rows=[];
  for(let r=0;r<ROWS;r++){ const el=document.createElement("div"); el.className="w-row"; const track=document.createElement("div"); track.className="w-track"; el.appendChild(track); layer.appendChild(el); rows.push({el,track,anim:null}); fill(r); play(r,(r*37e3)%(SECS[r]*1000)); }
  mark();
}
function mark(){ layer.classList.toggle("has-idea",!!mine); rows.forEach((x,r)=>x.el.classList.toggle("has-mine",!!mine&&r===mineRow())); }
function onInput(){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    const t=(input.value||"").trim().split("\n")[0].slice(0,48); if(t===mine) return; mine=t;
    const r=mineRow(), at=rows[r]&&rows[r].anim?rows[r].anim.currentTime:null;
    fill(r); play(r,at); rows.forEach(x=>{ if(x.anim) x.anim.updatePlaybackRate(mine?.35:1); }); mark();
  },350);
}
function init(o){
  layer=o.layer; input=o.input; lang=o.lang||lang;
  build(); input.addEventListener("input",onInput); mobile.addEventListener("change",build);
}
function setLang(l){ lang=WORDS[l]?l:"en"; if(layer){ const t=mine; build(); mine=t; } }
window.WZWords={init,setLang};
})();
