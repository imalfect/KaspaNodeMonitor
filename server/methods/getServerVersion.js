import {backendVersion} from '../index.js';
import Function from '../constructors/function.js';
/**
 * @class Meteor.Methods.getServerVersion
 * @summary The class `Meteor.Methods.getServerVersion` is a method for getting the server version.
 */
export default class GetServerVersion extends Function {
  /**
     * @constructor
     */
  constructor() {
    super();
    this.name = 'getServerVersion';
  }

  /**
     * This function returns the server version
     * @return {Promise<void>}
     */
  call() {
    return {
      status: 200,
      origin: this.name,
      backendVersion: backendVersion,
    };
  }
}
