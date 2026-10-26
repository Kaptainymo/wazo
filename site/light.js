/* "Draw light": the pointer leaves glowing trails on the hero, like a long exposure. Desktop only, Canvas 2D, no dependencies.
   WZLight.start(canvas, { ground:[r,g,b], active:()=>bool }) -> { dispose() } */
(function(){
const MAX_PARTICLES=2600, FADE=0.14;
const rnd=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function start(canvas,opts){
  const ctx=canvas.getContext("2d",{alpha:false});
  if(!ctx) return {dispose(){}};
  const G=opts.ground||[8,8,8], ground=`rgb(${G[0]},${G[1]},${G[2]})`, fade=`rgba(${G[0]},${G[1]},${G[2]},${FADE})`;
  const isActive=opts.active||(()=>true);
  const hero=canvas.parentElement;
  let w=0,h=0,dpr=1,raf=0,last=performance.now(),t=0,idle=true,pressed=false,prev=null,disposed=false;
  const parts=[];

  /* the palette: coral with a touch of amber. The base hue sways slowly, and fast strokes drift towards amber */
  const hueBase=()=>8+4*Math.sin(t*0.00035);   /* soft coral only: a narrow band around Wazo's coral */

  function resize(){
    const r=canvas.getBoundingClientRect(); dpr=Math.min(window.devicePixelRatio||1,2);
    w=Math.max(1,Math.round(r.width)); h=Math.max(1,Math.round(r.height));
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.globalCompositeOperation="source-over"; ctx.fillStyle=ground; ctx.fillRect(0,0,w,h);
  }
  const ro=new ResizeObserver(resize); ro.observe(canvas); resize();

  function emit(x0,y0,x1,y1,speed,boost){
    const dx=x1-x0, dy=y1-y0, dist=Math.hypot(dx,dy); if(dist<0.5) return;
    const steps=Math.min(48,Math.max(1,Math.ceil(dist/2.4)));
    for(let i=0;i<steps && parts.length<MAX_PARTICLES;i++){
      const k=(i+1)/steps, s=clamp(speed/18,0,1);
      parts.push({
        x:x0+dx*k+rnd(-.8,.8), y:y0+dy*k+rnd(-.8,.8),
        vx:rnd(-.35,.35)*(.4+s), vy:rnd(-.35,.35)*(.4+s),
        life:1, decay:rnd(.006,.014)*(1.1-.4*s),
        size:rnd(.9,1.8)+s*rnd(.8,1.8)*boost,
        hue:hueBase()+rnd(-5,5),
        bright:(.4+s*.25)*boost
      });
    }
  }

  function drawParticle(p){
    const a=p.life*p.bright, r=p.size*p.life+.4, halo=r*3.6;
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,halo);
    g.addColorStop(0,`hsla(${p.hue},70%,68%,${(a*.13).toFixed(3)})`);
    g.addColorStop(1,`hsla(${p.hue},70%,60%,0)`);
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,halo,0,6.2832); ctx.fill();
    ctx.fillStyle=`hsla(${p.hue},72%,72%,${(a*.30).toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x,p.y,r*.55,0,6.2832); ctx.fill();
  }

  /* the idle comet: follows a Lissajous path around the centre until someone moves the pointer over the hero */
  let cprev=null;
  function comet(){
    const nx=w/2+Math.sin(t*0.00085)*w*.26, ny=h/2+Math.sin(t*0.0013+1.2)*h*.22;
    if(cprev) emit(cprev[0],cprev[1],nx,ny,9,.9); cprev=[nx,ny];
  }

  function frame(now){
    raf=0; if(disposed) return;
    const dt=clamp((now-last)/16.667,0,3); last=now; t=now;
    if(!isActive() || document.hidden){ raf=requestAnimationFrame(frame); return; }
    ctx.globalCompositeOperation="source-over"; ctx.fillStyle=fade; ctx.fillRect(0,0,w,h);
    if(idle && !prefersCalm) comet();
    ctx.globalCompositeOperation="lighter";
    const damp=Math.pow(.94,dt);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i]; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=damp; p.vy=p.vy*damp+.006*dt; p.life-=p.decay*dt;
      if(p.life<=0){ parts[i]=parts[parts.length-1]; parts.pop(); continue; }
      drawParticle(p);
    }
    raf=requestAnimationFrame(frame);
  }
  const prefersCalm=matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the canvas sits behind the content, so the pointer is read from the window and mapped onto the hero */
  const inHero=e=>{ const r=hero.getBoundingClientRect(); return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; };
  function onMove(e){
    if(!isActive()){ prev=null; return; }
    if(!inHero(e)){ prev=null; return; }
    const r=canvas.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
    idle=false;
    if(prev){
      const d=Math.hypot(x-prev[0],y-prev[1]);
      if(pressed) emit(prev[0],prev[1],x,y,Math.min(d,40),1.25);
      else emit(prev[0],prev[1],x,y,Math.min(d*.5,24),.8);   /* hovering leaves a fainter trail */
    }
    prev=[x,y];
  }
  const interactive=el=>!!(el&&el.closest&&el.closest("a,button,input,textarea,select,label,[role=tab]"));
  function onDown(e){ if(e.button===0&&inHero(e)&&!interactive(e.target)){ pressed=true; idle=false; } }
  const onUp=()=>{ pressed=false; };
  const onLeave=()=>{ prev=null; pressed=false; };
  window.addEventListener("pointermove",onMove,{passive:true});
  window.addEventListener("pointerdown",onDown,{passive:true});
  window.addEventListener("pointerup",onUp,{passive:true});
  window.addEventListener("blur",onLeave);
  document.documentElement.addEventListener("pointerleave",onLeave);
  raf=requestAnimationFrame(frame);

  return { dispose(){
    disposed=true; if(raf) cancelAnimationFrame(raf); ro.disconnect();
    window.removeEventListener("pointermove",onMove); window.removeEventListener("pointerdown",onDown); window.removeEventListener("pointerup",onUp); window.removeEventListener("blur",onLeave);
    document.documentElement.removeEventListener("pointerleave",onLeave); parts.length=0;
  } };
}
window.WZLight={start};
})();
