/* Local worker: photo pixels never leave the browser. Only models are downloaded. */
(function(root){
  let worker,queue=Promise.resolve(),disabled=false;
  function fields(items,height,width=0){
    const valid=items.filter(i=>i.score>=0.75&&i.poly?.length===4);
    return {
      width,lines:valid,body:valid.filter(i=>Math.min(...i.poly.map(p=>p[1]))>=height*.35&&Math.max(...i.poly.map(p=>p[1]))<=height*.83),
      titles:valid.filter(i=>Math.max(...i.poly.map(p=>p[1]))<=height*0.19).sort((a,b)=>b.score-a.score),
      footer:valid.filter(i=>Math.min(...i.poly.map(p=>p[1]))>=height*0.83)
    };
  }
  function read(canvas){
    const job=queue.then(async()=>{
      if(disabled)return null;
      let timer;
      try{
        if(!worker){
          const {PaddleOCR}=await import('./vendor/paddle.js');
          worker=await PaddleOCR.create({worker:true,textDetectionModelName:'PP-OCRv5_mobile_det',textRecognitionModelName:'PP-OCRv5_mobile_rec',ortOptions:{backend:'wasm',numThreads:1,wasmPaths:new URL('vendor/ort/',document.baseURI).href}});
        }
        const [result]=await Promise.race([worker.predict(canvas),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('OCR timeout')),180000);})]);
        return fields(result.items,canvas.height,canvas.width);
      }catch(error){disabled=true;console.warn('Zusätzliche OCR nicht verfügbar:',error.message);return null;}
      finally{clearTimeout(timer);}
    });
    queue=job.catch(()=>null);return job;
  }
  root.PaddleReader={read,fields};
})(typeof globalThis==='object'?globalThis:this);
