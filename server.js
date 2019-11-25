const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
let config = require('./config');
let login = require('./LoginHandler');
let usrservice = require('./UserServices')
const app = express()
const port = 8080
let http = require('http').createServer(app);
let io = require('socket.io')(http, { 'pingInterval': 2000, 'pingTimeout': 5000 });
let ioAdmin = require('socket.io')(http, { 'pingInterval': 2000, 'pingTimeout': 5000, 'path': '/admin' });

const uri = "mongodb+srv://ospirentos:Ko19933155.@generalpurposecluster-7nnzc.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let onlineUsers = [];
onlineUsersInfo = [];
DMlist = [];


app.post('/api/loginWithToken', login.checkToken);

app.post('/api/login', login.login);

app.post('/api/signup', login.signup);

app.post('/api/getUserData', usrservice.getUserData);

app.post('/api/changeStatus', usrservice.changeStatus);

app.get('/api/getOnlineUsers', (req, res) => {
    res.json({
        data: onlineUsersInfo
    })
    return res;
});

app.post('/api/createNewCharacter', usrservice.createNewCharacter);

app.post('/api/removeCharacter', usrservice.removeCharacter);



io.on('connection', function (socket) {
    socket.on('User', (data) => {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) throw err;
            const collection = client.db("dynamic-character-sheet").collection("users");
            collection.find({ username: data }).toArray(function (err, result) {
                if (err) throw err;
                if (result !== 'undefined' && result.length > 0) {
                    onlineUsersInfo.push(result[0]);
                    console.log(onlineUsersInfo);
                    if (DMlist.length > 0) {
                        DMlist[0].emit('UserInfo', onlineUsersInfo);
                    }
                } else {
                    client.close();
                }
            })
        })
    })

    onlineUsers.push(socket);
    console.log('A user is joined.');
    socket.on('disconnect', () => {
        console.log('A user is disconnected.');

      var i = onlineUsers.indexOf(socket);
      onlineUsers.splice(i, 1);
      onlineUsersInfo.splice(i,1);
      if (DMlist.length > 0) {
          DMlist[0].emit('UserInfo', onlineUsersInfo);
      }
    })
});

ioAdmin.on('connection', function(socket) {
    console.log('DM is connected.');
    DMlist.push(socket);
    socket.emit('UserInfo', onlineUsersInfo);
    socket.on('disconnect', () => {
        console.log('DM is disconnected.');

      var i = DMlist.indexOf(socket);
      DMlist.splice(i, 1);
    })
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`))





