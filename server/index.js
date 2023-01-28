// I prefer import okay
import express from 'express';
import expressWs from 'express-ws';
import dotenv from 'dotenv';
import BigNumber from 'bignumber.js';
import 'modernlog/patch.js';
import * as os from 'os';
import * as path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import log from 'loglevel';
import morgan from 'morgan';
import {fileURLToPath} from 'url';
// I know that it's in process.env but in case someone runs node index.js instead of npm start I want to make sure it works
// also workaround thanks to ESLint
import {readFileSync} from 'fs';
const pkg = JSON.parse(readFileSync('./package.json'));
export const backendVersion = pkg.version;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Config from root folder
dotenv.config({path: './.env'});
log.setLevel(process.env.LOG_LEVEL);
export const app = express();
// use morgan with log.log without line break
app.use(morgan('tiny', {stream: {write: (str) => log.log(str.trim())}}));
// eslint-disable-next-line new-cap
export const router = express.Router();
// Websocket methods array
export const wsMethods = [];
// eslint-disable-next-line no-unused-vars
const expressWsInstance = expressWs(app);
// CONFIGURATION AND ETC.
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
export const nodeUrl = process.env.NODE_URL;
// Specifications of the server (cpu,ram,uptime)
export const location = process.env.NODE_LOCATION || 'Kasland';
// Check if user allowed for server information
export const allowServerInfo = process.env.ALLOW_SERVER_INFORMATION !== 'false' || false;
export const hostname = allowServerInfo ? os.hostname() : 'Not specified';
export const cpuModel = allowServerInfo ? os.cpus()[0].model : false;
export const cpuThreads = allowServerInfo ? os.cpus().length : false;
const totalRamBytes = allowServerInfo ? os.totalmem() : false;
// eslint-disable-next-line max-len
export const totalRam = allowServerInfo ? new BigNumber(totalRamBytes).shiftedBy(-6).toFixed(0) : false;

if (process.env.SERVE_FRONTEND === 'true') {
  // Serve frontend
  log.info(`${chalk.green('Server:')} Serve Frontend is true, serving frontend`);
  app.use(express.static(path.join(__dirname, '../client/dist')));
}
// Check if node url is defined
if (!nodeUrl) {
  log.error('Node URL is not defined');
  process.exit(1);
}
// Load express routes
fs.readdirSync(('./routes')).forEach(async (file) => {
  if (file !== 'index.js') {
    await import(`./routes/${file}`);
    log.log(`Route ${chalk.green(file)} loaded`);
  }
});
// Load methods for websocket
fs.readdirSync(('./methods')).forEach(async (file) => {
  if (file !== 'index.js') {
    const method = await import(`./methods/${file}`);
    if (!method.default) {
      log.error(`Method ${chalk.red(file)} doesn't have a default export`);
      process.exit(1);
    }
    // eslint-disable-next-line new-cap
    const c = new method.default();
    if (!c.name) {
      log.error(`Method ${chalk.red(file)} doesn't have a name`);
      process.exit(1);
    }
    if (!c.type) {
      log.error(`Method ${chalk.red(file)} doesn't have a type`);
      process.exit(1);
    }
    wsMethods.push({
      Method: method.default,
      type: c.type,
      name: c.name,
    });
    log.log(`Method ${chalk.green(file)} loaded`);
  }
});
app.use('/', router);
app.on;
app.listen(port, host, () => {
  log.info(`Server running on ${host}:${port}`);
});
