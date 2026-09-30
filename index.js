// freshPika Cardmarket-Finder – Cloudflare Worker
// Aufruf: https://<dein-worker>.workers.dev/?q=Dedenne%20(s4a%20250)
// Antwort: {"url":"https://www.cardmarket.com/de/Pokemon/Products/Singles/...","source":"..."}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const CM = /https?:\/\/www\.cardmarket\.com\/[a-z]{2}\/Pokemon\/Products\/Singles\/[^"'&<>\s?#]+/i;

async function viaDuckDuckGo(q){
  // "\" = erster Treffer; die Seite enthält den Ziel-Link als uddg-Parameter
  const r = await fetch("https://duckduckgo.com/?q=" + encodeURIComponent("\\site:cardmarket.com/de " + q), {headers: {"user-agent": UA, "accept-language": "de-DE,de;q=0.9"}});
  const html = await r.text();
  const m = html.match(/uddg=([^&"']+)/);
  if (!m) return null;
  const u = decodeURIComponent(m[1]);
  return CM.test(u) ? u.match(CM)[0] : null;
}
async function viaBing(q){
  const r = await fetch("https://www.bing.com/search?setlang=de&cc=DE&q=" + encodeURIComponent("site:cardmarket.com " + q), {headers: {"user-agent": UA, "accept-language": "de-DE,de;q=0.9"}});
  const html = await r.text();
  const m = html.match(CM);
  return m ? m[0] : null;
}

export default {
  async fetch(request){
    const cors = {"access-control-allow-origin": "*", "content-type": "application/json; charset=utf-8"};
    if (request.method === "OPTIONS") return new Response(null, {headers: cors});
    const q = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 200);
    if (!q) return new Response(JSON.stringify({error: "q fehlt"}), {status: 400, headers: cors});
    let url = null, source = null;
    for (const [name, fn] of [["duckduckgo", viaDuckDuckGo], ["bing", viaBing]]){
      try { url = await fn(q); } catch(e){}
      if (url){ source = name; break; }
    }
    if (url) url = url.replace(/cardmarket\.com\/[a-z]{2}\//i, "cardmarket.com/de/");
    return new Response(JSON.stringify({url, source}), {headers: {...cors, "cache-control": "public, max-age=86400"}});
  }
};
