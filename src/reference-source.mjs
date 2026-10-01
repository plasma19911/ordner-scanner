const ORIGIN = 'https://www.pokemonkarte.de';
const SEARCH = {en: '/search', de: '/deutsche-search', ja: '/japanse-search'};
function decode(text) {
  return text.replace(/<[^>]*>/g, '').replace(/&(?:amp|quot|apos|lt|gt|#39|nbsp);/g,
    c => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' '}[c]))
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => {const v=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n); return v<=0x10ffff?String.fromCodePoint(v):'';}).trim();
}
function attr(tag, name) {return decode((tag.match(new RegExp('\\b'+name+'=["\']([^"\']*)["\']', 'i')) || [,''])[1]);}
export function validImage(value) {
  try {const u = new URL(value); return u.origin === ORIGIN && /^\/(?:jap_img\/kaarten|wp-content\/uploads|img\/kaarten)\//.test(u.pathname) && /\.(?:png|jpe?g|webp)$/i.test(u.pathname) && !u.search ? u : null;} catch {return null;}
}
export function parseReferences(html, lang) {
  const cards = [], seen = new Set();
  for (const m of html.matchAll(/<a\b([^>]*\bclass=["'][^"']*\bcard-item\b[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], 'href'), body = m[2];
    let source; try {source = new URL(href, ORIGIN);} catch {continue;}
    const img = attr((body.match(/<img\b[^>]*>/i) || [''])[0], 'src');
    const field = cls => decode((body.match(new RegExp('<span[^>]*class=["\'][^"\']*\\b'+cls+'\\b[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/span>', 'i')) || [,''])[1]);
    const name = field('card-name'), set = field('card-set');
    if (source.origin !== ORIGIN || !name || !set || !validImage(img) || seen.has(source.href)) continue;
    const nums = [...body.matchAll(/<span[^>]*class=["'][^"']*\bcard-number\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)].map(x => decode(x[1]));
    const slug = source.searchParams.get('kaart') || source.pathname.split('/').pop();
    cards.push({name, set, number: nums.find(n => /^[A-Z]*\d{1,3}\/[A-Z]*\d{1,3}$/i.test(n)) || '',
      local: nums.find(n => /[\u3040-\u30ff]/.test(n)) || '', slug, lang, image: img, source: source.href});
    seen.add(source.href);
    // Do not declare a winner from an incomplete candidate list.
    if (cards.length > 80) return [];
  }
  return cards;
}
export async function referenceSearch(lang, query, fetcher = fetch) {
  if (!SEARCH[lang] || !query || query.length > 60 || /[\x00-\x1f]/.test(query)) throw new Error('Invalid reference query');
  const u = new URL(SEARCH[lang], ORIGIN); u.searchParams.set('q', query);
  const r = await fetcher(u.href, {signal: AbortSignal.timeout(15000), redirect: 'error', cf:{cacheTtl:3600, cacheEverything:true}});
  if (!r.ok) throw new Error('Reference source unavailable');
  const html = await r.text();
  if (html.length > 1500000) throw new Error('Reference response too large');
  return parseReferences(html, lang);
}
