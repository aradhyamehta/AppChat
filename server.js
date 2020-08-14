const MongoClient = require('mongodb').MongoClient;
const io = require('socket.io').listen(4000).sockets;
const assert = require('assert');
const { send } = require('process');

//Connection URL
const url = 'mongodb://localhost:27017';

//connect to DB
MongoClient.connect(url, { useNewUrlParser:  true, useUnifiedTopology: true }, function(err, client){
    if(err) {
        throw err;
    }

    console.log('The database connected*');

    io.on('connection', function(socket){
        let chat = client.collection('chats');

        //send status
        sendStatus = function(s) {
            socket.emit('status', s);
        }

        //get retrieved chats
        chat.find().limit(150).sort({_id:1}).toArray(function(err, res){
            if(err) {
                throw err;
            }

            //Send messages to client
            socket.emit('output', res);
        });

        //Input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            //test variables
            if(name == "" || message == "") {
                sendStatus("Please enter a name and message");
            } else {
                chat.insert({name: name, message: message}, function(){
                    io.emit('output', [data]);
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        //Clear all messages
        socket.on('clear',function(data){
            chat.remove({}, function(){
                socket.emit('Cleared all messages');
            });
        });
    });
});
