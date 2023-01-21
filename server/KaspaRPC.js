// NODE
import kaspa from 'kaspajs';
import chalk from 'chalk';
import EventEmitter from 'events';
import {nodeUrl} from './index.js';
import log from 'loglevel';
import BigNumber from 'bignumber.js';
export let rpc = new kaspa.Daemon(process.env.NODE_URL, () => {
  log.info(`${chalk.green('Kaspa:')} Connected to ${nodeUrl}`);
});
let latestBlockTimestamp = 0;
export const nodeEvents = new EventEmitter();

rpc.on('end', () => {
  log.error(`${chalk.red('Kaspa:')} Connection lost`);
  rpc = new kaspa.Daemon(process.env.NODE_URL, () => {
    log.info(`${chalk.green('Kaspa:')} Connected to ${nodeUrl}`);
  });
});

rpc.subscribe('notifyBlockAddedRequest', (response) => {
  // log.info(`${chalk.green('Kaspa:')} New block added`);
  latestBlockTimestamp = response.block.header.timestamp;
  nodeEvents.emit('blockAdded', response);
});
// TODO: isSyncedRPC and isSyncedTimestamp, check if node is synced both from the getInfo and from the timestamp of the latest block on the node
/**
 * @return {Promise<{blockCount: *, difficulty: *, isSynced: *, mempoolSize: *, daaScore: *, peers, headerCount: *, version: *}>}
 */
export async function getNodeInfo() {
  const p = performance.now();
  const mainStats = await rpc.request('getBlockDagInfoRequest', {});
  const connectedPeers = await rpc.request('getConnectedPeerInfoRequest', {});
  const info = await rpc.request('getInfoRequest', {});
  const blueScore = await rpc.request('getVirtualSelectedParentBlueScoreRequest', {});
  const pp = performance.now();
  // Check by timestamp sync
  const isSyncedTimestamp = new BigNumber(Date.now()).minus(latestBlockTimestamp).isLessThan(1000 * 60); // 1 minute
  log.debug(`Requests to Kaspa gRPC took ${(pp - p).toFixed(0)} ms`);

  return {
    peers: connectedPeers.infos.length,
    version: info.serverVersion,
    mempoolSize: info.mempoolSize,
    isSyncedRPC: info.isSynced,
    isSyncedTimestamp: isSyncedTimestamp,
    blockCount: mainStats.blockCount,
    headerCount: mainStats.headerCount,
    daaScore: mainStats.virtualDaaScore,
    difficulty: mainStats.difficulty,
    blueScore: blueScore.blueScore,
  };
}
