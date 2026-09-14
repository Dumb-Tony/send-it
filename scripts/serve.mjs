import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp' };
const server = http.createServer(async (req,res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p=>p.startsWith('.'))) {res.writeHead(403);res.end();return;}
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store'});res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`SEND IT: http://127.0.0.1:${server.address().port}`));
