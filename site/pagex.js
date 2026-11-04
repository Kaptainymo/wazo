// Close returns to the page the visitor came from; opened directly, the link goes to Wazo.
document.querySelector(".pg-x")?.addEventListener("click",e=>{
  try{ if (history.length>1 && document.referrer && new URL(document.referrer).origin===location.origin){ e.preventDefault(); history.back(); } }catch(_){}
});
