/* jslint node: true */
"use strict";

var pg = require('pg');

function BedquiltClient() {


};

BedquiltClient.connect = function(connectionString, callback) {
  var db = {
    connectionString: connectionString
  };
  callback(null, db);
};

exports.BedquiltClient = BedquiltClient;
