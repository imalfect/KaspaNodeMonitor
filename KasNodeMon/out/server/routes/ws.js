import {router, wsMethods} from '../index.js';
import log from 'loglevel';
export default router.ws('/ws', (ws) => {
  // According to my research everything that happens here is "connection specific"
  // So isSubscribed can be false for one connection and true for another one.
  log.log('Websocket connection to backend established');
  ws.on('message', async (msg) => {
    try {
      msg = JSON.parse(msg);
      log.log(`Message received from WebSocket: ${JSON.stringify(msg)}`);
      // Check if method exists
      const method = wsMethods.find((method) => method.name === msg.method);
      if (method) {
        // Exists
        if (method.type === 'subscription') {
          const classInstance = new method.Method(ws);
          classInstance.subscribe(ws);
        } else if (method.type === 'function') {
          const classInstance = new method.Method(ws);
          const response = await classInstance.call();
          ws.send(JSON.stringify(response));
        }
      } else {
        // Doesn't exist
        ws.send(JSON.stringify({
          status: 400,
          message: 'Method does not exist',
        }));
      }
    } catch (e) {
      log.trace(`Error in ws.on('message'): ${e.message}. This may not be important, as it can occur because the websocket json was invalid.`); // log because it's not important
      ws.send(JSON.stringify({
        status: 400,
        message: 'Unknown error', // nope no error messages from server to client
      }));
    }
  });
  ws.on('close', () => {
    log.log('Connection to WebSocket closed');
  });
});
