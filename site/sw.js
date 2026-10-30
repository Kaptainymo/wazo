/* Wazo: no caching. This worker only exists so browsers treat the site as installable; every request goes straight to the network. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",()=>{});
