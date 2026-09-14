// Run with sharp available on NODE_PATH. Original Higgsfield PNGs live in artifacts/source-art/.
// Conversion preserves source dimensions and alpha; connected bounds avoid atlas-cell clipping.
const fs=require('node:fs/promises'),path=require('node:path'),sharp=require('sharp');
async function main(){
  const root=path.resolve(__dirname,'..'),source=path.join(root,'artifacts/source-art'),out=path.join(root,'src/assets');
  for(const name of ['courier','street','construction','skyline']){
    await sharp(path.join(source,`${name}-v10.png`)).webp({quality:90,alphaQuality:100,effort:6}).toFile(path.join(out,`${name}-v10.webp`));
  }
  const {data,info}=await sharp(path.join(source,'courier-v10.png')).raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,seen=new Uint8Array(W*H),queue=new Int32Array(W*H),frames=[];
  for(let k=0;k<W*H;k++){
    if(seen[k]||data[k*4+3]<32)continue;
    let a=0,z=1,l=W,t=H,r=0,b=0;queue[0]=k;seen[k]=1;
    while(a<z){const j=queue[a++],x=j%W,y=Math.floor(j/W);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);
      for(const n of [x>0?j-1:-1,x<W-1?j+1:-1,y>0?j-W:-1,y<H-1?j+W:-1])if(n>=0&&!seen[n]&&data[n*4+3]>=32){seen[n]=1;queue[z++]=n;}
    }
    if(z>1000)frames.push({index:Math.floor((t+b)/2/512)*4+Math.floor((l+r)/2/512),x:l-2,y:t-2,w:r-l+5,h:b-t+5});
  }
  frames.sort((a,b)=>a.index-b.index);
  if(frames.length!==16||frames.some((f,i)=>f.index!==i))throw new Error('Expected exactly sixteen isolated courier poses');
  await fs.writeFile(path.join(out,'courier-frames.js'),`// Alpha bounds measured from the original 2048px Higgsfield atlas.\nexport const courierFrames=${JSON.stringify(frames)};\n`);
  console.log('Prepared four WebP assets and sixteen unclipped frame bounds.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
