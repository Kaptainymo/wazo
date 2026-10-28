/* Input tools shared by the site and the app: speak instead of typing, and drop in a picture with text.
   WZInput.attach({ wrap, textarea, lang:()=>"he", onImage(dataURL,name), onText?() , msg(text) }) -> { clearImage() }
   - the mic uses the browser's own speech recognition (hidden when the browser has none)
   - an image (drag and drop, paste, or the picture button) is shrunk in the browser and handed to onImage */
(function(){
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const LOCALE={he:"he-IL",en:"en-US",es:"es-ES",fr:"fr-FR"};
const T={
 he:{mic:"דברו במקום להקליד",micStop:"עצרו את ההקלטה",img:"הוסיפו תמונה עם טקסט",tipImg:"לחצו ובחרו תמונה שיש בה כתב, כמו פתק או צילום מסך. נקרא אותה בשבילכם.",tipMic:"לחצו ודברו בקול רגיל. נכתוב את זה בשבילכם.",nomic:"לא מצאנו מיקרופון במכשיר.",listening:"מקשיבים… דברו בקול רגיל.",denied:"לא קיבלנו הרשאה למיקרופון. אפשר להפעיל אותה בהגדרות הדפדפן.",none:"לא שמענו כלום. נסו שוב.",unsupported:"הדפדפן הזה לא תומך בהקלדה בקול.",drop:"שחררו כאן תמונה עם טקסט",bad:"אפשר רק תמונות (JPG, PNG, WebP).",remove:"הסירו את התמונה",big:"התמונה גדולה מדי. נסו תמונה קטנה יותר.",reading:"קוראים את התמונה…",fail:"לא הצלחנו לקרוא את התמונה כרגע. אפשר להקליד במקום.",empty:"לא מצאנו בתמונה טקסט או רעיון. נסו תמונה אחרת.",limit:"שלחתם הרבה תמונות היום. נסו שוב מחר.",attached:"התמונה תיקרא כשתמשיכו."},
 en:{mic:"Speak instead of typing",micStop:"Stop recording",img:"Add a picture with text",tipImg:"Tap and choose a picture with writing on it, like a note or a screenshot. We'll read it for you.",tipMic:"Tap and speak normally. We'll type it for you.",nomic:"We couldn't find a microphone on this device.",listening:"Listening… speak normally.",denied:"We didn't get microphone permission. You can allow it in the browser settings.",none:"We didn't hear anything. Try again.",unsupported:"This browser doesn't support speaking instead of typing.",drop:"Drop a picture with text here",bad:"Pictures only (JPG, PNG, WebP).",remove:"Remove the picture",big:"That picture is too big. Try a smaller one.",reading:"Reading the picture…",fail:"We couldn't read the picture right now. You can type instead.",empty:"We found no text or idea in the picture. Try another one.",limit:"You sent a lot of pictures today. Try again tomorrow.",attached:"The picture will be read when you continue."},
 es:{mic:"Habla en vez de escribir",micStop:"Detener la grabación",img:"Añadir una imagen con texto",tipImg:"Pulsa y elige una imagen con texto, como una nota o una captura. Nosotros la leemos por ti.",tipMic:"Pulsa y habla con normalidad. Lo escribimos por ti.",nomic:"No encontramos un micrófono en este dispositivo.",listening:"Escuchando… habla con normalidad.",denied:"No recibimos permiso para el micrófono. Puedes activarlo en los ajustes del navegador.",none:"No oímos nada. Inténtalo de nuevo.",unsupported:"Este navegador no permite hablar en vez de escribir.",drop:"Suelta aquí una imagen con texto",bad:"Solo imágenes (JPG, PNG, WebP).",remove:"Quitar la imagen",big:"La imagen es demasiado grande. Prueba con una más pequeña.",reading:"Leyendo la imagen…",fail:"No pudimos leer la imagen ahora. Puedes escribir.",empty:"No encontramos texto ni idea en la imagen. Prueba con otra.",limit:"Enviaste muchas imágenes hoy. Inténtalo mañana.",attached:"La imagen se leerá cuando continúes."},
 fr:{mic:"Parlez au lieu d'écrire",micStop:"Arrêter l'enregistrement",img:"Ajouter une image avec du texte",tipImg:"Appuyez et choisissez une image avec du texte, comme une note ou une capture d'écran. Nous la lisons pour vous.",tipMic:"Appuyez et parlez normalement. Nous l'écrivons pour vous.",nomic:"Nous n'avons trouvé aucun micro sur cet appareil.",listening:"J'écoute… parlez normalement.",denied:"Nous n'avons pas reçu l'autorisation du micro. Vous pouvez l'activer dans les réglages du navigateur.",none:"Nous n'avons rien entendu. Réessayez.",unsupported:"Ce navigateur ne permet pas de parler au lieu d'écrire.",drop:"Déposez ici une image avec du texte",bad:"Images seulement (JPG, PNG, WebP).",remove:"Retirer l'image",big:"L'image est trop grande. Essayez-en une plus petite.",reading:"Lecture de l'image…",fail:"Nous n'avons pas pu lire l'image pour le moment. Vous pouvez écrire.",empty:"Aucun texte ni idée trouvés dans l'image. Essayez-en une autre.",limit:"Vous avez envoyé beaucoup d'images aujourd'hui. Réessayez demain.",attached:"L'image sera lue quand vous continuerez."}
};
const ICON={
 mic:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
 img:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/></svg>'
};
const OK=/^image\/(jpeg|png|webp)$/;

function shrink(file,max=1600){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file), im=new Image();
    im.onload=()=>{ const k=Math.min(1,max/Math.max(im.width,im.height)), w=Math.max(1,Math.round(im.width*k)), h=Math.max(1,Math.round(im.height*k)); const c=document.createElement("canvas"); c.width=w; c.height=h; const x=c.getContext("2d"); x.fillStyle="#fff"; x.fillRect(0,0,w,h); x.drawImage(im,0,0,w,h); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg",.82)); };
    im.onerror=()=>{ URL.revokeObjectURL(url); rej(new Error("decode")); };
    im.src=url;
  });
}

function attach(o){
  const L=()=>T[o.lang()]||T.en, ta=o.textarea, wrap=o.wrap, say=o.msg||(()=>{});
  const tools=document.createElement("div"); tools.className="itools";
  const mk=(cls,icon)=>{ const b=document.createElement("button"); b.type="button"; b.className="itool "+cls; b.innerHTML=icon; return b; };
  const micB=mk("mic",ICON.mic), imgB=mk("img",ICON.img);
  const file=document.createElement("input"); file.type="file"; file.accept="image/jpeg,image/png,image/webp"; file.hidden=true; file.setAttribute("aria-hidden","true");
  /* one tooltip for every button: it says what to do, and stays inside the screen */
  let tipEl=document.getElementById("wz-tip");
  if (!tipEl){
    const st=document.createElement("style");
    st.textContent="#wz-tip{position:fixed;left:0;top:0;z-index:1000;width:max-content;max-width:min(260px,calc(100vw - 16px));padding:10px 14px;border-radius:12px;background:#141414;color:#fff;border:1px solid rgba(255,255,255,.35);font-size:14px;line-height:1.45;font-weight:500;letter-spacing:0;text-align:start;pointer-events:none;opacity:0;transition:opacity .15s}#wz-tip.on{opacity:1}@media (prefers-reduced-motion:reduce){#wz-tip{transition:none}}";
    document.head.appendChild(st);
    tipEl=document.createElement("div"); tipEl.id="wz-tip"; tipEl.setAttribute("aria-hidden","true"); document.body.appendChild(tipEl);
  }
  const hideTip=()=>tipEl.classList.remove("on");
  const showTip=(btn,text)=>{
    tipEl.textContent=text; tipEl.classList.add("on");
    const r=btn.getBoundingClientRect(), w=tipEl.offsetWidth, h=tipEl.offsetHeight;
    const x=Math.min(Math.max(r.left+r.width/2-w/2,8),innerWidth-w-8), y=r.top-h-10>=8?r.top-h-10:r.bottom+10;
    tipEl.style.transform="translate("+Math.round(x)+"px,"+Math.round(y)+"px)";
  };
  const tipFor=(btn,get)=>{
    btn.addEventListener("mouseenter",()=>showTip(btn,get()));
    btn.addEventListener("focus",()=>{ if(btn.matches(":focus-visible")) showTip(btn,get()); });
    ["mouseleave","blur","pointerdown","click"].forEach(n=>btn.addEventListener(n,hideTip));
    btn.addEventListener("keydown",e=>{ if(e.key==="Escape") hideTip(); });
  };
  const desc=(btn,key)=>{ const d=document.createElement("span"); d.id="wz-d-"+key+"-"+Math.random().toString(36).slice(2,7); d.hidden=true; btn.after(d); btn.setAttribute("aria-describedby",d.id); return d; };
  const label=()=>{ micB.setAttribute("aria-label",rec?L().micStop:L().mic); imgB.setAttribute("aria-label",L().img); micD.textContent=L().tipMic; imgD.textContent=L().tipImg; };
  if (SR) tools.appendChild(micB);
  if (!o.noImage){ tools.appendChild(imgB); tools.appendChild(file); }
  wrap.appendChild(tools);
  const micD=desc(micB,"mic"), imgD=desc(imgB,"img");
  tipFor(micB,()=>L().tipMic); tipFor(imgB,()=>L().tipImg);

  /* ---- speech ---- */
  let rec=null, base="";
  function stop(){ try{ rec&&rec.stop(); }catch(e){} }
  micB.addEventListener("click",()=>{
    if (rec){ stop(); return; }
    rec=new SR(); rec.lang=LOCALE[o.lang()]||"en-US"; rec.interimResults=true; rec.continuous=true;
    base=ta.value.trim(); let heard=false, failed=false;
    rec.onstart=()=>{ micB.setAttribute("aria-pressed","true"); micB.classList.add("on"); label(); say(L().listening); };
    rec.onresult=e=>{ heard=true; let txt=""; for(let i=0;i<e.results.length;i++) txt+=e.results[i][0].transcript; ta.value=(base?base+" ":"")+txt.trim(); ta.dispatchEvent(new Event("input",{bubbles:true})); };
    rec.onerror=e=>{ if(e.error==="aborted") return; failed=true; say(e.error==="not-allowed"||e.error==="service-not-allowed"?L().denied:e.error==="audio-capture"?L().nomic:e.error==="no-speech"?L().none:L().unsupported); };
    rec.onend=()=>{ micB.setAttribute("aria-pressed","false"); micB.classList.remove("on"); rec=null; label(); if(heard) say(""); else if(!failed) say(L().none); };
    try{ rec.start(); }catch(e){ rec=null; say(L().unsupported); }
  });

  /* ---- image ---- */
  async function take(f){
    if (!f) return;
    if (!OK.test(f.type)) { say(L().bad); return; }
    if (f.size>25*1024*1024) { say(L().big); return; }
    try{ const data=await shrink(f); say(""); o.onImage(data,f.name||"image"); }catch(e){ say(L().bad); }
  }
  if (!o.noImage){
  imgB.addEventListener("click",()=>file.click());
  file.addEventListener("change",()=>{ take(file.files[0]); file.value=""; });
  const zone=o.dropZone||wrap;
  let depth=0;
  const isFiles=e=>e.dataTransfer&&[...(e.dataTransfer.types||[])].includes("Files");
  zone.addEventListener("dragenter",e=>{ if(!isFiles(e)) return; e.preventDefault(); depth++; zone.classList.add("dropping"); say(L().drop); });
  zone.addEventListener("dragover",e=>{ if(!isFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect="copy"; });
  zone.addEventListener("dragleave",()=>{ depth=Math.max(0,depth-1); if(!depth){ zone.classList.remove("dropping"); say(""); } });
  zone.addEventListener("drop",e=>{ if(!isFiles(e)) return; e.preventDefault(); depth=0; zone.classList.remove("dropping"); say(""); take(e.dataTransfer.files[0]); });
  ta.addEventListener("paste",e=>{ const it=[...(e.clipboardData?.items||[])].find(i=>i.kind==="file"&&OK.test(i.type)); if(it){ e.preventDefault(); take(it.getAsFile()); } });
  }
  label();
  return { relabel:label, stop };
}
/* Quick topics: round buttons that add or remove a word in the field.
   WZInput.chips({ textarea, words:()=>["kids","cooking"] }) -> { el, rebuild() }  (the caller puts el where it belongs) */
function chips(o){
  if (!document.getElementById("wz-chips-css")){
    const st=document.createElement("style"); st.id="wz-chips-css";
    st.textContent=".wz-chips[hidden]{display:none}.wz-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}.wz-chip{all:unset;box-sizing:border-box;min-height:44px;padding:0 18px;display:inline-flex;align-items:center;border:1.5px solid #0A0A0A;border-radius:999px;font-size:16px;font-weight:500;color:#0A0A0A;cursor:pointer;transition:background-color .15s,color .15s}.wz-chip[aria-pressed=true]{background:#0A0A0A;color:#fff}.wz-chip:focus-visible{outline:3px solid #0A0A0A;outline-offset:2px}@media (hover:hover){.wz-chip:hover{background:rgba(10,10,10,.08)}.wz-chip[aria-pressed=true]:hover{background:#333}}@media (prefers-reduced-motion:reduce){.wz-chip{transition:none}}";
    document.head.appendChild(st);
  }
  const ta=o.textarea, el=document.createElement("div"); el.className="wz-chips"; el.setAttribute("role","group");
  const parts=()=>ta.value.split(/[,،]/).map(s=>s.trim()).filter(Boolean);
  const same=(a,b)=>a.toLowerCase()===b.toLowerCase();
  function sync(){ const p=parts(); el.querySelectorAll(".wz-chip").forEach(b=>b.setAttribute("aria-pressed",p.some(s=>same(s,b.textContent)))); }
  function rebuild(){
    el.textContent="";
    o.words().forEach(w=>{
      const b=document.createElement("button"); b.type="button"; b.className="wz-chip"; b.textContent=w; b.setAttribute("aria-pressed","false");
      b.addEventListener("click",()=>{ const p=parts(), i=p.findIndex(s=>same(s,w)); if(i>=0) p.splice(i,1); else p.push(w); ta.value=p.join(", "); ta.dispatchEvent(new Event("input",{bubbles:true})); });
      el.appendChild(b);
    });
    sync();
  }
  ta.addEventListener("input",sync);
  rebuild();
  return { el, rebuild };
}
window.WZInput={attach,chips,t:l=>T[l]||T.en};
})();
