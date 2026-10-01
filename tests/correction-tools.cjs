const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const h=fs.readFileSync('index.html','utf8'),ctx=vm.createContext({console,Map});
vm.runInContext(h.slice(h.indexOf('const NUM_RE'),h.indexOf('async function ocr(')),ctx);
vm.runInContext(h.slice(h.indexOf('function cropBounds'),h.indexOf('async function recheckNumber')),ctx);
const b=ctx.cropBounds(1000,1400,{left:10,right:90,top:20,bottom:80});
assert.equal(b.x,100);assert.equal(b.y,280);assert.equal(b.w,800);assert.equal(b.h,840);
const invalid=ctx.cropBounds(1000,1400,{left:99,right:20,top:-10,bottom:101});
assert.ok(invalid.w>0 && invalid.h>0);assert.ok(invalid.x+invalid.w<=1000);
assert.equal(ctx.numberConsensus(['008/144','8/144','018/144']),'008/144');
assert.equal(ctx.numberConsensus(['008/144','018/144']),'');
assert.equal(ctx.numberConsensus(['No. 244','No. 244']),'');
assert.equal(ctx.numberConsensus(['００９／０８３','009/083']),'009/083');
assert.equal(ctx.numberConsensus(['GG36/GG70','GG36/GG70']),'GG36/GG70');
console.log('Crop bounds and footer consensus checks passed');

assert.equal(ctx.cropBounds(1000,1400,{left:0,right:0,top:0,bottom:0}).w,10);
