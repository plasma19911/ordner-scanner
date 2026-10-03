import {build} from 'esbuild';
import {mkdir,copyFile,readdir,writeFile} from 'node:fs/promises';
await mkdir('vendor/ort',{recursive:true});
await build({stdin:{contents:"export {PaddleOCR} from '@paddleocr/paddleocr-js';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',external:['fs','path'],outfile:'vendor/paddle.js',minify:true,legalComments:'eof'});
for(const file of await readdir('node_modules/onnxruntime-web/dist')){
  if(/^ort-wasm-simd-threaded(?:\.jsep)?\.(wasm|mjs)$/.test(file))await copyFile('node_modules/onnxruntime-web/dist/'+file,'vendor/ort/'+file);
}
await writeFile('vendor/README.md','Generated from pinned npm dependencies by scripts/build-ocr.mjs. PaddleOCR: Apache-2.0; ONNX Runtime: MIT. Photos are processed locally in a dedicated browser worker.\n');

await mkdir('vendor/assets',{recursive:true});
for(const file of await readdir('node_modules/@paddleocr/paddleocr-js/dist/assets')){
  if(file.endsWith('.js'))await copyFile('node_modules/@paddleocr/paddleocr-js/dist/assets/'+file,'vendor/assets/'+file);
}
