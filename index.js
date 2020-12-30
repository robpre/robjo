import { Server } from 'boardgame.io/server';
import staticServer from 'koa-static';
import helmet from 'koa-helmet';
import { readFileSync } from 'fs';
import { contentSecurityPolicy } from 'helmet';

import { SkyJo } from './src/game/skyjo';

const PORT = process.env.PORT || 8000;

const server = new Server({ games: [SkyJo], });

server.app.use(async (ctx, next) => {
  await next();

  if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return;
  // response is already handled
  if (ctx.body != null || ctx.status !== 404) return;

  ctx.type = 'html';
  ctx.body = readFileSync('./build/index.html');
});
server.app.use(staticServer('build', { defer: true }));

server.app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'unsafe-inline'", "'self'"],
    },
  },
}));
server.run({
  port: PORT,
}, () => console.log(`Server running on :${PORT}`))
