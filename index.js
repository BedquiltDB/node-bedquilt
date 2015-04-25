/* jslint node: true */
"use strict";

var pg = require('pg');

exports.BedquiltClient = function(connectionString) {
  this.connectionString = connectionString;
  this.connection = new pg.Client(connectionString);
};
