const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><body></body>',{runScripts:'outside-only'}),w=dom.window;
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
w.HTMLDialogElement.prototype.close=function(){this.open=false};
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({}, {get:()=>()=>{}});
w.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/jpeg;base64,';
w.HTMLCanvasElement.prototype.setPointerCapture=()=>{};
w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:400,height:600});
w.eval(fs.readFileSync('card-review.js','utf8'));
const api=w.CardReview,rect={cx:200,cy:300,w:400,h:600,angle:0};
assert.equal(api.split(rect,2,3).length,6);
assert.equal(api.split(rect,0,99).length,6);
assert.equal(api.rectangle({x:-10,y:-10},{x:500,y:700},400,600).w,400);
assert.equal(api.contains({...rect,w:100,h:300,angle:90},{x:320,y:300}),true);
const photo={width:400,height:600},extract=()=>({width:200,height:280});
const q=s=>w.document.querySelector(s);
(async()=>{
  let p=api.review(photo,[rect],{photo:1,extract});
  assert.equal(q('.review-crops').children.length,1);
  q('.review-crops button').click();q('[data-cols]').value='2';q('[data-rows]').value='2';q('[data-split]').click();
  assert.equal(q('.review-crops').children.length,4);
  q('.review-crops button').click();q('[data-remove]').click();
  assert.equal(q('.review-crops').children.length,3);
  q('[data-accept]').click();assert.equal((await p).length,3);assert.equal(q('dialog'),null);
  p=api.review(photo,[],{photo:2,extract});assert.equal(q('[data-accept]').disabled,true);
  const c=q('.review-photo');c.onpointerdown({clientX:20,clientY:20,pointerId:1});c.onpointerup({clientX:180,clientY:280});
  assert.equal(q('.review-crops').children.length,1);assert.equal(q('[data-accept]').disabled,false);
  q('[data-clear]').click();assert.equal(q('[data-accept]').disabled,true);
  q('[data-whole]').click();assert.equal(q('.review-crops').children.length,1);
  q('[data-skip]').click();assert.equal(await p,null);
  p=api.review(photo,[rect],{photo:3,extract});q('dialog').dispatchEvent(new w.Event('cancel',{cancelable:true}));assert.equal(await p,null);
  const h=fs.readFileSync('index.html','utf8');
  const ctx=vm.createContext({console});vm.runInContext(h.slice(h.indexOf('function gemPackIdentity'),h.indexOf('async function findCardmarket')),ctx);
  assert.equal(ctx.searchQuery({lang:'zh',code:'CM1C',number:'0304/09',enName:'Fuecoco'}),'03 Gem Pack Vol 1 || Fuecoco Gem Pack Vol 1');
  assert.equal(ctx.searchQuery({lang:'zh',code:'CM3C',number:'0202/07',enName:'Meowth'}),'02 Gem Pack Vol 3 || Meowth Gem Pack Vol 3');
  assert.equal(ctx.gemPackIdentity({lang:'zh',code:'CM3C',number:'0208/07'}),null);
  assert.equal(ctx.gemPackIdentity({lang:'ja',code:'CM3C',number:'0202/07'}),null);
  assert.equal(ctx.gemPackIdentity({lang:'zh',code:'CM9C',number:'0202/07'}),null);
  console.log('Crop review interactions, missing-detector recovery and Gem Pack search checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
// Exercise the real photo pipeline without OCR/network: accepted rectangles
// alone reach readCard, including when OpenCV is unavailable. Skip reads nothing.
(async()=>{
  const html=fs.readFileSync('index.html','utf8'),calls=[];
  const ctx=vm.createContext({document:w.document,resultsEl:w.document.body,photoNo:0,photoDegVotes:{},allCards:[],console,
    decode:async()=>({width:400,height:600}),scaledCanvas:()=>({c:{toDataURL:()=> 'original'},s:1}),
    detectRects:()=>[rect],extractCard:(_img,r)=>r,CardReview:{review:async()=>[rect]},
    setStatus(){},setProgress(){},renderExport(){},readOneCard:()=>assert.fail('whole-photo fallback must never run'),
    readCard:async(c,_list,pos)=>calls.push({c,pos}),progressState:{photo:0,total:1}});
  vm.runInContext(html.slice(html.indexOf('async function processPhoto'),html.indexOf('// Upright cards')),ctx);
  await ctx.processPhoto({},null);assert.equal(calls.length,1);
  ctx.CardReview.review=async()=>null;await ctx.processPhoto({},{});assert.equal(calls.length,1);
  ctx.CardReview.review=async()=>[rect,rect];await ctx.processPhoto({},{});assert.equal(calls.length,3);
  console.log('Photo pipeline: confirmed single crops only, skip and unavailable OpenCV checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
