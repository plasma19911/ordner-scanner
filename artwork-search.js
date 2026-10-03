/* Account-free catalogues only. Photos never leave this browser. */
(function(root){
 const cache=new Map();
 const validImage=s=>{try{const u=new URL(s);return u.origin==='https://assets.tcgdex.net'&&!u.pathname.includes('/tcgp/')&&!u.search;}catch{return false;}};
 let supplement;
 async function freeReferences(fetcher){
  if(!supplement)supplement=fetcher('free-artwork-features.json').then(r=>{if(!r.ok)throw Error('Lokale Referenzen fehlen');return r.json();}).then(d=>d.cards||[]).catch(e=>{supplement=null;throw e;});
  return supplement;
 }
 async function candidates(englishName,fetcher=fetch){
  const requested=String(englishName||'').trim();if(requested.length>120)return [];if(!requested)return freeReferences(fetcher);
  const name=root.NameIndex?.speciesOf(requested)||requested;
  if(cache.has(name))return cache.get(name);
  const work=(async()=>{
   const queries=[['en',name]];
   for(const [api,alias] of [['de','de'],['ja','ja'],['zh-cn','zh'],['zh-tw','zh']]){
    for(const local of (root.NameIndex?.namesFor(name,alias)||[]).slice(0,2))queries.push([api,local]);
   }
   const results=await Promise.allSettled(queries.map(async([lang,query])=>{
    const r=await fetcher('https://api.tcgdex.net/v2/'+lang+'/cards?name=like:'+encodeURIComponent(query),{signal:AbortSignal.timeout(15000)});
    if(!r.ok)throw Error('Artwork-Katalog nicht erreichbar');const rows=await r.json();
    if(!Array.isArray(rows)||rows.length>1000)throw Error('Zu viele Treffer – Namen präzisieren');
    const base=root.NameIndex?.speciesOf(name),alias=lang.startsWith('zh')?'zh':lang;
    return rows.filter(c=>{
     if(!validImage(c.image)||!c.name)return false;
     const en=lang==='en'?c.name:root.NameIndex?.lookup(c.name,alias);
     return (base&&en&&root.NameIndex.speciesOf(en)===base)||c.name.toLowerCase()===query.toLowerCase();
    }).map(c=>({id:lang+':'+c.id,name:root.NameIndex?.lookup(c.name,alias)||c.name,lang,localId:c.localId,setId:c.id.slice(0,c.id.lastIndexOf('-')),image:c.image+'/high.webp',source:'tcgdex:'+lang+':'+c.id,artworkOnly:true}));
   }).concat([freeReferences(fetcher).then(rows=>rows.filter(c=>c.name===name||root.NameIndex?.speciesOf(c.name)===name))]));
   const list=results.flatMap(r=>r.status==='fulfilled'?r.value:[]),seen=new Set();
   const unique=list.filter(c=>!seen.has(c.image)&&seen.add(c.image));
   // Failed providers remain retryable; do not cache an incomplete catalogue.
   if(results.some(r=>r.status==='rejected')){cache.delete(name);if(!unique.length)throw Error('Referenzquellen momentan nicht erreichbar. Bitte erneut versuchen.');}
   return unique;
  })();cache.set(name,work);try{return await work;}catch(e){cache.delete(name);throw e;}
 }
 async function search(photo,englishName,loadImage,cv){
  const list=await candidates(englishName);if(!list.length)return {list:[],total:0,compared:0};
  if(!cv?.ORB||!root.CardMatcher?.rankArtwork)throw Error('Bildvergleich nicht verfügbar');
  const ranked=await root.CardMatcher.rankArtwork(photo,list,loadImage,cv);
  return {list:ranked.list.filter(c=>c.match&&c.match.inliers>=18&&c.match.artworkInliers>=12&&c.match.score>=18&&c.match.ratio>=.45&&c.match.coverage>=.035).slice(0,8),total:list.length,compared:ranked.compared};
 }
 root.ArtworkSearch={candidates,search,validImage};
})(globalThis);
