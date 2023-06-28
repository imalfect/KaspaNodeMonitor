import {router, hostname, location, cpuModel, cpuThreads, totalRam} from '../index.js';
import * as os from 'os';
import {dataSize} from '../index.js';

export default router.get('/api/serverInfo', (req, res) => {
  res.json({
    hostname,
    location,
    cpuModel,
    cpuThreads,
    totalRam,
    load: os.loadavg()[1],
    dataSize: process.env.TRACK_DATA_SIZE === 'true' ? dataSize : false,
  });
});
