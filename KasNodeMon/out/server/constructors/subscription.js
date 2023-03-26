/**
 * @class Meteor.Method
 * @summary The class `Meteor.Method` is a constructor for defining subscriptions.
 */
export default class WebSocketSubscription {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this.name = 'WebSocketSubscription';
    this.type = 'subscription';
    this.isSubscribed = false;
  }

  /**
   * This function starts the subscription, checks if it's already subscribed and calls the function in the child class
   * @return {Promise<void>}
   */
  async subscribe() {
    if (this.isSubscribed === true) {
      this.ws.send(JSON.stringify({
        status: 400,
        message: 'Already subscribed',
      }));
      return;
    }
    this.isSubscribed = true;
    this.ws.send(JSON.stringify({
      status: 200,
      message: 'Subscribed',
    }));
    // Subscribe to data, send data every sec
    this.start();
    this.ws.on('close', () => {
      this.isSubscribed = false;
      this.unsubscribe();
    });
  }

  /**
   * This function removes the listener, essentially stopping the subscription, also calls the function in the child class
   * @return {Promise<void>}
   */
  async unsubscribe() {
    this.isSubscribed = false;
    this.stop();
  }
}
