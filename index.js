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
    }
  };

  return callback(null, db);
};

function BedquiltCollection(db, collectionName) {
  this.db = db;
  this.collectionName = collectionName;
  this._query = function(queryDoc, callback) {
    return db._query(this.collectionName, queryDoc, callback);
  };
};


exports.BedquiltClient = BedquiltClient;
exports.BedquiltCollection = BedquiltCollection;
