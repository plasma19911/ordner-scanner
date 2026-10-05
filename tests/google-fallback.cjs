const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const code=html.slice(html.indexOf('function gemPackIdentity('),html.indexOf('async function findCardmarket('))+
 html.slice(html.indexOf('function googleUrl('),html.indexOf('const CM_LANG'));
const ctx=vm.createContext({NameIndex:{lookup:()=>''}});vm.runInContext(code,ctx);
const query=(d,kind)=>new URL(ctx.googleUrl(d,kind)).searchParams.get('q');
const rapidash={enName:'Galarian Rapidash',number:'SV048/SV122',lang:'en',enSet:'Shining Fates Shiny Vault'};
assert.equal(query(rapidash),'SV048 Shining Fates Cardmarket');
assert.equal(query(rapidash,'name'),'Galarian Rapidash Shining Fates Cardmarket');
assert.equal(query({name:'irgendein Name',number:'007/199',enSet:'Example Set'}),'007 Example Set Cardmarket');
assert.equal(query({number:'115/199',enSet:'Another Set'}),'115 Another Set Cardmarket');
assert.equal(query({enName:'Dedenne',number:'250/190',lang:'ja',set:'Shiny Star V',code:'s4a'}),'250 Shiny Star V Cardmarket');
assert.equal(query({enName:'Captain Pikachu',number:'0701/09',lang:'zh',code:'CBB1C'}),'07 Gem Pack Vol 1 Cardmarket');
assert.equal(query({enName:'Meowth',number:'0202/07',lang:'zh'}),'Meowth Cardmarket');
assert.equal(query({enName:'Chimchar',number:'DPBP#451',lang:'ja',vintageSet:'Space-Time Creation'}),'Chimchar Space-Time Creation Cardmarket');
assert.equal(rapidash.number,'SV048/SV122');
assert.ok(!html.includes('>Cardmarket-Link holen<'));
assert.match(html,/bei Google suchen</);
console.log('Search prioritizes collector number + English set, then English name + set; Google is labelled explicitly');
