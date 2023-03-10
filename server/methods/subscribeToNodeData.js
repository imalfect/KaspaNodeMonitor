import WebSocketSubscription from '../constructors/subscription.js';
import {getNodeInfo, nodeEvents} from '../KaspaRPC.js';

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
    this.name = 'subscribeToNodeData';
    this.ws = ws;
    this.blockAddedCallback = async () => {
      const nodeInfo = await getNodeInfo();
      nodeInfo.origin = this.name;
      ws.send(JSON.stringify(nodeInfo));
    };
    this.nodeDisconnectedCallback = async () => {
      console.log('node disconnected callback');
      const nodeInfo = await getNodeInfo();
      nodeInfo.origin = this.name;
      ws.send(JSON.stringify(nodeInfo));
    };
  }
  /**
   * This function starts the subscription, checks if it's already subscribed and calls the function in the child class
   */
  async start() {
    // Send the current node info
    const nodeInfo = await getNodeInfo();
    nodeInfo.origin = this.name;
    this.ws.send(JSON.stringify(nodeInfo));
    nodeEvents.on('blockAdded', this.blockAddedCallback);
    nodeEvents.on('disconnect', this.nodeDisconnectedCallback);
  }
  /**
   * This function removes the listener, essentially stopping the subscription
   */
  async stop() {
    nodeEvents.removeListener('blockAdded', this.blockAddedCallback);
    nodeEvents.removeListener('disconnect', this.nodeDisconnectedCallback);
  }
}
