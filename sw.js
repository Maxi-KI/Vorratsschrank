// Netz zuerst (immer aktuelle Version), bei schlechtem Empfang nach 3 s aus dem Cache.
const CACHE='vorrat-cache';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])));});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  const net=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;});
  const fallback=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||net);
  e.respondWith(Promise.race([net,new Promise((_,rej)=>setTimeout(rej,3000))]).catch(fallback));
});
