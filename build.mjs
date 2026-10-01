import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await Promise.all(['index.html', 'links.json', 'image-match.js'].map(file => copyFile(file, `dist/${file}`)));
console.log('Scanner und Linkdaten bereit.');
