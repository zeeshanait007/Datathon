const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
// Parse the Catalyst dynamic port specifically
const portStr = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '3000';
const port = parseInt(portStr, 10);

const app = next({ dev });
const handle = app.getRequestHandler();

console.log(`[AppSail] Starting Next.js custom server on port ${port}...`);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${port}`);
  });
}).catch(err => {
  console.error("Next.js app.prepare() failed:", err);
  process.exit(1);
});
