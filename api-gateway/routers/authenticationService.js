var express = require('express');
var crypto = require('crypto');
var tokenService = require('../tokenService');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
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
                    var token = tokenService.createToken(result._id, result.email);
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
    } else {
        console.log('Email or password not found');
        res.status(400);
        res.send();
    }
})

router.post('/authentication/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {

        if (!checkPasswordRequirements(password)) {
            console.log('Password does not meet requirements.');
            res.status(400);
            res.send('Password does not meet requirements.');
            return;
        }

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
    } else {
        console.log('Email or password not found');
        res.status(400);
        res.send('Email or password not found');
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

function checkPasswordRequirements(password) {
    // Validate max length.
    if (password.length > 32) {
        console.error('32 limit');
        return false;
    }

    // Validate use of illegal items.
    const illegalItems = ['i', 'O', 'l'];
    for (const illegalItem of illegalItems) {
        if (password.includes(illegalItem)) {
            console.error('illegal item');
            return false;
        }
    }

    // Validate two non overlapping characters.
    const passwordLowerCaseCharArray = password.toLowerCase().split('');
    let nonOverlapPassed = false;
    for (let i = 0; i < passwordLowerCaseCharArray.length; i++) {
        if (passwordLowerCaseCharArray[i] === passwordLowerCaseCharArray[i + 1]) {
            nonOverlapPassed = true;
            break;
        }
    }
    if (!nonOverlapPassed) {
        console.error('No overlap');
        return false;
    }

    const alphaArray = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];
    let increasingStraightPassed = false;
    // Don't check last 2 characters, not possible to get 3 straight.
    for (let i = 0; i < passwordLowerCaseCharArray.length - 2; i++) {
        const indexOfFirst = alphaArray.indexOf(passwordLowerCaseCharArray[i]);
        const indexOfSecond = alphaArray.indexOf(passwordLowerCaseCharArray[i + 1]);
        const indexOfThird = alphaArray.indexOf(passwordLowerCaseCharArray[i + 2]);
        if (indexOfFirst >= 0 && indexOfSecond >= 0 && indexOfThird >= 0) {
            if (
                indexOfThird - indexOfSecond === 1 &&
                indexOfSecond - indexOfFirst === 1) {
                increasingStraightPassed = true;
                break;
            }
        }
    }
    if (!increasingStraightPassed) {
        console.error('No increasing straight');
        return false;
    }

    return true;
}

module.exports = router