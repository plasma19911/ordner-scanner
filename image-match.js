/* Local image matching. Photos stay in this browser; only reference images are downloaded. */
(function (global) {
  function features(image, cv) {
    const w = image.width || image.naturalWidth, h = image.height || image.naturalHeight;
    const scale = Math.min(1, 1000 / Math.max(w,h));
    const c = document.createElement('canvas'); c.width=Math.round(w*scale); c.height=Math.round(h*scale);
    c.getContext('2d').drawImage(image,0,0,c.width,c.height);
    const src=cv.imread(c), gray=new cv.Mat(), mask=new cv.Mat(), points=new cv.KeyPointVector(), desc=new cv.Mat();
    const orb=new cv.ORB(), clahe=new cv.CLAHE(2,new cv.Size(8,8));
    try {
      cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY); clahe.apply(gray,gray);
      orb.setMaxFeatures(2200); orb.setEdgeThreshold(15); orb.setFastThreshold(10);
      orb.detectAndCompute(gray,mask,points,desc);
      return {points,desc,width:c.width,height:c.height,delete(){points.delete();desc.delete();}};
    } catch(e) {points.delete();desc.delete();throw e;}
    finally {src.delete();gray.delete();mask.delete();orb.delete();clahe.delete();}
  }
  function compare(ref, photo, cv) {
    if (ref.desc.rows<8 || photo.desc.rows<8) return null;
    const matcher=new cv.BFMatcher(cv.NORM_HAMMING,false), matches=new cv.DMatchVectorVector();
    const src=[],dst=[]; let from,to,mask,H;
    try {
      matcher.knnMatch(ref.desc,photo.desc,matches,2);
      for (let i=0;i<matches.size();i++) {
        const pair=matches.get(i);
        try {if(pair.size()<2)continue;const a=pair.get(0),b=pair.get(1);
          if(a.distance>=0.75*b.distance)continue;
          const p=ref.points.get(a.queryIdx).pt,q=photo.points.get(a.trainIdx).pt;
          src.push(p.x,p.y);dst.push(q.x,q.y);
        } finally {pair.delete();}
      }
      if(src.length<16)return null;
      from=cv.matFromArray(src.length/2,1,cv.CV_32FC2,src); to=cv.matFromArray(dst.length/2,1,cv.CV_32FC2,dst);mask=new cv.Mat();
      H=cv.findHomography(from,to,cv.RANSAC,4,mask,2000,0.995);
      if(H.empty())return null;
      const a=H.data64F, project=(x,y)=>{const z=a[6]*x+a[7]*y+a[8];return {x:(a[0]*x+a[1]*y+a[2])/z,y:(a[3]*x+a[4]*y+a[5])/z};};
      const quad=[[0,0],[ref.width,0],[ref.width,ref.height],[0,ref.height]].map(p=>project(...p));
      if(quad.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<-photo.width*.25||p.x>photo.width*1.25||p.y<-photo.height*.25||p.y>photo.height*1.25))return null;
      let area=0, sign=0;
      for(let i=0;i<4;i++){
        const p=quad[i],q=quad[(i+1)%4],r=quad[(i+2)%4];area+=p.x*q.y-q.x*p.y;
        const cross=(q.x-p.x)*(r.y-q.y)-(q.y-p.y)*(r.x-q.x);
        if(!cross || (sign && Math.sign(cross)!==sign))return null;sign=Math.sign(cross);
      }
      const fraction=Math.abs(area)/2/(photo.width*photo.height);
      if(fraction<.12||fraction>1.6)return null;
      const xs=[],ys=[];
      for(let i=0;i<mask.data.length;i++)if(mask.data[i]){xs.push(src[i*2]);ys.push(src[i*2+1]);}
      if(xs.length<8)return null;
      // Convex-hull area rejects matches confined to a shared badge or copyright line.
      const pts=cv.matFromArray(xs.length,1,cv.CV_32FC2,xs.flatMap((x,i)=>[x,ys[i]])),hull=new cv.Mat();
      let coverage;try{cv.convexHull(pts,hull);coverage=cv.contourArea(hull)/(ref.width*ref.height);}finally{pts.delete();hull.delete();}
      const inliers=xs.length, ratio=inliers/(src.length/2), score=inliers*Math.min(1,coverage/.22);
      return {inliers,ratio,coverage,score};
    } finally {matcher.delete();matches.delete();[from,to,mask,H].forEach(m=>m?.delete());}
  }
  function certain(list, unknownTitle=false) {
    const a=list[0],b=list[1];if(!a?.match)return false;
    const m=a.match;
    return m.inliers>=(unknownTitle?40:24) && m.ratio>=(unknownTitle ? .65 : .5) && m.coverage>=.06 &&
      (!b?.match || m.score-b.match.score>=8 && m.score>=b.match.score*1.25);
  }
  async function rank(photo,candidates,loadImage,cv,unknownTitle=false) {
    if(!cv?.ORB || !cv.findHomography)return {sure:false,list:candidates};
    const mine=features(photo,cv), scored=[];
    try {
      // Bound concurrent image downloads. Descriptor matrices are released after every comparison.
      let next=0;
      const task=async()=>{while(next<candidates.length){const c=candidates[next++];let f;
        try {const im=await loadImage(c);if(!im){scored.push({...c,match:null});continue;}
          f=features(im,cv);scored.push({...c,match:compare(f,mine,cv)});
        } catch {scored.push({...c,match:null});} finally {f?.delete();}
      }};
      await Promise.all(Array.from({length:Math.min(4,candidates.length)},task));
      scored.sort((a,b)=>(b.match?.score||0)-(a.match?.score||0));
      return {sure:certain(scored,unknownTitle),list:scored};
    } finally {mine.delete();}
  }
  global.CardMatcher={rank,certain};
})(globalThis);
