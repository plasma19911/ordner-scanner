/* Evidence helps rank candidates; copyright years and tiny symbols never prove a print. */
(function(root){
 function years(text,now=new Date().getFullYear()){
  const found=[];
  for(const line of String(text||'').normalize('NFKC').split(/\n/)){
   if(!/[©Ⓒ]|copyright|nintendo|creatures|game\s*freak|pokemon|pokémon|wizards/i.test(line))continue;
   for(const m of line.matchAll(/(?<!\d)(?:19|20)\d{2}(?!\d)/g)){const y=Number(m[0]);if(y>=1995&&y<=now+1)found.push(y);}
  }
  return [...new Set(found)].sort((a,b)=>a-b);
 }
 function numberKey(s){return String(s||'').normalize('NFKC').replace(/\s/g,'').toUpperCase().replace(/(^|\/)([A-Z]*)0+(?=\d)/g,'$1$2');}
 function consensus(votes,plausible){
  const scores=new Map();for(const n of votes){if(!plausible(n))continue;const k=numberKey(n),r=scores.get(k)||{number:n,count:0};r.count++;scores.set(k,r);}
  const rows=[...scores.values()].sort((a,b)=>b.count-a.count);
  return {number:rows[0]?.number||'',sure:!!(rows[0]?.count>=2&&(!rows[1]||rows[0].count>=rows[1].count+2)),conflict:!!(rows[1]&&rows[1].count>=rows[0].count-1)};
 }
 function orientation(result,titleMatcher){
  if(!result)return 0;
  const names=(result.titles||[]).filter(x=>x.score>=.85&&titleMatcher(x.text));
  const foot=(result.footer||[]).filter(x=>x.score>=.85&&(/\d\s*\/\s*\d|(?:SWSH|SVP)\s*\d|C(?:BB|SM|SV|S|M)\d/i.test(x.text)||years(x.text).length));
  return (names.length?8:0)+Math.min(3,foot.length);
 }
 const details=new Map(),previews=new Map();let hints;
 function maskCanvas(mask){
  const c=document.createElement('canvas');c.width=mask.width;c.height=mask.height;
  const g=c.getContext('2d'),im=g.createImageData(c.width,c.height),bytes=atob(mask.bits),stride=Math.ceil(c.width/8);
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
   const ink=bytes.charCodeAt(y*stride+(x>>3))&(128>>(x%8)),i=(y*c.width+x)*4;
   im.data[i]=im.data[i+1]=im.data[i+2]=ink?0:255;im.data[i+3]=255;
  }
  g.putImageData(im,0,0);return c;
 }
 async function enrich(options,lang,fetcher=fetch){
  if(!options.length)return options;
  if(!hints)hints=fetcher('set-hints.json',{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>d.sets||[]).catch(()=>{hints=null;return [];});
  const saved=await hints,normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const api=lang==='zh'?'zh-cn':lang;
  return Promise.all(options.map(async o=>{
   const names=[o.enSet,o.set,o.setName].filter(Boolean).map(normalize);
   const matches=['en','de'].includes(lang)?saved.filter(s=>names.includes(normalize(s.name))):[];
   const local=matches.length===1?matches[0]:null;
   if(local){
    if(local.symbolMask&&typeof document!=='undefined'&&!previews.has(local.id))previews.set(local.id,maskCanvas(local.symbolMask).toDataURL());
    return {...o,releaseDate:local.releaseDate,symbolMask:local.symbolMask,symbolPreview:previews.get(local.id)||'',setMetadataSource:local.source};
   }
   if(!o.setId||options.length>16)return o;const key=api+':'+o.setId;
   if(!details.has(key))details.set(key,fetcher(`https://api.tcgdex.net/v2/${api}/sets/${encodeURIComponent(o.setId)}`,{signal:AbortSignal.timeout(8000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(()=>{details.delete(key);return null;}));
   const d=await details.get(key);return {...o,releaseDate:d?.releaseDate||o.releaseDate||'',symbol:d?.symbol||o.symbol||''};
  }));
 }
 function rank(options,evidence){
  const y=Math.max(...(evidence.copyrightYears||[]),0);
  return options.map(o=>{const release=Number(String(o.releaseDate||'').slice(0,4));
   const yearHint=y&&release?(release===y?2:Math.abs(release-y)===1?1:0):0;
   return {...o,yearHint,evidenceScore:yearHint+(o.setId===evidence.symbolHint?3:0)};
  }).sort((a,b)=>b.evidenceScore-a.evidenceScore);
 }
 // Compare small black/white symbols only as an advisory hint, never as identity proof.
 async function matchSymbols(photo,options,loadImage,cv){
  if(!cv?.matchTemplate||options.length<2||options.length>12)return '';
  const canvas=document.createElement('canvas');canvas.width=600;canvas.height=Math.round(600*photo.height/photo.width);canvas.getContext('2d').drawImage(photo,0,0,canvas.width,canvas.height);
  const src=cv.imread(canvas),gray=new cv.Mat(),binary=new cv.Mat(),scores=[];
  try{
   cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY);cv.adaptiveThreshold(gray,binary,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C,cv.THRESH_BINARY_INV,21,8);
   for(const o of options){
    if(!o.symbolMask)continue;const im=maskCanvas(o.symbolMask);
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0);
    const rgba=cv.imread(c),sg=new cv.Mat(),sb=new cv.Mat();let score=0;
    try{
     cv.cvtColor(rgba,sg,cv.COLOR_RGBA2GRAY);cv.threshold(sg,sb,150,255,cv.THRESH_BINARY_INV);
     const ink=cv.countNonZero(sb)/(sb.rows*sb.cols);if(ink<.04||ink>.9)continue;
     for(const width of [15,20,25,30,38,46]){
      const t=new cv.Mat(),result=new cv.Mat();
      try{
       cv.resize(sb,t,new cv.Size(width,Math.max(5,Math.round(width*sb.rows/sb.cols))),0,0,cv.INTER_AREA);
       for(const [x,y,w,h] of [[0,.83,1,.17],[.72,.42,.28,.24]]){
        const r=new cv.Rect(Math.floor(x*binary.cols),Math.floor(y*binary.rows),Math.floor(w*binary.cols),Math.floor(h*binary.rows));
        if(t.cols>=r.width||t.rows>=r.height)continue;const roi=binary.roi(r);
        try{cv.matchTemplate(roi,t,result,cv.TM_CCOEFF_NORMED);score=Math.max(score,cv.minMaxLoc(result).maxVal);}finally{roi.delete();}
       }
      }finally{t.delete();result.delete();}
     }
     scores.push({id:o.setId,score});
    }finally{rgba.delete();sg.delete();sb.delete();}
   }
  }finally{src.delete();gray.delete();binary.delete();}
  scores.sort((a,b)=>b.score-a.score);return scores[0]?.score>=.82&&(!scores[1]||scores[0].score-scores[1].score>=.10)?scores[0].id:'';
 }
 root.CardEvidence={years,numberKey,consensus,orientation,enrich,rank,matchSymbols};
})(globalThis);
