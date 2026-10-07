// Search snippets may suggest products, but only exact set + number pairs qualify.
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const num=s=>String(s||'').toUpperCase().replace(/^([A-Z]*)0+(?=\d)/,'$1');
export function identityFromQueries(queries){
 for(const q of queries){const m=/^([A-Z]*\d+)\s+(.+)$/i.exec(q.trim());if(m)return {number:num(m[1]),set:m[2].replace(/\s+Cardmarket$/i,'')};}
 return null;
}
export function matchedProduct(value,identity){
 if(!identity)return '';
 try{
  const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='www.cardmarket.com')return '';
  const m=/^\/[a-z]{2}\/Pokemon\/Products\/Singles\/([^/]+)\/([^/]+)$/.exec(u.pathname);if(!m)return '';
  if(norm(decodeURIComponent(m[1]))!==norm(identity.set))return '';
  const slug=decodeURIComponent(m[2]);if(/-V\d+(?:-|$)/i.test(slug))return ''; // Separate print versions need visual confirmation.
  const suffix=slug.match(/-([A-Z]*)(\d+)$/i);if(!suffix)return '';
  const expected=/^([A-Z]*)(\d+)$/.exec(identity.number);if(!expected)return '';
  if(Number(suffix[2])!==Number(expected[2])||(expected[1]&&!suffix[1].toUpperCase().endsWith(expected[1])))return '';
  return 'https://www.cardmarket.com/de/Pokemon/Products/Singles/'+m[1]+'/'+m[2];
 }catch{return '';}
}
export function uniqueProduct(html,identity){
 const urls=[...String(html).matchAll(/https?:\/\/www\.cardmarket\.com\/[^\s"'<>?#&]+/gi)].map(m=>m[0]);
 for(const m of String(html).matchAll(/uddg=([^&"']+)/g)){try{urls.push(decodeURIComponent(m[1]));}catch{}}
 const valid=[...new Set(urls.map(u=>matchedProduct(u,identity)).filter(Boolean))];return valid.length===1?valid[0]:'';
}
