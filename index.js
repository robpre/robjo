import { Server } from 'boardgame.io/server';
import staticServer from 'koa-static';
import helmet from 'koa-helmet';

import { SkyJo } from './src/game/skyjo';

const PORT = process.env.PORT || 8000;

const server = new Server({ games: [SkyJo], });

server.app.use(staticServer('build'));
server.app.use(helmet());

server.run({
  port: PORT,
}, () => console.log(`Server running on :${PORT}`))
