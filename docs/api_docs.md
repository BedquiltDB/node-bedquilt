# API Documentation

This document describes the `node-bedquilt` api.



## `BedquiltClient`

A client class which communicates with the PostgreSQL/Bedquilt server.

### `#connect`

Params: `connectionString::String`, `callback::Function`

A static method used to connect to the Bedquilt server.
The callback takes two parameters `err` and `client`, the latter of which
is an instance of BedquiltCollection.

Example:
```javascript
var BedquiltClient = require('node-bedquilt').BedquiltClient;

BedquiltClient.connect('postgres://localhost/test', function(err, client) {
  var people = client.collection('people');
  people.insert({name: "Sarah", age: 45}, function(err, result) {
    console.log('Added Sarah to the people collection with _id: ' + result);
  });
});
```

----

### `#collection`

Params: `collectionName::String`

Returns: instance of `BedquiltCollection`

Use to get an instance of `BedquiltCollection`, which can be used to read and write to a collection.

----


### `#listCollections`

Params: `callback::Function`

Gets a list of the names of all collections on the database. The callback function should take two parameters,
`err` and `result` where result is an Array of strings.

---


### `#createCollection`

Params: `collectionName::String`, `callback::Function`

Creates a collection on the database.
The callback function should take two parameters, `err` and `result` where result is a boolean indicating whether
the collection was created. This value will be false if the named collection already existed on the server.


### `#deleteCollection`

Params: `collectionName::String`, `callback::Function`

Deletes a collection on the database.
The callback function should take two parameters, `err` and `result` where result is a boolean indicating whether
the collection was deleted. This value will be false if the named collection did not exist on the server.





## `BedquiltCollection`
