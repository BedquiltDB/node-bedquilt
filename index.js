/* jslint node: true */
"use strict";

var pg = require('pg');

var BedquiltClient = function(connectionString) {
  this.connectionString = connectionString;
  this._query = function(collectionName, queryDoc) {
    // pass
  };
  this.collection = function(collectionName) {
    return new BedquiltCollection(this, collectionName);
  };
};

var BedquiltCollection = function(client, collectionName) {
  this.client = client;
  this.collectionName = collectionName;
};

exports.BedquiltClient = BedquiltClient;
exports.BedquiltCollection = BedquiltCollection;
