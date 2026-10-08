/* Optional market guidance, never a filtered NM/DE offer quote. */
(function(root){
 'use strict';
 const cache=new Map();let active=0;const queue=[];
 const ttl=60*60*1000,maxAge=14*86400000;
 const money=new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'});
 const norm=s=>String(s||'').toLowerCase();
 function scope(d){return JSON.stringify([root.VariantResearch?.scope(d),d.cmFound,d.cmPrices,d.cmState,d.variantChoice,root.VariantResearch?.choice(d),d.factConflict,d.detailMismatch,d.ocrConflict]);}
 function request(d){
  if(!d.cmFound&&!d.cmPrices)return null;
  if(root.VariantPicker?.group(d)||root.VariantResearch?.pending(d))return null;
  return root.VariantResearch?.request(d)||null;
 }
 function estimate(c,d,q,now=Date.now()){
  if(!root.VariantResearch.decode(c,d,q))return [];
  const details=Array.isArray(c.variants_detailed)?c.variants_detailed:[];
  const choice=root.VariantResearch?.selected(d);
  let variants=details.filter(v=>['normal','holo','reverse'].includes(norm(v.type)));
  if(choice)variants=variants.filter(v=>String(v.variantId)===choice.id);
  // Special finishes/editions/stamps need their own verified price mapping.
  variants=variants.filter(v=>(!v.size||norm(v.size)==='standard')&&!v.subtype&&!v.foil&&!(Array.isArray(v.stamp)?v.stamp.length:v.stamp));
  if(!details.length&&!choice)variants=['normal','holo','reverse'].filter(k=>c.variants?.[k]===true).map(type=>({type}));
  if(c.variants?.firstEdition||c.variants?.wPromo)return [];
  const rows=[];
  for(const v of variants){
   const p=v.pricing?.cardmarket||c.pricing?.cardmarket,type=norm(v.type);
   if(!p||p.unit!=='EUR')continue;
   if(v.thirdParty?.cardmarket&&p.idProduct!==v.thirdParty.cardmarket)continue;
   const date=Date.parse(p.updated);if(!Number.isFinite(date)||date>now+86400000||now-date>maxAge)continue;
   const suffix=type==='normal'?'':'-holo';
   const avg=p['avg30'+suffix],trend=p['trend'+suffix];
   const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>0;
   const amount=valid(avg)?avg:valid(trend)?trend:null;if(amount===null)continue;
   const basis=valid(avg)?'30-Tage-Mittel':'Preistrend';
   const label={normal:'Normal',holo:'Holo',reverse:'Reverse-Holo'}[type];
   if(!rows.some(r=>r.label===label))rows.push({label,amount,basis,date});
  }
  // Cardmarket has one shared holo bucket: don't pretend it distinguishes both.
  if(rows.some(r=>r.label==='Holo')&&rows.some(r=>r.label==='Reverse-Holo'))return rows.filter(r=>r.label==='Normal');
  return rows;
 }
 async function limited(work){if(active>=4)await new Promise(resolve=>queue.push(resolve));else active++;try{return await work();}finally{const next=queue.shift();if(next)next();else active--;}}
 async function load(q,fetcher=root.fetch){
  const hit=cache.get(q.url);if(hit&&Date.now()-hit.at<ttl)return hit.promise;
  const promise=limited(async()=>{const r=await fetcher(q.url,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('price source');return r.json();});
  const entry={at:Date.now(),promise};cache.set(q.url,entry);
  promise.catch(()=>{entry.at=Date.now()-ttl+60000;});return promise;
 }
 function mount(host,d){
  if(!host)return;
  const snapshot=scope(d),q=request(d),doc=host.ownerDocument;
  const show=(title,note)=>{host.replaceChildren();const strong=doc.createElement('strong');strong.textContent=title;host.append(strong);const small=doc.createElement('div');small.className='hint';small.textContent=note;host.append(small);};
  host.className='price-estimate';host.setAttribute('aria-live','polite');
  if(!q){show('Preis noch nicht bestimmbar','Karte und Druckversion müssen eindeutig zugeordnet sein.');return;}
  show('Preiseinschätzung wird geladen …','');
  load(q).then(c=>{
   if(!host.isConnected||scope(d)!==snapshot)return;
   const rows=estimate(c,d,q);
   if(!rows.length){show('Keine verlässliche Preiseinschätzung','Für diese Ausgabe fehlen passende, aktuelle Preisdaten.');return;}
   host.replaceChildren();
   const title=doc.createElement('strong');title.textContent='Preiseinschätzung';host.append(title);
   for(const r of rows){const line=doc.createElement('div');line.textContent=r.label+': ca. '+money.format(r.amount);host.append(line);}
   const note=doc.createElement('div');note.className='hint';note.textContent='Cardmarket via TCGdex · '+[...new Set(rows.map(r=>r.basis))].join(' / ')+' · Stand '+new Date(Math.min(...rows.map(r=>r.date))).toLocaleDateString('de-DE')+'. Markt-Richtwert, nicht nach NM, Sprache oder Verkäuferland gefiltert.'+(rows.length>1?' Holo-Version am Foto vergleichen.':'');host.append(note);
  }).catch(()=>{if(host.isConnected&&scope(d)===snapshot)show('Preis derzeit nicht verfügbar','Preisdaten konnten nicht geladen werden.');});
 }
 const api={request,estimate,load,mount,scope};root.PriceEstimate=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
