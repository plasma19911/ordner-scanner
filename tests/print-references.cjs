const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync('curated-print-references.json'));
assert.equal(data.cards.length,4);
for(const c of data.cards){assert.equal(c.features.region,'full');assert.equal(c.features.version,1);assert.equal(Buffer.from(c.features.descriptors,'base64').length,c.features.points.length*32);assert.ok(c.features.points.length>=24);assert.ok(c.features.points.length<=2200);assert.equal(c.identityVerified,true);assert.ok(c.number||c.vintageSet);assert.ok(c.source.startsWith('https://'));}
const html=fs.readFileSync('index.html','utf8'),ctx=vm.createContext({URL});
vm.runInContext(fs.readFileSync('card-evidence.js','utf8'),ctx);
vm.runInContext(html.slice(html.indexOf('function referenceCompatible('),html.indexOf('function referenceNumberEvidence(')),ctx);
const d={lang:'en',langSure:true,footerRetry:{numbers:['SV048/SV722','SV043/SV722']}};
assert.equal(ctx.referenceCompatible(d,{lang:'en',number:'082/202'}),false);
assert.equal(ctx.referenceCompatible(d,{lang:'en',number:'SV048/SV122'}),true);
assert.equal(ctx.referenceCompatible({...d,footerRetry:{numbers:['SV048/SV122','082/202']}},{lang:'en',number:'082/202'}),true);
assert.equal(ctx.referenceCompatible({...d,numSure:true,number:'SV043/SV122'},{lang:'en',number:'SV048/SV122'}),false);
console.log('Curated full-card features and gallery-prefix candidate gates validated');
