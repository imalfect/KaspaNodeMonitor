import chalk from 'chalk';
import {router} from '../index.js';
import {getNodeInfo, rpc} from '../KaspaRPC.js';

export default router.get('/api/nodeStats', async (req, res) => {
  try {
    // Kaffin please make kaspajs in typescript
    const nodeInfo = await getNodeInfo();
    const currentNetwork = await rpc.request('getCurrentNetworkRequest', {});
    res.json({
      peers: nodeInfo.peers,
      version: nodeInfo.serverVersion,
      mempoolSize: nodeInfo.mempoolSize,
      isSynced: nodeInfo.isSynced,
      blockCount: nodeInfo.blockCount,
      headerCount: nodeInfo.headerCount,
      daaScore: nodeInfo.virtualDaaScore,
      difficulty: nodeInfo.difficulty,
      network: currentNetwork.network,
      status: 200,
    });
  } catch (e) {
    console.error(`${chalk.red('Kaspa:')} ${e}`);
    res.json({
      status: 500,
    });
  }
});
