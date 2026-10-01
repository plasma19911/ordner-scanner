import {mkdir,copyFile,cp,access} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await Promise.all(['index.html','links.json','image-match.js','card-review.js'].map(file=>copyFile(file,'dist/'+file)));
try{
 await access('reference-cache.json');
 await copyFile('reference-cache.json','dist/reference-cache.json');
 await cp('reference-images','dist/reference-images',{recursive:true});
}catch(e){if(e.code!=='ENOENT')throw e;}
console.log('Scanner und Linkdaten bereit.');
