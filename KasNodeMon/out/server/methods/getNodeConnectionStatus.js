import {isConnected} from '../KaspaRPC.js';
import Function from '../constructors/function.js';
/**
 * @class Meteor.Methods.getServerVersion
 * @summary The class `Meteor.Methods.getConnectionStatus` is a method for getting the connection status to the kaspa node.
 */
export default class GetNodeConnectionStatus extends Function {
  /**
     * @constructor
     */
  constructor() {
    super();
    this.name = 'getNodeConnectionStatus';
  }

  /**
     * This function returns the connection status
     * @return {Promise<void>}
     */
  call() {
    return {
      status: 200,
      origin: this.name,
      connectionStatus: isConnected,
    };
  }
}
