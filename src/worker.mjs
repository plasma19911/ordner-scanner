import {referenceSearch, validImage} from './reference-source.mjs';
const json = (value, status=200) => Response.json(value, {status, headers:{'Cache-Control':status===200?'public, max-age=300':'no-store'}});
export default {
  async fetch(request, env) {
    const u = new URL(request.url);
    if (!u.pathname.startsWith('/api/reference')) return env.ASSETS.fetch(request);
    if (request.method !== 'GET') return json({error:'Method not allowed'},405);
    try {
      if (u.pathname === '/api/references') {
        const lang = u.searchParams.get('lang'), query = (u.searchParams.get('q') || '').trim();
        if (!['en','de','ja'].includes(lang) || query.length < 3 || query.length > 60) return json({error:'Invalid query'},400);
        return json({cards:await referenceSearch(lang,query)});
      }
      if (u.pathname === '/api/reference-image') {
        const image = validImage(u.searchParams.get('url'));
        if (!image) return json({error:'Invalid reference image'},400);
        const r = await fetch(image.href, {signal:AbortSignal.timeout(15000), redirect:'error',cf:{cacheTtl:86400,cacheEverything:true}});
        if (!r.ok || !/^image\//.test(r.headers.get('Content-Type') || '')) return json({error:'Image unavailable'},502);
        return new Response(r.body,{headers:{'Content-Type':r.headers.get('Content-Type'),'Cache-Control':'public, max-age=86400'}});
      }
      return json({error:'Not found'},404);
    } catch {return json({error:'Reference source unavailable'},502);}
  }
};
