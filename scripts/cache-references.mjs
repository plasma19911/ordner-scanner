import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('sharp');
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {referenceSearch,validImage,fetchReference} from '../src/reference-source.mjs';

// Public catalogue entries, never scanner photos. Extend these queries to grow the Pages collection.
let names={
 en:['Heracross','Ivysaur',"Erika's Bulbasaur",'Muk','Flareon','Entei'],
 de:['Skaraborn','Bisaknosp','Erikas Bisasam','Sleimok','Flamara','Entei'],
 ja:['Heracross','Ivysaur',"Erika's Bulbasaur",'Muk','Flareon','Entei']
};
const extra=process.argv.slice(2);
if(extra.length){
 names={};
 for(const arg of extra){const at=arg.indexOf(':');const lang=arg.slice(0,at),query=arg.slice(at+1);
  if(!['de','en','ja'].includes(lang) || !query || query.length>60)throw new Error('Expected language:name');
  (names[lang] ||= []).push(query);
 }
}
const existing=await readFile('reference-cache.json','utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {cards:[]};throw e;});
const cards=[...existing.cards];
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
  const prior=existing.cards.find(c=>c.image===url && c.cachedImage);
  if(prior){const info=await stat(prior.cachedImage).catch(()=>null);if(info){totalBytes+=info.size;cached.set(url,prior.cachedImage);continue;}}
  const r=await fetchReference(safe.href);
  if(!r.ok || !/^image\//.test(r.headers.get('content-type') || ''))throw new Error('Image unavailable');
  const original=Buffer.from(await r.arrayBuffer());
  if(original.length>4000000)throw new Error('Reference image too large');
  const data=await sharp(original).resize({height:800,withoutEnlargement:true}).webp({quality:82}).toBuffer();
  totalBytes+=data.length;if(totalBytes>64000000)throw new Error('Reference collection exceeded 64 MB');
  const ext='webp';
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
