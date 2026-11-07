/** Explicit, reviewed source release to the companion website. Never runs on install. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');const target=path.resolve(process.argv.find(x=>x.startsWith('--target='))?.slice(9)||path.join(root,'../solokit-element'));const check=process.argv.includes('--check');
if(!fs.existsSync(path.join(target,'app/api/mcp/route.ts')))throw new Error('Target is not the Screen website');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)])}
const dirs=['agent','animation','chatbot','dashboard','docs','form','marketing','theme','scenarios','registry'];
const files=['registry.json','lib/theme-provider.tsx','scripts/build-agent-catalog.mjs',...dirs.flatMap(d=>walk(path.join(root,'lib',d)).map(p=>path.relative(root,p))),...walk(path.join(root,'styles')).map(p=>path.relative(root,p))];
let failures=0;const hashes={};for(const file of files){const bytes=fs.readFileSync(path.join(root,file)),dest=path.join(target,file);hashes[file]=crypto.createHash('sha256').update(bytes).digest('hex');if(check){if(!fs.existsSync(dest)||!bytes.equals(fs.readFileSync(dest))){console.error('Drift:',file);failures++}}else{fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes)}}
if(!check)fs.writeFileSync(path.join(target,'screen-source-manifest.json'),JSON.stringify({source:'solokit-screen local workspace',publishedRepository:'Alfred-Lau/solokit-element',hashes},null,2)+'\n');
console.log(`${check?'Checked':'Synced'} ${files.length} source files`);if(failures)process.exitCode=1;
