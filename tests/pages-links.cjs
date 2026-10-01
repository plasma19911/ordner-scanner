const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const ctx=vm.createContext({URL,console,localStorage:{getItem:()=>JSON.stringify({'base set|30/102':'https://www.cardmarket.com/en/Pokemon/Products/Singles/Base-Set/Ivysaur-V1-BS30'})}});
function section(a,b){return html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));}
vm.runInContext(section('function cardKey(','function acceptLink(')+section('const CM_LANG','function openZoom(')+section('function cmLink(','/* ---------- verified direct'),ctx);
const direct='https://www.cardmarket.com/de/Pokemon/Products/Singles/Base-Set/Ivysaur-V1-BS30';
assert.equal(ctx.extractCardmarket('https://cardmarket.com/en/Pokemon/Products/Singles/Base-Set/Ivysaur-V1-BS30?x=1'),direct);
assert.equal(ctx.extractCardmarket('https://www.google.de/url?q='+encodeURIComponent(direct)),direct);
assert.equal(ctx.extractCardmarket('https://prices.pokemontcg.io/cardmarket/base1-30'),'');
assert.equal(ctx.extractCardmarket('https://evilcardmarket.com/de/Pokemon/Products/Singles/Base-Set/Ivysaur-V1-BS30'),'');
assert.equal(ctx.extractCardmarket('%broken'),'');
assert.equal(ctx.memGet({enSet:'Base Set',number:'030/102'}),direct);
const filtered=new URL(ctx.cmLink({cmPrices:direct,lang:'de'}));
assert.equal(filtered.hostname,'www.cardmarket.com');assert.equal(filtered.searchParams.get('language'),'3');
assert.equal(ctx.cmLink({cmPrices:'https://prices.pokemontcg.io/cardmarket/base1-30',lang:'de'}),'');
(async()=>{
 const calls=[];
 const cached={lang:'ja',name:'Heracross',cachedImage:'reference-images/test.webp',image:'https://www.pokemonkarte.de/jap_img/kaarten/adv5-9.webp'};
 const pages=vm.createContext({location:{hostname:'plasma19911.github.io'},fetch:async url=>{calls.push(url);return {ok:true,json:async()=>({cards:[cached]})};}});
 vm.runInContext(section('const REFERENCE_CACHE','async function referenceMetadata('),pages);
 const cards=await pages.referenceCards('ja','Heracross');assert.equal(cards[0].image,cached.cachedImage);assert.equal(cards[0].directImage,true);
 assert.equal((await pages.referenceCards('ja','Missing')).length,0);assert.deepEqual(calls,['reference-cache.json']);
 const workerCalls=[];
 const worker=vm.createContext({location:{hostname:'scanner.example'},fetch:async url=>{workerCalls.push(url);return {ok:true,json:async()=>({cards:[]})};}});
 vm.runInContext(section('const REFERENCE_CACHE','async function referenceMetadata('),worker);
 await worker.referenceCards('ja','Heracross');assert.equal(workerCalls[1],'api/references?lang=ja&q=Heracross');
 console.log('GitHub Pages cache, direct product URLs, copied Google links and legacy link memory checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
