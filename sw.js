const V="aq-v3",CORE=["/","/manifest.webmanifest","/icon-192.png","/icon-512.png","/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||r.headers.has("range"))return;
  if(u.pathname.startsWith("/_vercel/"))return;
  if(/everyayah\.com|hisnmuslim\.com/.test(u.hostname))return;
  const nav=r.mode==="navigate",key=nav?"/":r;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(nav?"/":r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(key,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;return res||new Response("Offline",{status:503,headers:{"Content-Type":"text/plain"}});
  }));
});
