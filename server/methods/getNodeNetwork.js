import {rpc} from '../KaspaRPC.js';
import Function from '../constructors/function.js';
/**
 * @class Meteor.Methods.getNodeNetwork
 * @summary The class `Meteor.Methods.getNodeNetwork` is a method for getting the node network.
 */
export default class GetNodeNetwork extends Function {
  /**
     * @constructor
     */
  constructor() {
    super();
    this.name = 'getNodeNetwork';
  }

  /**
     * This function calls the getNodeNetwork function from the KaspaRPC class
     * @return {Promise<void>}
     */
  async call() {
    const currentNetwork = await rpc.request('getCurrentNetworkRequest', {});
    return {
      status: 200,
      origin: this.name,
      currentNetwork: currentNetwork.currentNetwork,
    };
  }
}
