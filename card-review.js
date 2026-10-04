/* Photo-local crop review. No image leaves the browser. */
(function(root){
  'use strict';
  function rectangle(a,b,width,height){
    const x0=Math.max(0,Math.min(width,Math.min(a.x,b.x))),x1=Math.max(0,Math.min(width,Math.max(a.x,b.x)));
    const y0=Math.max(0,Math.min(height,Math.min(a.y,b.y))),y1=Math.max(0,Math.min(height,Math.max(a.y,b.y)));
    return {cx:(x0+x1)/2,cy:(y0+y1)/2,w:x1-x0,h:y1-y0,angle:0};
  }
  function contains(r,p){
    const t=-r.angle*Math.PI/180,dx=p.x-r.cx,dy=p.y-r.cy;
    return Math.abs(dx*Math.cos(t)-dy*Math.sin(t))<=r.w/2 && Math.abs(dx*Math.sin(t)+dy*Math.cos(t))<=r.h/2;
  }
  function split(r,cols,rows){
    cols=Math.max(1,Math.min(6,Math.floor(Number(cols)||1)));
    rows=Math.max(1,Math.min(6,Math.floor(Number(rows)||1)));
    const out=[],t=r.angle*Math.PI/180;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const dx=((x+.5)/cols-.5)*r.w,dy=((y+.5)/rows-.5)*r.h;
      out.push({cx:r.cx+dx*Math.cos(t)-dy*Math.sin(t),cy:r.cy+dx*Math.sin(t)+dy*Math.cos(t),w:r.w/cols,h:r.h/rows,angle:r.angle});
    }
    return out;
  }
  function review(photo,detected,{photo:photoNo,extract}){
    return new Promise(resolve=>{
      const dialog=document.createElement('dialog');dialog.className='crop-review';
      dialog.innerHTML=`<h2>Foto ${Number(photoNo)}: Karten trennen</h2>
        <p>Prüfe die Vorschau: <b>genau eine vollständige Karte pro Bild</b>. Fehlende Karten mit Maus oder Finger umrahmen. Einen Rahmen antippen, um ihn zu entfernen oder aufzuteilen. Angeschnittene Karten besser neu fotografieren.</p>
        <canvas class="review-photo" aria-label="Foto mit Kartenrahmen. Ziehen fügt einen Rahmen hinzu."></canvas>
        <div class="review-tools"><button type="button" data-remove>Ausgewählten Rahmen entfernen</button><button type="button" data-clear>Alle Rahmen entfernen</button><button type="button" data-whole>Ganzes Foto als Rahmen</button>
        <label>Spalten <input data-cols type="number" min="1" max="6" value="2"></label><label>Zeilen <input data-rows type="number" min="1" max="6" value="2"></label><button type="button" data-split>Ausgewählten Rahmen aufteilen</button></div>
        <p role="status" data-count></p><div class="review-crops"></div>
        <div class="review-actions"><button class="btn" type="button" data-accept>Karten erkennen</button><button class="btn ghost" type="button" data-skip>Foto überspringen</button></div>`;
      document.body.append(dialog);
      const c=dialog.querySelector('canvas'),g=c.getContext('2d');c.width=photo.width;c.height=photo.height;
      let rects=detected.map(r=>({...r})),selected=-1,start=null,end=null;
      const thumbs=new WeakMap();
      const q=s=>dialog.querySelector(s);
      const position=e=>{const b=c.getBoundingClientRect();return {x:(e.clientX-b.left)*c.width/b.width,y:(e.clientY-b.top)*c.height/b.height};};
      function draw(){
        g.drawImage(photo,0,0);g.lineWidth=Math.max(2,c.width/350);g.font=`bold ${Math.max(18,c.width/45)}px sans-serif`;
        rects.forEach((r,i)=>{g.save();g.translate(r.cx,r.cy);g.rotate(r.angle*Math.PI/180);g.strokeStyle=i===selected?'#f6c945':'#00e5ff';g.strokeRect(-r.w/2,-r.h/2,r.w,r.h);g.restore();g.fillStyle='#111';g.fillRect(r.cx-18,r.cy-20,38,32);g.fillStyle='#fff';g.fillText(String(i+1),r.cx-12,r.cy+5);});
        if(start&&end){const r=rectangle(start,end,c.width,c.height);g.strokeStyle='#f6c945';g.strokeRect(r.cx-r.w/2,r.cy-r.h/2,r.w,r.h);}
      }
      function update(){
        draw();q('[data-count]').textContent=`${rects.length} Ausschnitte. Gelbe Auswahl: ${selected>=0?selected+1:'keine'}. Automatisch ergänzte Rahmen bitte besonders prüfen.`;
        q('[data-remove]').disabled=q('[data-split]').disabled=selected<0;
        q('[data-accept]').disabled=!rects.length;
        const list=q('.review-crops');list.replaceChildren();
        rects.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.className=i===selected?'selected':'';
          if(!thumbs.has(r)){
            const crop=extract(r),thumb=document.createElement('canvas'),scale=Math.min(1,240/Math.max(crop.width,crop.height));
            thumb.width=Math.max(1,Math.round(crop.width*scale));thumb.height=Math.max(1,Math.round(crop.height*scale));
            thumb.getContext('2d').drawImage(crop,0,0,thumb.width,thumb.height);thumbs.set(r,thumb.toDataURL('image/jpeg',.7));
          }
          const img=document.createElement('img');img.src=thumbs.get(r);img.alt=`Ausschnitt ${i+1}`;
          const text=document.createElement('span');text.textContent=`${i+1}${r.inferred?' · ergänzt':''}`;b.append(img,text);b.onclick=()=>{selected=i;update();};list.append(b);
        });
      }
      c.onpointerdown=e=>{start=position(e);end=start;c.setPointerCapture(e.pointerId);};
      c.onpointermove=e=>{if(start){end=position(e);draw();}};
      c.onpointerup=e=>{if(!start)return;end=position(e);const r=rectangle(start,end,c.width,c.height);
        if(r.w>c.width*.025&&r.h>c.height*.025){rects.push(r);selected=rects.length-1;}
        else selected=rects.findIndex(r=>contains(r,end));
        start=end=null;update();
      };
      c.onpointercancel=()=>{start=end=null;draw();};
      q('[data-remove]').onclick=()=>{if(selected>=0)rects.splice(selected,1);selected=-1;update();};
      q('[data-clear]').onclick=()=>{rects=[];selected=-1;update();};
      q('[data-whole]').onclick=()=>{rects.push(rectangle({x:0,y:0},{x:c.width,y:c.height},c.width,c.height));selected=rects.length-1;update();};
      q('[data-split]').onclick=()=>{if(selected<0)return;rects.splice(selected,1,...split(rects[selected],q('[data-cols]').value,q('[data-rows]').value));selected=-1;update();};
      const close=value=>{dialog.close();dialog.remove();resolve(value);};
      q('[data-accept]').onclick=()=>close(rects);
      q('[data-skip]').onclick=()=>close(null);
      dialog.addEventListener('cancel',e=>{e.preventDefault();close(null);});
      update();dialog.showModal();
    });
  }
  function canAuto(rects,photo){
    if(!rects.length||!photo.width||!photo.height)return false;
    return rects.every((r,i)=>{
      if(r.inferred||![r.cx,r.cy,r.w,r.h,r.angle].every(Number.isFinite))return false;
      const ratio=Math.max(r.w,r.h)/Math.min(r.w,r.h);
      if(ratio<1.28||ratio>1.53||Math.min(r.w,r.h)<60)return false;
      const t=r.angle*Math.PI/180,dx=(Math.abs(Math.cos(t))*r.w+Math.abs(Math.sin(t))*r.h)/2,dy=(Math.abs(Math.sin(t))*r.w+Math.abs(Math.cos(t))*r.h)/2;
      if(r.cx-dx<0||r.cy-dy<0||r.cx+dx>photo.width||r.cy+dy>photo.height)return false;
      return rects.every((o,j)=>i===j||(!contains(o,{x:r.cx,y:r.cy})&&!contains(r,{x:o.cx,y:o.cy})));
    });
  }
  root.CardReview={rectangle,contains,split,review,canAuto};
})(typeof globalThis==='object'?globalThis:window);
