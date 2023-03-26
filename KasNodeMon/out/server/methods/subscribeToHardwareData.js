import WebSocketSubscription from '../constructors/subscription.js';
import {allowServerInfo, cpuModel, cpuThreads, hostname, location, totalRam} from '../index.js';
import * as os from 'os';
import BigNumber from 'bignumber.js';

/**
 * @class Meteor.Methods.subscribeToNodeData
 * @summary The class `Meteor.Methods.subscribeToNodeData` is a subscription for node data.
 */
export default class SubscribeToNodeData extends WebSocketSubscription {
  /**
     * @constructor
     * @param {WebSocket} ws The websocket connection.
     */
  constructor(ws) {
    super();
    this.interval = null;
    this.name = 'subscribeToHardwareData';
    this.ws = ws;
  }
  /**
     * This function starts the subscription, checks if it's already subscribed and calls the function in the child class
     */
  async start() {
    if (allowServerInfo === false) {
      this.ws.send(JSON.stringify({
        status: 200,
        message: 'Server info is disabled',
      }));
      return;
    }
    const data = {
      hostname: hostname,
      location: location,
      cpuModel: cpuModel,
      cpuThreads: cpuThreads,
      totalRam: totalRam,
      freeRam: new BigNumber(os.freemem()).shiftedBy(-6).toFixed(0),
      load: os.loadavg()[1],
    };
    data.origin = this.name;
    this.ws.send(JSON.stringify(data));
    this.interval = setInterval(() => {
      // for safety, not sure if needed though
      if (allowServerInfo) {
        const updatedData = {
          freeRam: new BigNumber(os.freemem()).shiftedBy(-6).toFixed(0),
          load: os.loadavg()[1],
        };
        updatedData.origin = this.name;
        this.ws.send(JSON.stringify(updatedData));
      } else {
        this.ws.send(JSON.stringify({}));
      }
    }, 30000);
  }
  /**
     * This function removes the listener, essentially stopping the subscription
     */
  async stop() {
    clearInterval(this.interval);
  }
}
