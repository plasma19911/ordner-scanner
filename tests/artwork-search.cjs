const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const saved=new Map(),ctx=vm.createContext({URL,AbortSignal,console,localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)}});
vm.runInContext(fs.readFileSync('name-index.js','utf8'),ctx);
ctx.NameIndex.configure([['Pikachu','ピカチュウ','皮卡丘','皮卡丘','Pikachu'],['Magby','ブビィ','鸭嘴宝宝','鴨嘴寶寶','Magby']]);
assert.equal(ctx.NameIndex.lookup('皮卡丘','zh'),'Pikachu');
assert.equal(ctx.NameIndex.browse("Captain's Pikachu"),'https://www.cardmarket.com/de/Pokemon/Species/Pikachu');
assert.equal(ctx.NameIndex.lookup('Unbekannt','de'),'');
assert.equal(ctx.NameIndex.remember('Hyperball','de','Ultra Ball'),true);
assert.equal(ctx.NameIndex.lookup('Hyperball','de'),'Ultra Ball');
assert.match(ctx.NameIndex.browse('Ultra Ball'),/Products\/Search\?searchString=Ultra%20Ball/);
vm.runInContext(fs.readFileSync('name-index.js','utf8'),ctx);assert.equal(ctx.NameIndex.lookup('Hyperball','de'),'Ultra Ball','confirmed aliases survive reload');
ctx.NameIndex.configure([['Pikachu','ピカチュウ','皮卡丘','皮卡丘','Pikachu']]);
vm.runInContext(fs.readFileSync('artwork-search.js','utf8'),ctx);
(async()=>{
 let url='';const rows=await ctx.ArtworkSearch.candidates("Captain's Pikachu",async u=>{url=u;return {ok:true,json:async()=>[
  {id:'base1-58',localId:'58',name:'Pikachu',image:'https://assets.tcgdex.net/en/base/base1/58'},
  {id:'A1-1',localId:'1',name:'Pikachu',image:'https://assets.tcgdex.net/en/tcgp/A1/1'},
  {id:'bad',name:'Pikachu',image:'https://example.com/photo'},
  {id:'base1-1',name:'Bulbasaur',image:'https://assets.tcgdex.net/en/base/base1/1'}]};});
 assert.match(url,/name=like:Pikachu$/);assert.equal(rows.length,1);assert.equal(rows[0].artworkOnly,true);assert.equal(rows[0].lang,'en');
 assert.equal(rows[0].number,undefined,'artwork does not manufacture a printed number');
 const html=fs.readFileSync('index.html','utf8'),start=html.indexOf('async function checkArtworks('),end=html.indexOf('async function refreshLookup(',start);
 let finish;ctx.ArtworkSearch.search=()=>new Promise(r=>finish=r);ctx.NameIndex.ready=Promise.resolve();ctx.render=()=>{};ctx.window={cv:{}};ctx.loadImg=()=>{};
 vm.runInContext(html.slice(start,end),ctx);
 const item={data:{enName:'Pikachu',lang:'zh',number:'0704/09',code:'CM1C'},el:{}};
 const job=ctx.checkArtworks(item,{});await new Promise(r=>setImmediate(r));item.data.artworkRevision++;
 finish({list:rows,total:1,compared:1});await job;assert.equal(item.data.artworkChoices,undefined,'stale artwork response discarded');
 assert.equal(item.data.lang,'zh');assert.equal(item.data.number,'0704/09');assert.equal(item.data.code,'CM1C');
 console.log('English aliases, species search, foreign artwork isolation and stale response checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
