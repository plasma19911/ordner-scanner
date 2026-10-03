/* Public catalogue references only. This module never uploads a photo. */
(function(root){
 const cache=new Map();
 const validImage=s=>{try{const u=new URL(s);return u.origin==='https://assets.tcgdex.net'&&!u.pathname.includes('/tcgp/')&&!u.search;}catch{return false;}};
 async function candidates(englishName,fetcher=fetch){
  const requested=String(englishName||'').trim();if(!requested||requested.length>120)return [];
  const name=root.NameIndex?.speciesOf(requested)||requested;
  if(!cache.has(name))cache.set(name,(async()=>{
   const r=await fetcher('https://api.tcgdex.net/v2/en/cards?name=like:'+encodeURIComponent(name),{signal:AbortSignal.timeout(15000)});
   if(!r.ok)throw Error('Artwork-Katalog nicht erreichbar');const rows=await r.json();
   if(!Array.isArray(rows)||rows.length>1000)throw Error('Zu viele Treffer – englischen Namen präzisieren');
   const wanted=name.toLowerCase(),base=root.NameIndex?.speciesOf(name);
   return rows.filter(c=>validImage(c.image)&&c.name&&(base?root.NameIndex.speciesOf(c.name)===base:c.name.toLowerCase()===wanted)).map(c=>({
    id:c.id,name:c.name,lang:'en',localId:c.localId,setId:c.id.slice(0,c.id.lastIndexOf('-')),image:c.image+'/high.webp',source:'artwork:'+c.id,artworkOnly:true
   }));
  })().catch(e=>{cache.delete(name);throw e;}));return cache.get(name);
 }
 async function search(photo,englishName,loadImage,cv){
  const list=await candidates(englishName);if(!list.length)return {list:[],total:0,compared:0};
  if(!cv?.ORB||!root.CardMatcher?.rankArtwork)throw Error('Bildvergleich nicht verfügbar');
  const ranked=await root.CardMatcher.rankArtwork(photo,list,loadImage,cv);
  return {list:ranked.list.filter(c=>c.match&&c.match.inliers>=18&&c.match.artworkInliers>=12&&c.match.score>=18&&c.match.ratio>=.45&&c.match.coverage>=.035).slice(0,8),total:list.length,compared:ranked.compared};
 }
 root.ArtworkSearch={candidates,search,validImage};
})(globalThis);
