/* jshint node: true */
/* jshint esnext: true */
"use strict";

let pg = require('pg');
let BedquiltClient = require('../index.js').BedquiltClient;
let connectionString = 'postgres://localhost/bedquilt_test';

let cleanDatabase = (callback) => {
  pg.connect(connectionString, (err, client, done) => {
    let query = `
      drop schema public cascade;
      create schema public;
      create extension pgcrypto;
      create extension bedquilt;
    `;
    client.query(query, [], (err, result) => {
      if(err) {
        throw err;
      } else {
        done();
        return callback();
      }
    });
  });
};

let connect = (callback) => {
  BedquiltClient.connect(connectionString, callback);
};

exports.connectionString = connectionString;
exports.cleanDatabase = cleanDatabase;
exports.connect = connect;
