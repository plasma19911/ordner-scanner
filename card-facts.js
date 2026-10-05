/* Structured card evidence. No photograph is sent to a catalogue. */
(function(root){
 const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}]/gu,'');
 const unique=a=>[...new Set(a)];
 function printed(result){
  const titles=(result?.titles||[]).filter(l=>l.score>=.9),footer=(result?.footer||[]).filter(l=>l.score>=.9);
  const hp=unique(titles.flatMap(l=>[...l.text.normalize('NFKC').matchAll(/(?:\b(?:HP|KP)\s*(\d{2,3})(?!\d)|(\d{2,3})\s*(?:HP|KP)\b)/gi)].map(m=>Number(m[1]||m[2]))).filter(n=>n>=10&&n<=999));
  const artist=unique(footer.map(l=>(l.text.match(/(?:illus\.?|illustrator)\s*[:：]?\s*([A-Za-z][A-Za-z .'-]{3,45})/i)||[])[1]?.trim()).filter(Boolean));
  const damage=(result?.body||[]).filter(l=>l.score>=.95&&result.width&&Math.min(...l.poly.map(p=>p[0]))>=result.width*.7&&/^\d{1,3}[+×x]?$/i.test(l.text.trim())).map(l=>l.text.trim().replace(/x/i,'×'));
  return {hp:hp.length===1?hp[0]:null,hpConflict:hp.length>1,artist:artist.length===1?artist[0]:'',damage:unique(damage),bodyText:(result?.body||[]).filter(l=>l.score>=.9).map(l=>l.text).join('\n')};
 }
 function language(result){
  const text=(result?.lines||[]).filter(l=>l.score>=.85).map(l=>l.text).join(' ').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const count=words=>words.filter(w=>new RegExp('\\b'+w+'\\b').test(text)).length;
  const de=count(['deines','deinem','gegners','schadenspunkte','schadensmarken','schwache','resistenz','angriff']);
  const en=count(['your','opponent','damage','weakness','resistance','retreat','discard','heal']);
  return de>=3&&de>=en+2?'de':en>=3&&en>=de+2?'en':'';
 }
 function catalogue(card){return {hp:Number(card?.hp)||null,artist:card?.illustrator||'',attacks:(card?.attacks||[]).map(a=>({name:a.name||'',damage:String(a.damage??''),cost:a.cost||[]})),regulationMark:card?.regulationMark||'',category:card?.category||''};}
 function assess(observed,reference){
  if(!observed||!reference)return {score:0,conflicts:[],matches:[]};
  const conflicts=[],matches=[];let score=0;
  if(observed.hp&&reference.hp){if(observed.hp===reference.hp){score+=4;matches.push('KP');}else conflicts.push(`KP: gelesen ${observed.hp}, Katalog ${reference.hp}`);}
  if(observed.artist&&reference.artist&&norm(observed.artist)===norm(reference.artist)){score+=3;matches.push('Illustrator');}
  const body=norm(observed.bodyText);
  for(const a of reference.attacks||[]){if(norm(a.name).length>=4&&body.includes(norm(a.name))){score+=3;matches.push('Attacke: '+a.name);}}
  const expected=(reference.attacks||[]).map(a=>String(a.damage));
  for(const damage of observed.damage||[])if(expected.includes(damage)){score++;matches.push('Schaden '+damage);}
  // Missing/transliterated attack text and unclear artists are not negative evidence.
  return {score,conflicts,matches};
 }
 function rank(options,observed){return options.map(o=>({...o,factCheck:assess(observed,o.facts)})).sort((a,b)=>a.factCheck.conflicts.length-b.factCheck.conflicts.length||b.factCheck.score-a.factCheck.score);}
 function guidance(d){
  if(d.factConflict)return 'Bitte Titel und KP näher fotografieren: Foto und Katalog widersprechen sich.';
  if(!d.name&&!d.enName)return 'Bitte den Kartennamen und die KP oben scharf fotografieren.';
  if(!d.number||!d.numSure||d.ocrConflict)return 'Bitte den gesamten unteren Kartenrand näher fotografieren: Nummer, Setcode/Symbol und Jahreszahl müssen sichtbar sein.';
  if(!d.langSure)return 'Bitte Titel und einen Teil des Kartentextes scharf fotografieren, damit die Sprache bestimmt werden kann.';
  if(!d.setSure&&!d.codeSure)return 'Bitte Setsymbol oder Setcode neben der Nummer und die Copyright-Zeile näher fotografieren.';
  if(d.lang==='zh')return 'Für die Druckvariante zusätzlich die Kartenoberfläche leicht schräg fotografieren. Gleiches Artwork bestätigt kein Holo-Muster.';
  return '';
 }
 function links(d){
  const name=d.enName||d.local||d.name;if(!name)return [];
  const query=name+(d.printedFacts?.hp?' hp:'+d.printedFacts.hp:'');
  const links=[];
  if(['en','de','ja'].includes(d.lang))links.push({label:'Mit KP und Kartentext bei Limitless vergleichen',url:'https://limitlesstcg.com/cards/'+(d.lang==='ja'?'jp':d.lang)+'?q='+encodeURIComponent((d.local||d.name||name)+(d.printedFacts?.hp?' hp:'+d.printedFacts.hp:''))});
  if(d.enName)links.push({label:'Englische Vergleichskarten bei PkmnCards',url:'https://pkmncards.com/?s='+encodeURIComponent(query)});
  return links;
 }
 root.CardFacts={printed,language,catalogue,assess,rank,guidance,links};
})(globalThis);
