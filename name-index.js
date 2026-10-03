/* Canonical English names; exact aliases only. Confirmed corrections stay on this device. */
(function(root){
 const aliases=new Map(),species=new Set(),key=s=>String(s||'').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
 const valid=s=>typeof s==='string'&&s.trim().length>0&&s.length<=120&&!/[\x00-\x1f<>]/.test(s);
 let learned={};try{const data=JSON.parse(localStorage.getItem('fp_name_aliases')||'{}');if(data&&typeof data==='object'&&!Array.isArray(data))learned=data;}catch{}
 function add(lang,local,en){if(!valid(local)||!valid(en))return;const k=lang+'|'+key(local);if(!aliases.has(k))aliases.set(k,new Set());aliases.get(k).add(en);}
 function configure(rows){for(const r of rows){species.add(r[0]);for(const [i,lang] of ['en','ja','zh','zh','de'].entries())if(r[i])add(lang,r[i],r[0]);}}
 function lookup(local,lang){const k=lang+'|'+key(local),v=learned[k];if(valid(v))return v;const a=aliases.get(k);return a?.size===1?[...a][0]:'';}
 function remember(local,lang,en){if(!valid(local)||!valid(en)||!['en','de','ja','zh'].includes(lang))return false;learned[lang+'|'+key(local)]=en.trim();try{localStorage.setItem('fp_name_aliases',JSON.stringify(learned));}catch{}return true;}
 function speciesOf(en){const s=' '+key(en).replace(/[’]/g,"'")+' ';return [...species].sort((a,b)=>b.length-a.length).find(n=>s.includes(' '+key(n)+' ')||s.startsWith(' '+key(n)+'-'))||'';}
 function browse(en){const n=speciesOf(en);if(n&&/^[A-Za-z]+(?:-[A-Za-z]+)*$/.test(n))return 'https://www.cardmarket.com/de/Pokemon/Species/'+n;
   return en?'https://www.cardmarket.com/de/Pokemon/Products/Search?searchString='+encodeURIComponent(en):'';
 }
 const ready=typeof fetch==='function'?fetch('name-aliases.json').then(r=>r.ok?r.json():null).then(data=>{for(const row of data?.aliases||[])add(...row);}).catch(()=>{}):Promise.resolve();
 function namesFor(en,lang){
   const out=[];for(const [k,v] of aliases)if(k.startsWith(lang+'|')&&v.size===1&&v.has(en))out.push(k.slice(lang.length+1));
   return [...new Set(out)];
 }
 root.NameIndex={configure,lookup,remember,speciesOf,browse,namesFor,ready};
})(globalThis);
