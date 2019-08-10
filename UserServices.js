let jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js');

const uri = "mongodb+srv://ospirentos:Ko19933155.@generalpurposecluster-7nnzc.mongodb.net/test?retryWrites=true&w=majority";

let getUserData = (req, res) => {
    let username = req.body.username;
    console.log('Data of user named ', username, 'is requested by the client');
    console.log('Fetching user information from the database...');
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("dynamic-character-sheet").collection("users");
        collection.find({ username: username }).toArray(function (err, result) {
            if (err) throw err;
            if (result !== 'undefined' && result.length > 0) {
                res.json({
                    error: "false",
                    successfull: true,
                    message: "User is fetched successfully.",
                    userData: result[0]
                });
                console.log('Fetch successfull, user info now sending to the client.')
                client.close();
                return res;
            } else {
                console.log('User not found in the database. Sending user not found to the client.')
                res.json({
                    error: "false",
                    successfull: "false",
                    message: "User is not found."
                })
                client.close();
                return res;
            }
        })
    });

};

let changeStatus = (req, res) => {
    let username = req.body.username;
    let status = req.body.status;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("dynamic-character-sheet").collection("users");
        collection.updateOne({ username: username }, {$set: {status: status}}, function (err, result) {
            if (err) throw err;
            console.log("User", username, "is now", status);
            client.close();
        })
    });
};

let getOnlinePlayers = (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("dynamic-character-sheet").collection("users");
        collection.find({ status: 'online' }).toArray(function (err, result) {
            if (err) throw err;
            if (result !== 'undefined' && result.length > 0) {
                res.json({
                    error: "false",
                    successfull: true,
                    message: "There are online players.",
                    userData: result
                });
                console.log(result)
            } else {
                res.json({
                    error: "false",
                    successfull: false,
                    message: "There is no online user.",
                    userData: 'none'
                });
            }
            client.close();
        })
    });
    return res;
};

module.exports = {
    getUserData: getUserData,
    changeStatus: changeStatus,
    getOnlinePlayers: getOnlinePlayers
}