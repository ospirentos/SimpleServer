let jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js');

const uri = "mongodb+srv://ospirentos:Ko19933155.@generalpurposecluster-7nnzc.mongodb.net/test?retryWrites=true&w=majority";

let checkToken = (req, res) => {
    console.log('User is trying to login with token.');
    let token = req.body.token;

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log('Login rejected.');
                return res.json({
                    successfull: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                console.log('User logged in successfully');
                return res.json({
                    successfull: true,
                    message: 'Token is valid'
                });
            }
        });
    } else {
        return res.json({
            successfull: false,
            message: 'No token is submitted.'
        });
    }
};

let login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log('User', username, 'is trying to login.')

    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("dynamic-character-sheet").collection("users");
        collection.find({ username: username }).toArray(function (err, result) {
            if (err) throw err;
            if (result !== 'undefined' && result.length > 0) {
                if (password === result[0].password) {

                    let token = jwt.sign({ username: username },
                        config.secret,
                        {
                            expiresIn: "24h"
                        }
                    );

                    res.json({
                        error: "false",
                        successfull: "true",
                        token: token,
                        message: "Login parameters are correct."
                    })
                    console.log("User", username, "is successfully logged in.");
                } else {
                    res.json({
                        error: "false",
                        successfull: "false",
                        message: "Username does not exists or password is wrong"
                    })
                    console.log("Login failed, invalid username or password.");
                }
                client.close();
            } else {
                res.json({
                    error: "false",
                    successfull: "false",
                    message: "Username does not exists or password is wrong"
                })
                client.close();

                console.log("Login failed, invalid username or password.1");

                return res;
            }
        })

    });

};

let signup = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log('System is trying to signup the user with name', username);
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("dynamic-character-sheet").collection("users");
        collection.find({ username: username }).toArray(function (err, result) {
            if (err) throw err;
            if (result !== 'undefined' && result.length > 0) {
                res.json({
                    error: "false",
                    successfull: "false",
                    message: "User already exists."
                })
                client.close();
                console.log("Signup failed, username already exists.");
                return res;
            } else {
                collection.insertOne({
                    username: username,
                    password: password,
                    dmFlag: false,
                    characters: []
                }, err => {
                    if (err) throw err;
                })
                res.json({
                    error: "false",
                    successfull: "true",
                    message: "User is added to the database."
                })
                console.log("User", username, "is added to the database.");
                client.close();
            }
        })

    });

};

module.exports = {
    checkToken: checkToken,
    login: login,
    signup: signup
}