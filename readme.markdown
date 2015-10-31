node-bedquilt
=============

The nodejs driver for [BedquiltDB](http://bedquiltdb.github.io)

Requires `node` >= 4.0.0


## Install

```
$ npm install bedquilt --save
```


## Getting Started

- First, [set up BedquiltDB](http://bedquiltdb.readthedocs.org/en/latest/getting_started/)
- Install the node-bedquilt package: `npm install bedquilt`
- Connect to the BedquiltDB server:
```javascript
var BedquiltClient = require('bedquilt').BedquiltClient;

BedquiltClient.connect('postgres://localhost/test', function(err, client) {

  var people = client.collection('people');

  people.insert({name: "Sarah", age: 45}, function(err, result) {
    console.log('Added Sarah to the people collection with _id: ' + result);
  });

});
```

## Documentation

See the [node-bedquilt documentation](http://node-bedquilt.readthedocs.org/en/latest).


## Tests

Run `make test` to run the test suite. Requires a local instance of PostgreSQL, with BedquiltDB installed and
a `bedquilt_test` database set up.
