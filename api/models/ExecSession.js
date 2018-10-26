/**
 * ExecSession.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    order: { type: 'number', required: true, unique: true},
    exec: { model: 'exec', required: true },
    session: { model: 'session', required: true }
  },

};

