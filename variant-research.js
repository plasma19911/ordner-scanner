/* Public catalogue metadata only; a shared artwork scan is not a foil photograph. */
(function(root){
 'use strict';
 const states=new WeakMap(),cache=new Map();
 let active=0;const queue=[];
 async function limited(work){if(active>=4)await new Promise(resolve=>queue.push(resolve));else active++;try{return await work();}finally{const next=queue.shift();if(next)next();else active--;}}
 const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s’'’.-]/g,'');
 const number=s=>String(s||'').toUpperCase().replace(/^([A-Z]*)0+(?=\d)/,'$1');
 const scope=d=>JSON.stringify([d.name,d.enName,d.local,d.lang,d.number,d.setId,d.code,d.set,d.enSet,d.langSure,d.setSure,d.codeSure]);
 const blocked=d=>d.factConflict||d.detailMismatch||d.ocrConflict;
 const labels={normal:'Normal',reverse:'Reverse-Holo',holo:'Holo',pokeball:'Pokéball',masterball:'Meisterball',greatball:'Superball',ultraball:'Hyperball',cosmos:'Kosmos',galaxy:'Galaxie',glitter:'Glitzer',energy:'Energie',mirror:'Spiegel',gold:'Gold','cracked-ice':'Eisbruch',unlimited:'Unlimitiert',shadowless:'Ohne Schatten','1st-edition':'1. Edition',standard:'Standardformat',jumbo:'Jumbo'};
 function request(d){
  if(blocked(d)||!d.langSure||!d.number)return null;
  let lang=d.lang,set=d.setId;
  if(['de','en'].includes(lang)){if(!d.setSure||!set)return null;}
  else if(lang==='ja'){if(!d.codeSure)return null;set=d.code;}
  else if(lang==='zh'&&d.codeSure&&/^C[A-Z0-9]+$/i.test(d.code||'')){lang='zh-cn';set=d.code;}
  else return null;
  const n=d.number.split('/')[0];if(!/^[a-z\d.-]+$/i.test(set)||!/^[a-z\d]+$/i.test(n))return null;
  const printed=set==='svp'?n.replace(/^SVP/i,''):n;
  const local=/^\d+$/.test(printed)?String(Number(printed)):printed.toUpperCase();
  return {lang,set,local:number(local),url:'https://api.tcgdex.net/v2/'+lang+'/sets/'+encodeURIComponent(set)+'/'+encodeURIComponent(local)};
 }
 function decode(c,d,q){
  if(!c||norm(c.set?.id)!==norm(q.set)||number(c.localId)!==q.local)return null;
  const total=(d.number.split('/')[1]||'').replace(/^[A-Z]+/i,'');
  if(total&&Number(total)!==Number(c.set?.cardCount?.official))return null;
  const names=[d.name,d.enName,d.local].filter(Boolean).map(norm),en=root.NameIndex?.lookup(c.name,d.lang);
  if(!names.includes(norm(c.name))&&(!en||!names.includes(norm(en))))return null;
  const raw=Array.isArray(c.variants_detailed)?c.variants_detailed:Array.isArray(c.variants)?c.variants:null;
  const rows=raw||['normal','reverse','holo'].filter(k=>c.variants?.[k]===true).map(type=>({type}));
  const variants=rows.filter(v=>v&&['normal','reverse','holo'].includes(v.type)&&(!v.languages||v.languages.includes(q.lang))).map((v,i)=>{
   const words=[v.type,v.foil,v.subtype,...(Array.isArray(v.stamp)?v.stamp:[]),v.size&&v.size!=='standard'?v.size:null].filter(Boolean);
   const pid=v.thirdParty?.cardmarket;
   return {id:String(v.variantId||i),label:words.map(w=>labels[w]||w).join(' · '),query:words.join(' '),productId:Number.isSafeInteger(pid)&&pid>0?pid:null};
  });
  let image='';try{const u=new URL(c.image);if(u.origin==='https://assets.tcgdex.net'&&!u.search&&!u.pathname.includes('/tcgp/'))image=u.href+'/high.webp';}catch{}
  return {name:c.name,set:c.set.name,variants,image,source:q.url};
 }
 async function load(d,fetcher=fetch){
  const key=scope(d),q=request(d);if(!q)return null;
  const state={scope:key,status:'loading'};states.set(d,state);
  try{
   if(!cache.has(q.url))cache.set(q.url,limited(()=>fetcher(q.url,{signal:AbortSignal.timeout(15000)}).then(async r=>{if(!r.ok)throw Error();return r.json();})).catch(e=>{cache.delete(q.url);throw e;}));
   const raw=await cache.get(q.url);if(scope(d)!==key||blocked(d))return null;
   const result=decode(raw,d,q);Object.assign(state,{status:result?.variants.length?'ready':'empty',result});return state;
  }catch{if(scope(d)===key)state.status='error';return null;}
 }
 function state(d){const s=states.get(d);return s?.scope===scope(d)&&!blocked(d)?s:null;}
 function choice(d){const s=state(d);return s?.choice||null;}
 function choose(d,id){const s=state(d),v=s?.result?.variants.find(v=>v.id===id);if(!v)return false;
  if(!s.previousLink)s.previousLink=d.cmFound||d.cmPrices||'';
  s.choice={...v,url:''};d.cmFound='';d.cmPrices='';d.cmState='ambiguous';return true;
 }
 function confirm(d,url){const c=choice(d);if(!c||!root.VariantPicker?.validProduct(url))return false;c.url=url;return true;}
 function pending(d){return !!choice(d)&&!choice(d).url;}
 function selected(d){const c=choice(d);return c?.url?c:null;}
 function label(d){const c=choice(d);return c?c.label+(c.url?' (manuell bestätigt)':' (Produktlink ungeprüft)'):'';}
 function mount(host,d,changed,zoom){
  if(!request(d))return;
  const snapshot=scope(d);const doc=host.ownerDocument,add=(tag,text,parent=host)=>{const e=doc.createElement(tag);e.textContent=text||'';parent.append(e);return e;};
  const box=add('details');box.open=!!choice(d);add('summary','Weitere Druck- und Holo-Varianten prüfen (TCGdex)',box);
  let s=state(d);
  if(!s){load(d).then(()=>{if(scope(d)===snapshot)changed();});s=state(d);}
  if(s?.status==='loading'){add('p','Variantenkatalog wird abgefragt …',box);return;}
  if(s?.status!=='ready'){
   add('p',s?.status==='error'?'Katalog gerade nicht erreichbar.':'Keine passenden Variantenangaben für diese Sprache, Nummer und dieses Set gefunden.',box);
   const b=add('button','Erneut prüfen',box);b.type='button';b.onclick=()=>{load(d).then(changed);changed();};return;
  }
  const r=s.result;
  add('p',r.name+' · '+r.set+'. Katalogangaben sind Vergleichshilfen, keine automatische Bestätigung der fotografierten Version.',box);
  if(r.image){const im=add('img','',box);im.src=r.image;im.alt='Artwork-Referenz von TCGdex, kein Nachweis des Holo-Musters';im.loading='lazy';im.style.cssText='width:150px;max-width:100%;cursor:zoom-in';im.onclick=()=>zoom(r.image);im.onerror=()=>{im.remove();};add('p','Artwork-Referenz von TCGdex. Holo-Muster und Stempel können abweichen.',box);}
  const source=add('a','Katalogquelle',box);source.href=r.source;source.target='_blank';source.rel='noopener';
  for(const v of r.variants){const line=add('p','',box);const b=add('button',(choice(d)?.id===v.id?'Gewählt: ':'')+v.label,line);b.type='button';b.className='btn small';b.onclick=()=>{if(scope(d)===snapshot&&choose(d,v.id))changed();};if(v.productId)add('small',' Cardmarket-ID laut Katalog: '+v.productId,line);}
  const c=choice(d);if(!c)return;
  add('p','Gewählt: '+c.label+'. Vergleiche die Produktseite mit deiner Karte und übernimm erst danach den passenden Link. Auch der Angebotsfilter für Reverse/Edition muss passen.',box);
  const query=[d.enName||d.name,d.enSet||d.set,d.number.split('/')[0],c.query,'Cardmarket'].filter(Boolean).join(' ');
  const a=add('a','Diese Variante bei Google suchen',box);a.href='https://www.google.de/search?q='+encodeURIComponent(query);a.target='_blank';a.rel='noopener';
  if(s.previousLink&&root.VariantPicker?.validProduct(s.previousLink)){
   const link=add('a',' Bisherige Produktseite vergleichen',box);link.href=s.previousLink;link.target='_blank';link.rel='noopener';
   if(!c.url){const b=add('button','Verglichen: Diese Produktseite passt zur gewählten Variante',box);b.type='button';b.className='btn small';b.onclick=()=>{if(scope(d)===snapshot&&confirm(d,s.previousLink)){d.cmFound=s.previousLink;d.cmState='found';changed();}};}
  }
  add('p',c.url?'Produktlink für diese einzelne Karte manuell bestätigt.':'Anderen Produktlink unter „Korrigieren“ einfügen. Noch kein bestätigter Variantenlink im Export.',box);
 }
 const api={request,decode,load,state,choice,choose,confirm,pending,selected,label,mount,scope};root.VariantResearch=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
