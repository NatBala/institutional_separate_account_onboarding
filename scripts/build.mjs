import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const hosting=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));
if(hosting.static){
  fs.rmSync('dist',{recursive:true,force:true});
  fs.cpSync('prepared-release','dist',{recursive:true});
  console.log('Built prepared demo with updated risk workflow.');
  process.exit(0);
}
const scope={window:{}};
vm.runInNewContext(fs.readFileSync('public/corpus-data.js','utf8'),scope);
const corpus=scope.window.CORPUS;
fs.rmSync('dist',{recursive:true,force:true});
fs.mkdirSync('dist/server',{recursive:true});
fs.mkdirSync('dist/.openai',{recursive:true});
fs.cpSync('public','dist/client',{recursive:true});
const core=fs.readFileSync('server/core.mjs','utf8').replace(/^export /gm,'');
const worker=fs.readFileSync('server/worker.mjs','utf8').replace(/^import .*from '\.\/core\.mjs';\n/m,'');
const hash=crypto.createHash('sha256').update(JSON.stringify(corpus)).digest('hex');
fs.writeFileSync('dist/server/index.js',`const CORPUS=${JSON.stringify(corpus)};\nconst CORPUS_HASH=${JSON.stringify(hash)};\n${core}\n${worker}`);
fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log(`Built Worker, existing app assets, and ${corpus.document_count} synthetic documents.`);
