const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const code = html.slice(html.indexOf('async function findCardmarket('), html.indexOf('function cmLink('));
let searches = 0;
const ctx = vm.createContext({
  render() {}, renderExport() {}, memGet: () => '', memSet() {},
  pricesLink: d => d.setId === 'base1' ? 'https://prices.pokemontcg.io/cardmarket/base1-30' : '',
  cseId: () => 'configured',
  cseSearch: async () => { searches++; return []; },
  searchQuery: d => [d.name, d.number, d.code].join('|'),
  cardKey: d => [d.number, d.code].join('|'),
  slugOf: () => '', extractCardmarket: u => u && u.startsWith('https://www.cardmarket.com/') ? u : '', decodeURIComponent
});
vm.runInContext(code, ctx);
(async () => {
  for (const data of [
    {lang:'de',langSure:false,setSure:true,setId:'base1'},
    {lang:'de',langSure:true,setSure:false},
    {lang:'ja',langSure:true,code:'s8b',codeSure:false,number:'018/184'}
  ]) {
    const item = {data:{cmFound:'stale',cmPrices:'stale',...data}};
    await ctx.findCardmarket(item);
    assert.equal(item.data.cmFound,''); assert.equal(item.data.cmPrices,'');
    assert.equal(item.data.cmState,'ambiguous');
  }
  assert.equal(searches,0);
  const base = {data:{lang:'de',langSure:true,setSure:true,setId:'base1',number:'30/102'}};
  await ctx.findCardmarket(base);
  assert.equal(base.data.cmState,'prices');
  assert.equal(base.data.cmPrices,'https://prices.pokemontcg.io/cardmarket/base1-30');
  let complete;
  ctx.cseSearch = () => new Promise(resolve => { complete=resolve; });
  const item = {data:{lang:'ja',langSure:true,codeSure:true,code:'s8b',number:'018/184',name:'Flareon'}};
  const pending = ctx.findCardmarket(item);
  item.data.number = '019/184';
  complete([{url:'https://www.cardmarket.com/en/Pokemon/Products/Singles/VMAX-Climax/Flareon'}]);
  await pending;
  assert.equal(item.data.cmFound,'');
  console.log('Cardmarket certainty and stale-search checks passed');
})().catch(e => {console.error(e);process.exitCode=1;});
