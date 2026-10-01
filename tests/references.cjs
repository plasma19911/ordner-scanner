const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
  const {parseReferences,validImage,referenceSearch,fetchReference}=await import('../src/reference-source.mjs');
  const tile=(href,name,set,number,image)=>`<a href="${href}" class="card-item"><img src="${image}"><span class="card-name">${name}</span><span class="card-number">${number}</span><span class="card-set">${set}</span></a>`;
  const image='https://www.pokemonkarte.de/jap_img/kaarten/adv5-9.webp';
  const cards=parseReferences(tile('/japanse-kaart?kaart=adv5-9','Heracross','Undone Seal','009/083',image),'ja');
  assert.equal(cards[0].number,'009/083');assert.equal(cards[0].slug,'adv5-9');
  assert.equal(parseReferences(tile('/karte/test','Entei','POP Series 2','42736',image),'de')[0].number,'');
  assert.equal(parseReferences(tile('https://evil.example/karte/test','Entei','Test','1/10',image),'en').length,0);
  for(const url of ['https://evil.example/a.png','https://www.pokemonkarte.de/api/a.png','https://www.pokemonkarte.de/wp-content/uploads/../../api/a.png',image+'?url=x'])assert.equal(validImage(url),null);
  assert.equal(parseReferences(Array.from({length:81},(_,i)=>tile('/karte/test-'+i,'Entei','Test','1/10',image)).join(''),'en').length,0);
  let hops=0;
  const redirected=await fetchReference('https://www.pokemonkarte.de/search?q=Heracross',async url=>{
    hops++;return hops===1?new Response('',{status:302,headers:{Location:'/suche?q=Heracross'}}):new Response('ok');
  });
  assert.equal(hops,2);assert.equal(await redirected.text(),'ok');
  await assert.rejects(()=>fetchReference('https://www.pokemonkarte.de/search',async()=>new Response('',{status:302,headers:{Location:'https://evil.example/search'}})));
  let requested;await referenceSearch('ja','Erika\'s Bulbasaur',async(url)=>{requested=new URL(url);return {ok:true,text:async()=>''}});
  assert.equal(requested.pathname,'/japanse-search');assert.equal(requested.searchParams.get('q'),"Erika's Bulbasaur");
  await assert.rejects(()=>referenceSearch('xx','Entei'));
  const html=fs.readFileSync('index.html','utf8');
  const ctx=vm.createContext({console,fetch:async()=>({ok:false}),URL,Map,getSets:async lang=>[{id:'swsh12.5gg',name:lang==='de'?'Zenit der Könige Galarian Gallery':'Crown Zenith Galarian Gallery',cardCount:{official:70}},{id:'ecard3',name:'Skyridge',cardCount:{official:144}}]});
  vm.runInContext(html.slice(html.indexOf('function numberOf('),html.indexOf('/* ---------- card lookup')),ctx);
  vm.runInContext(html.slice(html.indexOf('const REFERENCE_CACHE'),html.indexOf('async function finishCard(')),ctx);
  assert.equal(ctx.numberOf({localId:'GG36',official:70}),'GG36/GG70');
  let r=await ctx.referenceMetadata({lang:'ja',slug:'B05-7',set:'Leaders Stadium',number:''});assert.equal(r.vintageSet,"Leaders' Stadium");assert.equal(r.number,'');assert.equal(r.code,'');
  r=await ctx.referenceMetadata({lang:'de',slug:'entei-v-gg36-crz',set:'Crown Zenith - Galarian Gallery',number:'GG36/GG70'});assert.equal(r.setId,'swsh12.5gg');
  r=await ctx.referenceMetadata({lang:'de',slug:'flareon-8-sk',set:'Skyridge',number:''});assert.equal(r.number,'008/144');
  assert.equal(await ctx.referenceMetadata({lang:'ja',slug:'unknown-244',set:'Unknown',number:''}),null);
  vm.runInContext(fs.readFileSync('image-match.js','utf8'),ctx);
  const good={match:{inliers:80,ratio:.85,coverage:.5,score:80}},badge={match:{inliers:80,ratio:.85,coverage:.02,score:7}};
  assert.equal(ctx.CardMatcher.certain([good]),true);assert.equal(ctx.CardMatcher.certain([badge]),false);
  assert.equal(ctx.CardMatcher.certain([good,{match:{...good.match,score:76}}]),false);
  vm.runInContext(html.slice(html.indexOf('function cardKey('),html.indexOf('function memGet(')),ctx);
  vm.runInContext(html.slice(html.indexOf('function gemPackIdentity'),html.indexOf('async function findCardmarket')),ctx);
  vm.runInContext(html.slice(html.indexOf('async function findCardmarket('),html.indexOf('function cmLink(')),ctx);
  const links=JSON.parse(fs.readFileSync('links.json','utf8'));
  Object.assign(ctx,{render(){},renderExport(){},memGet:d=>links[ctx.cardKey(d)] || '',cseId:()=>'',pricesLink:()=>''});
  for(const data of [
    {lang:'ja',langSure:true,code:'adv5',codeSure:true,number:'009/083',enName:'Heracross'},
    {lang:'ja',langSure:true,code:'l2',codeSure:true,number:'009/080',enName:'Flareon'},
    {lang:'ja',langSure:true,vintageSet:'Mystery of the Fossils',number:'',enName:'Muk'},
    {lang:'ja',langSure:true,vintageSet:"Leaders' Stadium",number:'',enName:"Erika's Bulbasaur"}
  ]){const item={data};await ctx.findCardmarket(item);assert.equal(item.data.cmState,'found');assert.match(item.data.cmFound,/^https:\/\/www\.cardmarket\.com\/de\/Pokemon\/Products\/Singles\//);}
  vm.runInContext(html.slice(html.indexOf('const CM_PRODUCTS_BY_ID'),html.indexOf('/* ---------- link memory')),ctx);
  for(const [setId,number,target] of [['base1','030/102','base1-30'],['ecard3','008/144','ecard3-8'],['sm3.5','074/073','sm35-74'],['swsh12.5gg','GG36/GG70','swsh12pt5gg-GG36']]){
    const item={data:{lang:'de',langSure:true,setSure:true,setId,number}};await ctx.findCardmarket(item);assert.equal(item.data.cmState,'prices');assert.match(item.data.cmPrices,/^https:\/\/www\.cardmarket\.com\//);
  }
  assert.equal(ctx.pricesLink({lang:'en',setId:'ecard3',number:'8/144'}),'https://www.cardmarket.com/de/Pokemon/Products/Singles/Skyridge/Flareon-V2-SK8');
  const worker=(await import('../src/worker.mjs')).default;
  const env={ASSETS:{fetch:async()=>new Response('asset')}};
  assert.equal(await (await worker.fetch(new Request('https://scanner.test/index.html'),env)).text(),'asset');
  assert.equal((await worker.fetch(new Request('https://scanner.test/api/references?lang=xx&q=Entei'),env)).status,400);
  assert.equal((await worker.fetch(new Request('https://scanner.test/api/reference-image?url=https://evil.example/a.png'),env)).status,400);
  assert.equal((await worker.fetch(new Request('https://scanner.test/api/references',{method:'POST'}),env)).status,405);
  const originalFetch=global.fetch;global.fetch=async()=>new Response('not an image',{headers:{'Content-Type':'text/html'}});
  try {assert.equal((await worker.fetch(new Request('https://scanner.test/api/reference-image?url='+encodeURIComponent(image)),env)).status,502);}finally{global.fetch=originalFetch;}
  console.log('Reference parser, metadata, image confidence and Worker route checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
