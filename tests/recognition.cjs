const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const js = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
new vm.Script(js);
function section(start, end) { return js.slice(js.indexOf(start), js.indexOf(end, js.indexOf(start))); }
const ctx = vm.createContext({console});
vm.runInContext(section('const NUM_RE =', 'async function ocr(') + section('function guessLang(', '/* ---------- Japanese') + section('const NAMES =', 'async function candidatesByName('), ctx);
const run = expression => vm.runInContext(expression, ctx);
assert.equal(run('guessLang("Schwäche Resistenz Rückzugskosten").lang'), 'de');
assert.equal(run('guessLang("Weakness Resistance Retreat").lang'), 'en');
assert.equal(run('guessLang("Glurak").sure'), false);
assert.equal(run('guessLang("Glurak").lang'), 'de');
assert.equal(run('guessLang("フシギダネ").lang'), 'ja');
assert.equal(run('findNumber("No. 001")'), null);
assert.equal(run('findNumber("O19/1O8")'), '019/108');
assert.equal(run('findNumber("GG01/GG70")'), 'GG01/GG70');
assert.equal(run('matchLatinName("EnteiV 230 KP", "de").printed'), 'Entei V');
assert.equal(run('matchLatinName("Entei GX", "de").printed'), 'Entei GX');
assert.equal(run('matchLatinName("Bisaknosp", "de").printed'), 'Bisaknosp');
assert.equal(run('matchAsianName("エリカのフシギダネ").local'), 'エリカのフシギダネ');
assert.equal(run('matchAsianName("ヘラクロス").en'), 'Heracross');
assert.equal(run('matchAsianName("エンテイ").en'), 'Entei');
console.log('Recognition regression checks passed');
vm.runInContext(section('async function refreshLookup(', '/* ---------- first Cardmarket'), ctx);
Object.assign(ctx, {
  lookup: async () => [
    {name:'Entei V',enName:'Entei V',set:'Set A',enSet:'Set A',setId:'a'},
    {name:'Pikachu',enName:'Pikachu',set:'Set B',enSet:'Set B',setId:'b'}
  ],
  loadImg:async()=>null,render:()=>{},renderExport:()=>{},findCardmarket:()=>{}
});
(async()=>{
 const item={data:{lang:'de',number:'001/100',observedName:'Entei V'},thumb:''};
 await ctx.refreshLookup(item);
 assert.equal(item.data.setId,'a');
 item.data.observedName=''; await ctx.refreshLookup(item);
 assert.equal(item.data.setSure,false); assert.equal(item.data.setId,'');
 item.data.observedName='Bisaknosp'; await ctx.refreshLookup(item);
 assert.equal(item.data.setSure,false);
 item.data.observedName='';item.data.preferredSetId='b';await ctx.refreshLookup(item);
 assert.equal(item.data.setId,'b');
 console.log('Ambiguous-set and name-conflict checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
