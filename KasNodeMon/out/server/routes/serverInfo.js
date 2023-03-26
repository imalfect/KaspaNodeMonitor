import {router, hostname, location, cpuModel, cpuThreads, totalRam} from '../index.js';
import * as os from 'os';

export default router.get('/api/serverInfo', (req, res) => {
  res.json({
    hostname,
    location,
    cpuModel,
    cpuThreads,
    totalRam,
    load: os.loadavg()[1],
  });
});
