import {EventEmitter} from 'events';
import config from '../config.json';
export const dataChange = new EventEmitter();
export const errors = new EventEmitter();
const hardwareData = {};
const wsApiUrl = config.wsApiURL;
let isConnected = false;
// I'm setting it here so ESLint won't complain later
// eslint-disable-next-line no-undef
export const frontendVersion = AppVersion;
export let backendVersion = 'Unknown';
const ws = new WebSocket(wsApiUrl);
ws.onclose = (event) => {
  // I consider this cannot connect to the backend
  console.log('Disconnected from the Kaspa API.');
  setTimeout(() => {
    errors.emit('backendConnectionError');
  }, 1000);
};
ws.onopen = () => {
  console.log('Connected to the Kaspa API.');
  console.log(`Frontend is running version ${frontendVersion}`);
  ws.send(JSON.stringify({method: 'getServerVersion'}));
  ws.send(JSON.stringify({method: 'subscribeToNodeData'}));
  ws.send(JSON.stringify({method: 'subscribeToHardwareData'}));
};
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.origin === 'subscribeToNodeData') {
    if (data.status === 400) {
      errors.emit('nodeConnectionError');
    } else {
      if (isConnected === false) {
        isConnected = true;
        ws.send(JSON.stringify({method: 'getNodeNetwork'}));
      }
      dataChange.emit('nodeDataChange', data);
    }
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
  } else if (data.origin === 'getServerVersion') {
    console.log('getServerVersion', data);
    dataChange.emit('serverVersionChange', data);
  } else if (data.origin === 'getNodeConnectionStatus') {
    console.log('getNodeConnectionStatus', data);
    dataChange.emit('nodeConnectionStatusChange', data);
  }
};
dataChange.on('serverVersionChange', (data) => {
  backendVersion = data.backendVersion;
  console.log(`Backend is running version ${data.backendVersion}`);
  console.log(`Frontend is running version ${frontendVersion}`);
  if (frontendVersion !== data.backendVersion) {
    errors.emit('versionMismatch');
    console.warn('Frontend and backend versions do not match!');
  } else {
    console.log('Frontend and backend versions match.');
  }
});
dataChange.on('nodeConnectionStatusChange', (data) => {
  if (!data.connectionStatus) {
    isConnected = false;
    errors.emit('nodeConnectionError');
  }
});
/**
 * @summary This function gets the node network data.
 * @return {Promise<string>}
 */
export async function getNodeNetwork() {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify({method: 'getNodeNetwork'}));
  } else {
    console.warn('WebSocket is not ready');
    // wait and retry
    setTimeout(async () => {
      getNodeNetwork();
    }, 500);
  }
  return new Promise((resolve) => {
    dataChange.on('nodeNetworkChange', (data) => {
      resolve(data.currentNetwork);
    });
  });
}
