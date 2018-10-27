/**
 * Subscriber.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  
  attributes: {
    token: { type: 'string', required: true, unique: true },
    /**
     * Subscriber timezone in minutes
     */
    timezone: { type: 'number', required: true },

    pushSubscription: { type: 'json', required: true }
  },

};

