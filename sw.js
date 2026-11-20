const V="aq-v4",CORE=["/","/manifest.webmanifest","/icon-192.png","/icon-512.png","/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||r.headers.has("range"))return;
  if(u.pathname.startsWith("/_vercel/"))return;
  if(/everyayah\.com|hisnmuslim\.com/.test(u.hostname))return;
  if(r.mode==="navigate"){
    /* network first: always get the newest app when online, fall back to the saved copy when offline or very slow */
    e.respondWith((async()=>{const c=await caches.open(V),hit=await c.match("/");
      const net=fetch("/",{cache:"no-cache"}).then(res=>{if(res&&res.ok)c.put("/",res.clone());return res}).catch(()=>null);
      if(!hit){const res=await net;return res||new Response("Offline",{status:503,headers:{"Content-Type":"text/plain"}})}
      e.waitUntil(net);
      const res=await Promise.race([net,new Promise(ok=>setTimeout(()=>ok(null),3500))]);
      return res||hit})());
    return}
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;return res||new Response("Offline",{status:503,headers:{"Content-Type":"text/plain"}});
  }));
});
