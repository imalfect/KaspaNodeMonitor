import kaspa from "kaspajs";
import chalk from "chalk";
import BigNumber from "bignumber.js";
export default class HelloCommand {
    static command = 'nodeStatus <ip>';
    static description = 'Prints out the most important information about a node straight to your terminal!';

    static action(ip) {
        console.log(chalk.bold(`Attempting to connect to ${ip}...`));
        let rpc = new kaspa.Daemon(ip, () => {
            console.log(`${chalk.green('Kaspa:')} Connected to ${ip}`);
            checkConnection(rpc).then(async (res) => {
               if (res) {
                     console.log('Connected!');
                     console.log('Fetching node status...');
                     const ni = await getNodeInfo(rpc);
                     console.log(`Peers: ${chalk.bold(numberFormatter.format(ni.peers))}`);
                     console.log(`Version: ${chalk.bold(ni.version)}`);
                     console.log(`Mempool size: ${chalk.bold(ni.mempoolSize)}`);
                     console.log(`Synced: ${chalk.bold(ni.isSyncedRPC)}`);
                     console.log(`Block count: ${chalk.bold(numberFormatter.format(ni.blockCount))}`);
                     console.log(`Header count: ${chalk.bold(numberFormatter.format(ni.headerCount))}`);
                     console.log(`DAA score: ${chalk.bold(numberFormatter.format(ni.daaScore))}`);
                     console.log(`Difficulty: ${chalk.bold(numberFormatter.format(ni.difficulty))}`);
                     console.log(`Hashrate: ${chalk.bold(numberFormatter.format(
                         new BigNumber(ni.hashRate).shiftedBy(-12).toFixed(2),
                     ) + ' TH/s')}`);
                     console.log(`Blue score: ${chalk.bold(numberFormatter.format(ni.blueScore))}`);
                     process.exit(0);

               }
            });
        }).on('error', (err) => {
            // This is a workaround for a bug in kaspajs
            console.error(`${chalk.red('Kaspa:')} ${err}`);
            process.exit(1);
        });

    }
}

async function checkConnection(rpc) {
    try {
        const info = await rpc.request('getInfoRequest', {});
        console.log(`${chalk.green('Kaspa:')} Connected! Node running Kaspad version ${info.serverVersion}`);
        return true;
    } catch (e) {
        console.log(e, 'error');
    }
}



async function getNodeInfo(rpc) {
        const p = performance.now();
        const mainStats = await rpc.request('getBlockDagInfoRequest', {}).catch((e) => {
            console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
            // set to 0 if error
            return {
                blockCount: "Error",
                headerCount: "Error",
                virtualDaaScore: "Error",
                difficulty: "Error",
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
                serverVersion: "Error",
                mempoolSize: "Error",
                isSynced: "Error",
            };
        });
        const blueScore = await rpc.request('getVirtualSelectedParentBlueScoreRequest', {}).catch((e) => {
            console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
            // set to 0 if error
            return {
                blueScore: "Error",
            };
        });
        const hashRate = await getNetworkHashrate(rpc).catch((e) => {
            console.log(`KasNodeMon encountered an error while fetching node info: ${JSON.stringify(e)}`);
            // set to 0 if error
            return 0;
        });
        const pp = performance.now();
        // Check by timestamp sync
        console.log(`Requests to Kaspa gRPC took ${(pp - p).toFixed(0)} ms`);
        return {
            peers: connectedPeers.infos.length,
            version: info.serverVersion,
            mempoolSize: info.mempoolSize,
            isSyncedRPC: info.isSynced,
            blockCount: mainStats.blockCount,
            headerCount: mainStats.headerCount,
            daaScore: mainStats.virtualDaaScore,
            difficulty: mainStats.difficulty,
            blueScore: blueScore.blueScore,
            hashRate: hashRate,
            status: 200,
        };
}

async function getNetworkHashrate(rpc) {
    const info = await rpc.request('estimateNetworkHashesPerSecondRequest', {windowSize: 2500});
    return info.networkHashesPerSecond;
}
export const numberFormatter = new Intl.NumberFormat('en-US');
