/* Product variants are separate from artwork recognition. No guessed V suffixes. */
(function(root){
 'use strict';
 let groups=[];
 const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s-]/g,'');
 const product=s=>{try{const u=new URL(s);return u.protocol==='https:'&&u.hostname==='www.cardmarket.com'&&/^\/[a-z]{2}\/Pokemon\/Products\/Singles\/[^/]+\/[^/]+$/.test(u.pathname)&&!u.search&&!u.hash;}catch{return false;}};
 const image=s=>{try{const u=new URL(s);return u.protocol==='https:'&&['images.pikaqian.com','gengar.s28.cdn-upgates.com','product-images.s3.cardmarket.com'].includes(u.hostname);}catch{return false;}};
 const scope=d=>JSON.stringify([d.name,d.enName,d.local,d.lang,d.number,d.code,d.set,d.enSet]);
 function configure(data){groups=(data?.groups||[]).filter(g=>g.id&&g.set&&Array.isArray(g.names)&&Array.isArray(g.codes)&&g.codes.length&&Array.isArray(g.variants)).map(g=>({...g,variants:g.variants.filter(v=>v.id&&product(v.url)),references:(g.references||[]).filter(r=>image(r.image))}));}
 function group(d){
  const link=d.cmFound||d.cmPrices||d.cmCandidate;
  const direct=groups.find(g=>g.variants.some(v=>v.url===link));if(direct)return direct;
  const found=groups.filter(g=>{
   if(d.langSure&&d.lang!==g.lang)return false;
   if(!g.names.some(n=>norm(n)===norm(d.enName||d.name)))return false;
   const code=norm(d.code||d.printedCode);if(code&&!g.codes.some(c=>norm(c)===code))return false;
   if(g.printTotal){const m=/^(\d{2})(\d{2})\/(\d{2})$/.exec(d.number||'');return !!m&&m[1]===g.collector&&m[3]===g.printTotal;}
   return (d.number||'').split('/')[0].replace(/^0+/,'')===g.collector.replace(/^0+/,'') && (code||norm(d.enSet||d.set)===norm(g.set));
  });return found.length===1?found[0]:null;
 }
 function selected(d){const c=d.variantChoice;if(!c||c.scope!==scope(d)||d.factConflict||d.detailMismatch)return null;return groups.flatMap(g=>g.variants).find(v=>v.id===c.id&&v.url===c.url)||null;}
 function choose(d,id,expectedScope){
  if(scope(d)!==expectedScope||d.factConflict||d.detailMismatch)return false;
  const g=group(d),v=g?.variants.find(v=>v.id===id);if(!v)return false;
  // Explicit comparison confirms the product, not a guessed printed foil code.
  d.lang=g.lang;d.langSure=true;d.set=d.enSet=g.set;d.setSure=true;
  d.code=g.codes[0];d.codeSure=true;d.name=d.enName=v.name;d.local='';d.nameTouched=true;
  d.variantChoice={id:v.id,url:v.url,scope:scope(d)};
  d.cmFound=v.url;d.cmPrices='';d.cmState='found';return true;
 }
 function mount(host,d,onChoose,onZoom){
  const g=group(d);if(!g)return;
  const doc=host.ownerDocument,add=(tag,text,parent=host)=>{const el=doc.createElement(tag);if(text)el.textContent=text;parent.append(el);return el;};
  const details=add('details');details.open=!selected(d);add('summary','Druck- und Holo-Version auswählen',details);
  add('p',g.set+' · '+g.collector+' · '+g.variants.length+' hinterlegte Produktversionen. Vergleiche Artwork, Nummer und Holo-Muster vor der Auswahl.',details);
  if(g.references.length){
   add('p','Gedruckte Varianten als Bildreferenz (Pikaqian, keine Cardmarket-Bilder). Die Zuordnung zu einer Cardmarket-V-Nummer ist damit noch nicht bestätigt.',details);
   const refs=add('div','',details);refs.className='picks';
   for(const r of g.references){const tile=add('div','',refs);tile.className='pick';const im=add('img','',tile);im.src=r.image;im.alt='Gedruckte Variante '+r.printedNumber;im.loading='lazy';im.onclick=()=>onZoom(r.image);im.onerror=()=>{im.remove();add('span','Referenzbild nicht verfügbar',tile);};add('span',r.printedNumber,tile);const a=add('a','Bildquelle öffnen',tile);a.href=r.source;a.target='_blank';a.rel='noopener';}
  }
  add('p','Cardmarket-Produktbilder sind hier derzeit nicht automatisch abrufbar. Öffne zum Vergleich die jeweilige Produktseite. V1, V2 usw. sind Produktkennungen, keine bestätigten Holo-Bezeichnungen.',details);
  const list=add('div','',details);list.className='picks';const snapshot=scope(d),current=selected(d);
  for(const v of g.variants){
   const tile=add('div','',list);tile.className='pick';tile.style.cssText='display:flex;flex-direction:column;align-items:stretch;min-width:150px;max-width:220px';
   if(v.image&&v.imageVerified&&image(v.image)){const im=add('img','',tile);im.src=v.image;im.alt=v.name+' '+v.label;im.loading='lazy';im.onclick=()=>onZoom(v.image);im.onerror=()=>{im.remove();add('span','Bild nicht verfügbar – Produktseite öffnen',tile);};}
   add('strong',v.name+' · '+v.label,tile);
   const a=add('a','Produktbild auf Cardmarket ansehen',tile);a.href=v.url;a.target='_blank';a.rel='noopener';
   const button=add('button',current?.id===v.id?'Ausgewählt':'Diese Version passt',tile);button.type='button';button.className='btn small';button.disabled=!!(d.factConflict||d.detailMismatch);button.onclick=()=>{if(choose(d,v.id,snapshot))onChoose(v);};
  }
  if(d.factConflict||d.detailMismatch)add('p','Bitte zuerst den Widerspruch zwischen Foto und Kartendaten klären.',details);
  if(current)add('p','Produktversion für diese einzelne Karte manuell bestätigt. Andere Karten werden nicht mit geändert.',details);
 }
 const ready=typeof fetch==='function'?fetch('variant-catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(configure).catch(()=>{}):Promise.resolve();
 const api={configure,group,scope,selected,choose,mount,ready,validProduct:product};root.VariantPicker=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
