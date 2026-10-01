import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {referenceSearch,validImage} from '../src/reference-source.mjs';

// Public catalogue entries, never scanner photos. Extend these queries to grow the Pages collection.
const names={
 en:['Heracross','Ivysaur',"Erika's Bulbasaur",'Muk','Flareon','Entei'],
 de:['Skaraborn','Bisaknosp','Erikas Bisasam','Sleimok','Flamara','Entei'],
 ja:['Heracross','Ivysaur',"Erika's Bulbasaur",'Muk','Flareon','Entei']
};
const cards=[];
for(const [lang,queries] of Object.entries(names)){
 for(const name of queries){
  const found=await referenceSearch(lang,name);
  console.log(lang,name,found.length);
  cards.push(...found);
 }
}
const unique=[...new Map(cards.map(c=>[c.lang+'|'+c.source,c])).values()];
if(unique.length<50) throw new Error('Too few reference records; refusing an empty Pages collection');
await mkdir('reference-images',{recursive:true});
const images=[...new Set(unique.map(c=>c.image))],cached=new Map();
let next=0,totalBytes=0,failures=0;
const task=async()=>{while(next<images.length){
 const url=images[next++],safe=validImage(url);if(!safe)throw new Error('Invalid reference image');
 try{
  const r=await fetch(safe.href,{signal:AbortSignal.timeout(15000),redirect:'error'});
  if(!r.ok || !/^image\//.test(r.headers.get('content-type') || ''))throw new Error('Image unavailable');
  const data=Buffer.from(await r.arrayBuffer());
  if(data.length>2000000)throw new Error('Reference image too large');
  totalBytes+=data.length;if(totalBytes>64000000)throw new Error('Reference collection exceeded 64 MB');
  const ext=safe.pathname.match(/\.(png|jpe?g|webp)$/i)[1].toLowerCase();
  const path='reference-images/'+createHash('sha256').update(url).digest('hex').slice(0,24)+'.'+ext;
  await writeFile(path,data);cached.set(url,path);
 }catch(e){
  if(totalBytes>64000000)throw e;
  failures++;console.warn('Reference not cached:',safe.pathname,String(e.message));
 }
}};
await Promise.all(Array.from({length:4},task));
const result=unique.map(c=>({...c,cachedImage:cached.get(c.image) || ''}));
for(const slug of ['adv5-9','L2-9','B03-7','B05-7']){
 if(!result.some(c=>c.lang==='ja' && c.slug===slug && c.cachedImage))throw new Error('Required reference missing: '+slug);
}
await writeFile('reference-cache.json',JSON.stringify({version:1,generatedAt:new Date().toISOString(),cards:result},null,2)+'\n');
console.log(JSON.stringify({cards:result.length,images:cached.size,bytes:totalBytes,failedImages:failures}));
