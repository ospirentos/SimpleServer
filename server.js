const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 80
const uri = "mongodb+srv://ospirentos:Ko19933155.@generalpurposecluster-7nnzc.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/logincheck', (req, res) => {
  console.log(req.body);
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("reactnative").collection("users");
        collection.find({name:"ospirentos"}).toArray(function(err, result) {
        if (err) throw err;
        res.send("true")
      })
  
    client.close();
    console.log("Connection Closed.")
  });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





