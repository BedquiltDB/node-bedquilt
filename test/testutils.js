/* jslint node: true */
"use strict";

var pg = require('pg');
var BedquiltClient = require('../index.js').BedquiltClient;
var connectionString = 'postgres://localhost/bedquilt_test';

var cleanDatabase = function(callback) {
  pg.connect(connectionString, function(err, client, done) {
    var query = "drop schema public cascade;" +
                "create schema public; " +
                "create extension pgcrypto;" +
                "create extension bedquilt;";
    client.query(query, [], function(err, result) {
      if(err) {
        throw err;
      } else {
        done();
        return callback();
      }
    });
  });
};

var connect = function(callback) {
  BedquiltClient.connect(connectionString, callback);
};

exports.connectionString = connectionString;
exports.cleanDatabase = cleanDatabase;
exports.connect = connect;
