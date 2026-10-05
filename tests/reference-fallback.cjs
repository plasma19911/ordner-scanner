const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const refs=[{lang:'ja',name:'Heracross',local:'ヘラクロス',slug:'adv5-9',set:'Undone Seal',number:'009/083',source:'heracross',cachedImage:'reference-images/one.webp'},
  {lang:'en',name:'Entei',slug:'entei-1',set:'Test',number:'001/100',source:'entei',cachedImage:'reference-images/two.webp'}];
let rankCalls=[],sure=true;
const ctx=vm.createContext({console,URL,Map,AbortSignal,REGIONS:[['ガラル','Galarian '],['アローラ','Alolan '],['ヒスイ','Hisuian '],['パルデア','Paldean ']],NAMES:[['Corsola','サニーゴ'],['Heracross','ヘラクロス'],['Raichu','ライチュウ']],englishFor:n=>n==='ライチュウ'?'Raichu':'',
  location:{hostname:'test.github.io'},window:{cv:{ORB:true}},loadImg:async x=>x,
  getSets:async()=>[{id:'SV1',name:'Scarlet',cardCount:{official:78}},{id:'test',name:'Test',cardCount:{official:100}}],
  fetch:async url=>({ok:true,json:async()=>url==='reference-cache.json'?{cards:refs}:[]}),
  CardMatcher:{rank:async(photo,candidates,load,cv,unknown)=>{
    rankCalls.push({candidates,unknown});return {sure:sure && candidates.some(c=>c.source==='heracross'),list:candidates.filter(c=>c.source==='heracross')};
  }}
});
vm.runInContext(fs.readFileSync('card-evidence.js','utf8'),ctx);
vm.runInContext(html.slice(html.indexOf('function numberOf('),html.indexOf('/* ---------- card lookup')),ctx);
vm.runInContext(html.slice(html.indexOf('const REFERENCE_CACHE'),html.indexOf('async function finishCard')),ctx);
(async()=>{
  const evidence={langSure:true,number:'0248/190',observedNumbers:['0248/190']};
  assert.equal(ctx.referenceNumberEvidence(evidence,{number:'248/190'}),true);
  assert.equal(ctx.referenceNumberEvidence({...evidence,ocrConflict:true},{number:'248/190'}),false);
  assert.equal(ctx.referenceNumberEvidence({...evidence,langSure:false},{number:'248/190'}),false);
  assert.equal(ctx.referenceNumberEvidence({...evidence,observedNumbers:['248/190','249/190']},{number:'248/190'}),false);
  assert.equal(ctx.referenceNumberEvidence(evidence,{number:'72/190'}),false);
  // First card, unreadable title, uncertain language: no dependency on recent cards.
  let item={data:{lang:'de',langSure:false,name:'',number:'',code:''}};
  await ctx.applyReferenceMatch(item,{});
  assert.equal(rankCalls[0].candidates.length,2);assert.equal(rankCalls[0].unknown,true);
  assert.equal(item.data.name,'Heracross');assert.equal(item.data.number,'009/083');
  assert.equal(item.data.code,'adv5');assert.equal(item.data.lang,'ja');assert.equal(item.data.langSure,true);
  // Incorrect OCR name still allows an independent image match.
  rankCalls=[];item={data:{lang:'ja',langSure:true,enName:'Wrong title',name:'Wrong title',number:'',code:''}};
  await ctx.applyReferenceMatch(item,{});
  assert.equal(rankCalls.length,2);assert.equal(rankCalls[1].unknown,true);assert.equal(item.data.name,'Heracross');
  // Unclear images must not fabricate metadata or confirm language.
  sure=false;item={data:{lang:'de',langSure:false,name:'',number:'',code:''}};
  await ctx.applyReferenceMatch(item,{});assert.equal(item.data.name,'');assert.equal(item.data.langSure,false);
  assert.equal(item.data.referenceState,'uncertain');
  // Japanese catalogue list endpoints omit images; obtain full card details.
  const requested=[];ctx.fetch=async url=>{requested.push(url);return {ok:true,json:async()=>url.includes('?name=')?
    [{id:'SV1-026',name:'ライチュウ',localId:'026'}]:{name:'ライチュウ',image:'https://assets.tcgdex.net/ja/SV/SV1/026',localId:'026',set:{id:'SV1'}}}};
  const cards=await ctx.japaneseReferenceCandidates('ライチュウ');
  assert.equal(cards.length,1);assert.equal(cards[0].name,'Raichu');assert.equal(cards[0].number,'026/078');
  assert.equal(cards[0].code,'sv1');assert.match(cards[0].image,/high.webp$/);
  assert.equal(requested.length,2);await ctx.japaneseReferenceCandidates('ライチュウ');assert.equal(requested.length,2);
  assert.equal(ctx.japaneseFor('Raichu V'),'ライチュウ');
  assert.equal(ctx.japaneseFor('Galarian Corsola'),'ガラルサニーゴ');
  assert.equal(ctx.japaneseFor('Alolan Raichu'),'アローラライチュウ');
  assert.equal(ctx.japaneseFor('Unknown'), '');
  console.log('Unreadable titles, wrong titles, language confirmation and Japanese catalogue checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
