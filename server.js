const MongoClient = require('mongodb').MongoClient;
const interact = require('socket.io').listen(4000).sockets;
const assert = require('assert');

//Connection URL
const url = 'mongodb://localhost:27017';

//connect to DB
MongoClient.connect(url, { useNewUrlParser:  true, useUnifiedTopology: true }, function(err, db){
    if(err) {
        throw err;
    }

    console.log('The database connected*');
});
