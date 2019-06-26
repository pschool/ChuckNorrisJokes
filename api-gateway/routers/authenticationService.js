var express = require('express');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const tokenSecret = 'verySecretToken'

const uri = "mongodb+srv://admin:admin@cluster0-p0eqk.mongodb.net/test?retryWrites=true&w=majority";

var clientOptions = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true
};

router.post('/authentication/login', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        const client = new MongoClient(uri, clientOptions);
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "email": email }).then(result => {
                if (result.password === sha512(password, result.salt)) {
                    console.log(`Successful login for: ${email}`)

                    var token = jwt.sign({ "id": result._id }, tokenSecret);
                    res.status(200);
                    res.send({ "token": token });
                } else {
                    console.log(`Unsuccessful login for: ${email}`)
                    res.status(404);
                    res.send();
                }
            }).catch(err => {
                console.log(err);
                res.status(500);
                res.send();
            }).finally(() => {
                client.close();
            });
        });
    }
})

router.post('/authentication/register', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        const client = new MongoClient(uri, clientOptions);
        client.connect(() => {
            console.log(`Creating new user: '${req.body.email}'`);
            var salty = crypto.randomBytes(16).toString('base64');

            let user = {
                email: email,
                password: sha512(password, salty),
                salt: salty
            }

            const users = client.db("chuckNorris").collection("users");
            users.insertOne(user).then(() => {
                console.log('User created.')
                res.status(200);
            }).catch(err => {
                console.log(err);
                res.status(500);
            }).finally(() => {
                client.close();
                res.send();
            });
        });
    }
});

/**
 * hash password with sha512.
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

module.exports = router