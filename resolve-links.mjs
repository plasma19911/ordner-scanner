// Liest die Karten aus dem Issue, sucht je Karte die Cardmarket-Seite und ergänzt links.json.
// Zeilenformat im Issue:  <schlüssel>\t<suchbegriff>   z. B.  s4a|250/190<TAB>Dedenne (s4a 250)
import fs from "fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const CM = /https?:\/\/www\.cardmarket\.com\/[a-z]{2}\/Pokemon\/Products\/Singles\/[^"'&<>\s?#]+/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url){
  const r = await fetch(url, {headers: {"user-agent": UA, "accept-language": "de-DE,de;q=0.9"}});
  return r.text();
}
async function firstHit(q){
  const html = await get("https://duckduckgo.com/?q=" + encodeURIComponent("\\site:cardmarket.com/de " + q));
  const m = html.match(/uddg=([^&"']+)/);
  if (m){ const u = decodeURIComponent(m[1]).match(CM); if (u) return u[0]; }
  const list = await get("https://html.duckduckgo.com/html/?q=" + encodeURIComponent("site:cardmarket.com " + q));
  for (const x of list.matchAll(/uddg=([^&"']+)/g)){ const u = decodeURIComponent(x[1]).match(CM); if (u) return u[0]; }
  return null;
}

const links = fs.existsSync("links.json") ? JSON.parse(fs.readFileSync("links.json", "utf8")) : {};
const lines = (process.env.ISSUE_BODY || "").split(/\r?\n/).map(l => l.split("\t")).filter(p => p.length >= 2 && p[0].includes("|"));
let found = 0, missing = [];
for (const [key, query] of lines){
  const k = key.trim().toLowerCase();
  if (links[k]) continue;
  let url = null;
  for (let attempt = 0; attempt < 2 && !url; attempt++){
    for (const q of query.split("||").map(x => x.trim()).filter(Boolean)){
      try { url = await firstHit(q); } catch(e){}
      if (url) break;
    }
    if (!url) await sleep(2500);
  }
  if (url){ links[k] = url.replace(/cardmarket\.com\/[a-z]{2}\//i, "cardmarket.com/de/"); found++; console.log("OK ", k, "->", links[k]); }
  else { missing.push(query.trim()); console.log("-- ", k, query); }
  await sleep(1500);
}
const sorted = Object.fromEntries(Object.entries(links).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync("links.json", JSON.stringify(sorted, null, 1) + "\n");
fs.writeFileSync("summary.txt", `${found} Links ergänzt.` + (missing.length ? ` Nicht gefunden: ${missing.join(", ")}` : ""));
console.log(fs.readFileSync("summary.txt", "utf8"));
