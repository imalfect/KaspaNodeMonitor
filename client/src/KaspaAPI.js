import {EventEmitter} from 'events';
import config from '../config.json';
export const dataChange = new EventEmitter();
const hardwareData = {};
const wsApiUrl = config.wsApiURL;

const ws = new WebSocket(wsApiUrl);

ws.onopen = () => {
  console.log('Connected to the Kaspa API.');
  ws.send(JSON.stringify({method: 'subscribeToNodeData'}));
  ws.send(JSON.stringify({method: 'subscribeToHardwareData'}));
};
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.origin === 'subscribeToNodeData') {
    dataChange.emit('nodeDataChange', data);
  } else if (data.origin === 'subscribeToHardwareData') {
    // Replace the old data with the new data
    // eslint-disable-next-line guard-for-in
    for (const key in data) {
      hardwareData[key] = data[key];
    }
    dataChange.emit('hardwareDataChange', hardwareData);
  } else if (data.origin === 'getNodeNetwork') {
    console.log('getNodeNetwork', data);
    dataChange.emit('nodeNetworkChange', data);
  }
};

/**
 * @summary This function gets the node network data.
 * @return {Promise<string>}
 */
export async function getNodeNetwork() {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify({method: 'getNodeNetwork'}));
    return new Promise((resolve) => {
      dataChange.on('nodeNetworkChange', (data) => {
        resolve(data.currentNetwork);
      });
    });
  } else {
    console.warn('WebSocket is not ready');
    // wait and retry
    setTimeout(async () => {
      return await getNodeNetwork();
    }, 500);
  }
}
