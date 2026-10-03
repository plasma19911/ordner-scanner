import {readFile,writeFile} from 'node:fs/promises';
// Optional local input folder makes the snapshot reproducible without downloading again.
const folder=process.argv[2];
async function catalogue(lang){if(folder)return JSON.parse(await readFile(`${folder}/${lang}.json`,'utf8'));const r=await fetch(`https://api.tcgdex.net/v2/${lang}/cards`);if(!r.ok)throw Error('Catalogue unavailable');return r.json();}
const [en,de]=await Promise.all(['en','de'].map(catalogue));
if(en.length<10000||de.length<10000)throw Error('Incomplete name catalogue');
const english=new Map(en.filter(c=>!/^([AB]\d|P-A)/.test(c.id)&&!c.image?.includes('/tcgp/')).map(c=>[c.id,c.name]));
const rows=[...new Set(english.values())].map(n=>['en',n,n]);
for(const c of de){const name=english.get(c.id);if(name)rows.push(['de',c.name,name]);}
const aliases=[...new Map(rows.map(r=>[JSON.stringify(r),r])).values()].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
await writeFile('name-aliases.json',JSON.stringify({source:'https://api.tcgdex.net/v2/',generatedAt:new Date().toISOString(),note:'English and German names joined by the same international card ID. Japanese and Chinese Pokémon aliases are seeded separately; other translations require confirmation.',aliases},null,2)+'\n');
console.log(`${aliases.length} exact name aliases`);
