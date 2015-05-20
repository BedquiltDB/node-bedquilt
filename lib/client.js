/*jslint node: true*/
/*global require, exports*/
"use strict";

var pg = require('pg');
var BedquiltCollection = require('./collection.js');
var project = require('./utils.js').project;

/**
 * Creates a new BedquiltClient instance.
 * @class
 * @return {BedquiltClient}
 */
function BedquiltClient() {};

/**
 * Establish a connection to the database.
 * @method
 * @static
 * @param {string} connectionString The pg connection string
 * @param {function} callback The result callback
 */
BedquiltClient.connect = function(connectionString, callback) {
  var _pass = function() {
    return function(result) {
      return result;
    };
  };
  var db = {
    connectionString: connectionString,

    collection: function(collectionName) {
      return new BedquiltCollection(this, collectionName);
    },

    _query: function(queryString, params, projection, callback) {
      pg.connect(this.connectionString, function(err, client, done) {
        if(err) {
          return callback(err, null);
        }
        client.query(queryString, params, function(err, result) {
          done();
          if(err) {
            return callback(err, null);
          }
          return callback(null, projection(result));
        });
        return null;
      });
    },

    listCollections: function(callback) {
      return this._query(
        'select bq_list_collections();',
        [],
        project.column('bq_list_collections'),
        callback
      );
    },

    createCollection: function(collectionName, callback) {
      return this._query(
        'select bq_create_collection($1::text);',
        [collectionName],
        project.single('bq_create_collection'),
        callback
      );
    },

    deleteCollection: function(collectionName, callback) {
      return this._query(
        'select bq_delete_collection($1::text);',
        [collectionName],
        project.single('bq_delete_collection'),
        callback
      );
    }

  };

  return callback(null, db);
};

module.exports = BedquiltClient;
