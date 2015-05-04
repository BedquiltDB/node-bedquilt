/*jslint node: true*/
/*global require, exports*/
"use strict";

var pg = require('pg');

function BedquiltClient() {};

BedquiltClient.connect = function(connectionString, callback) {
  var db = {
    connectionString: connectionString,

    collection: function(collectionName) {
      return new BedquiltCollection(this, collectionName);
    },

    _query: function(queryString, params, callback) {
      pg.connect(this.connectionString, function(err, client, done) {
        if(err) {
          return callback(err, null);
        }
        client.query(queryString, params, function(err, result) {
          done();
          if(err) {
            return callback(err, null);
          }
          return callback(null, result);
        });
        return null;
      });
    },

    listCollections: function(callback) {
      return this._query('select bq_list_collections();', [], function(err, result) {
        if(err) {
          return callback(err, null);
        } else {
          var collections = result.rows.map(function(row) {
            return row['bq_list_collections'];
          });
          return callback(null, collections);
        }
      });
    },

    createCollection: function(collectionName, callback) {
      return this._query('select bq_create_collection($1::text)', [collectionName], function(err, result) {
        if(err) {
          return callback(err, null);
        } else {
          return callback(null, result.rows[0]['bq_create_collection']);
        }
      });
    },

    deleteCollection: function(collectionName, callback) {
      return this._query('select bq_delete_collection($1::text)', [collectionName], function(err, result) {
        if(err) {
          return callback(err, null);
        } else {
          return callback(null, result.rows[0]['bq_delete_collection']);
        }
      });
    }
  };

  return callback(null, db);
};

function BedquiltCollection(db, collectionName) {
  this.db = db;
  this.collectionName = collectionName;
  this._query = function(queryString, params, callback) {
    return db._query(queryString, params, callback);
  };

  this.count = function(queryDoc, callback) {
    var query = "select bq_count($1::text, $2::json)";
    return this._query(query, [this.collectionName, queryDoc], function(err, result) {
      if(err) {
        return callback(err, null);
      } else {
        return callback(null, result.rows[0]['bq_count']);
      }
    });
  };
};


exports.BedquiltClient = BedquiltClient;
exports.BedquiltCollection = BedquiltCollection;
