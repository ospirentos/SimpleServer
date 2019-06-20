const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
let config = require('./config');
let tokenhandler = require('./tokenhandler');
const app = express()
const port = 80
const uri = "mongodb+srv://ospirentos:Ko19933155.@generalpurposecluster-7nnzc.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/api/logincheck', (req, res) => {
  console.log(req.body.email);
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("reactnative").collection("users");
        collection.find({email:req.body.email}).toArray(function(err, result) {
        if (err) throw err;
        if (result !== 'undefined' && result.length > 0) {
          if (req.body.password === result[0].password) {
            let token = jwt.sign({ username: req.body.email },
              config.secret,
              {
                expiresIn: "24h"
              }
            );
            res.json({
              success: true,
              token: token
            });
          } else {
            res.json({
              success: false,
              token: "none"
            });
          }
        } else {
          res.json({
            success: false,
            token: "none"
          });
        }
      })
  
    client.close();
    console.log("Connection Closed.")
  });

});

app.post('/api/tokencheck',tokenhandler.checkToken, (req, res) => {
  res.json({
    success: true
  });
});

app.post('/api/emailcheck', (req, res) => {
  console.log(req.body.email);
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("reactnative").collection("users");
    collection.find({ email: req.body.email }).toArray(function (err, result) {
      if (err) throw err;
      if (result !== 'undefined' && result.length > 0) {
        res.json({
          success: true
        });
      } else {
        res.json({
          success: false
        })
      }
    });
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))





