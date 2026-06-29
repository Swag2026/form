/* SWAG order form — offline service worker */
const CACHE='swag-order-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;                 // POST (sheet sync) ko cache na karo
  e.respondWith(
    caches.open(CACHE).then(cache=>
      cache.match(req).then(hit=>{
        const net=fetch(req).then(res=>{
          try{ if(res && res.status===200) cache.put(req,res.clone()); }catch(_){}
          return res;
        }).catch(()=>hit);
        return hit || net;                        // online: fresh, offline: cached
      })
    )
  );
});
