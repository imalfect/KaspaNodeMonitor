// NODE
import kaspa from 'kaspajs';
import chalk from 'chalk';
import EventEmitter from 'events';
import {nodeUrl} from './index.js';
import log from 'loglevel';
import BigNumber from 'bignumber.js';
export let isConnected = false;
export let rpc = new kaspa.Daemon(process.env.NODE_URL, () => {
  log.info(`${chalk.green('Kaspa:')} Connected to ${nodeUrl}`);
  checkConnection();
}).on('error', (err) => {
  // This is a workaround for a bug in kaspajs
  isConnected = false;
  nodeEvents.emit('disconnect');
  log.error(`${chalk.red('Kaspa:')} ${err}`);
  reconnect();
});
let latestBlockTimestamp = 0;
export const nodeEvents = new EventEmitter();
let tries = 0;
/**
 * @summary Reconnect to node
 */
function reconnect() {
  setTimeout(() => {
    tries++;
    if (tries === 10) {
      log.error(`${chalk.red('Kaspa:')} Can't connect to ${nodeUrl}, I will try again in a minute`);
      setTimeout(() => {
        tries = 0;
        reconnect();
      }, 60000);
    } else {
      log.info(`${chalk.yellow('Kaspa:')} Trying to reconnect`);
      rpc = new kaspa.Daemon(process.env.NODE_URL, () => {
        log.info(`${chalk.green('Kaspa:')} Connected to ${nodeUrl}`);
        checkConnection();
      }).on('error', (err) => {
        // This is a workaround for a bug in kaspajs
        isConnected = false;
        nodeEvents.emit('disconnect');
        log.error(`${chalk.red('Kaspa:')} ${err}`);
        reconnect();
      });
    }
  }, 6000);
}

/**
 * @summary Subscribe to events
 */
async function subscribeToEvents() {
  // Check if node is synced according to gRPC
  let info = await rpc.request('getInfoRequest', {});
  if (info.isSynced) {
    // Is synced so we can make a subscription
    rpc.subscribe('notifyBlockAddedRequest', (response) => {
      // log.info(`${chalk.green('Kaspa:')} New block added`);
      latestBlockTimestamp = response.block.header.timestamp;
      nodeEvents.emit('blockAdded', response);
    });
  } else {
    // Node is not synced and therefore doesn't emit events about new blocks
    const syncCheckInterval = setInterval(async () => {
      info = await rpc.request('getInfoRequest', {});
      if (info.isSynced) {
        clearInterval(syncCheckInterval);
        log.info('Node is synced');
        subscribeToEvents();
      } else {
        // Not exactly the best way to do this, but it works
        log.info(`${chalk.yellow('Kaspa:')} Node is not synced, waiting for it to sync`);
        nodeEvents.emit('blockAdded');
      }
    }, 1000);
  }
}


/**
 * @return {Promise<{blockCount: *, difficulty: *, isSynced: *, mempoolSize: *, daaScore: *, peers, headerCount: *, version: *}>}
 */
export async function getNodeInfo() {
  if (isConnected) {
    const p = performance.now();
    const mainStats = await rpc.request('getBlockDagInfoRequest', {}).catch((e) => {
      console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
      // set to 0 if error
      return {
        blockCount: 'Error',
        headerCount: 'Error',
        virtualDaaScore: 'Error',
        difficulty: 'Error',
      };
    });
    const connectedPeers = await rpc.request('getConnectedPeerInfoRequest', {}).catch((e) => {
      console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
      // set to 0 if error
      return {
        infos: [],
      };
    });
    const info = await rpc.request('getInfoRequest', {}).catch((e) => {
      console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
      // set to 0 if error
      return {
        serverVersion: 'Error',
        mempoolSize: 'Error',
        isSynced: 'Error',
      };
    });
    const blueScore = await rpc.request('getVirtualSelectedParentBlueScoreRequest', {}).catch((e) => {
      console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
      // set to 0 if error
      return {
        blueScore: 'Error',
      };
    });
    const hashRate = await getNetworkHashrate(rpc).catch((e) => {
      console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
      // set to 0 if error
      return 0;
    });
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
      hashRate: hashRate,
      status: 200,
    };
  } else {
    return {
      status: 400,
      error: 'Connection to Kaspa node failed',
    };
  }
}
/**
 * @summary Check if node is connected before setting isConnected to true
 */
async function checkConnection() {
  try {
    const info = await rpc.request('getInfoRequest', {});
    // it won't resolve or change at all if it's not connected ty kaffin
    isConnected = true;
    subscribeToEvents();
    log.log(`${chalk.green('Kaspa:')} Connected to ${nodeUrl} running Kaspad version ${info.serverVersion}`);
  } catch (e) {
    log.log(e, 'error');
    rpc.emit('error', e);
  }
}

/**
 * @summary Get network hashrate
 * @return {Promise<*>}
 */
async function getNetworkHashrate() {
  const info = await rpc.request('estimateNetworkHashesPerSecondRequest', {windowSize: 2500});
  return info.networkHashesPerSecond;
}
