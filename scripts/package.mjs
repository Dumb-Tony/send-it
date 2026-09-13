import {mkdir,readFile,writeFile,cp,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('public/',root);
const pkg=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
const version=encodeURIComponent(process.env.GITHUB_SHA||pkg.version);
await mkdir(out,{recursive:true});
await cp(new URL('src/',root),new URL('src/',out),{recursive:true});
await cp(new URL('style.css',root),new URL('style.css',out));
async function versionModules(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=new URL(entry.name+(entry.isDirectory()?'/':''),dir);
    if(entry.isDirectory())await versionModules(path);
    else if(entry.name.endsWith('.js')){
      const source=await readFile(path,'utf8');
      await writeFile(path,source.replace(/(from\s*['"])(\.\.?\/[^'"\n]+\.js)(['"])/g,`$1$2?v=${version}$3`));
    }
  }
}
await versionModules(new URL('src/',out));
const html=(await readFile(new URL('index.html',root),'utf8')).replace('href="style.css"',`href="style.css?v=${version}"`).replace('src="src/main.js"',`src="src/main.js?v=${version}"`);
await writeFile(new URL('index.html',out),html);await writeFile(new URL('.nojekyll',out),'');
console.log(`Packaged SEND IT ${version}`);
