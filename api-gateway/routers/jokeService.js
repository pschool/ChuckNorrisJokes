var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
var ObjectId = require('mongodb').ObjectId

const BASE_URL = 'http://api.icndb.com'
const api = apiAdapter(BASE_URL)

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-p0eqk.mongodb.net/test?retryWrites=true&w=majority";
var clientOptions = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true
};

var tokenService = require('../tokenService');

/** 
 * Obtains 1 random joke from the joke service.
*/
router.get('/jokes/random', (req, res) => {
    api.get(req.path).then(resp => {
        res.send(resp.data)
    })
});

/** 
 * Obtains a set of random joke from the joke service.
*/
router.get('/jokes/random/:amount', (req, res) => {
    api.get(req.path).then(response => {
        if (response.data.type === 'success') {
            res.send(response.data.value)
        }
        else {
            console.error('Request was not successful.')
        }
    })
});

/**
 * Obtains all favorite jokes for a user.
 */
router.get('/jokes/favorites', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                res.send(result.favoriteJokes);
            }).catch(err => {
                console.log(err);
                res.status(500);
                res.send();
            }).finally(() => {
                client.close();
            });
        });
    });
});

/**
 * Adds a favorite joke to a user.
 */
router.post('/jokes/favorites', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    let newJoke = req.body.joke;

    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                if (result.favoriteJokes) {
                    result.favoriteJokes.push(newJoke);
                } else {
                    result.favoriteJokes = [newJoke];
                }
                users.updateOne(
                    { "_id": ObjectId(userID) },
                    { $set: { "favoriteJokes": result.favoriteJokes } }
                ).then(result => {
                    res.status(200);
                    res.send(result.favoriteJokes);
                }).catch(err => {
                    console.log('failed to add new joke to favorites.');
                    console.log(err);
                    res.status(500);
                }).finally(() => {
                    client.close();
                    res.send();
                });
                res.send(result.favoriteJokes);
            }).catch(err => {
                console.log(err);
                res.status(500);
                res.send();
            }).finally(() => {
                client.close();
            });
        });
    });
});

/**
 * Removes a favorite joke from a user.
 */
router.delete('/jokes/favorites/:id', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                if (result.favoriteJokes) {
                    let index = findJokeIndex(result.favoriteJokes, req.params.id);
                    if (index >= 0) {
                        result.favoriteJokes.splice(index, 1);
                    }
                }
                users.updateOne(
                    { "_id": ObjectId(userID) },
                    { $set: { "favoriteJokes": result.favoriteJokes } }
                ).then(result => {
                    res.status(200);
                    res.send(result.favoriteJokes);
                }).catch(err => {
                    console.log(`failed to remove joke '${req.params.id}' from favorites.`);
                    console.log(err);
                    res.status(500);
                }).finally(() => {
                    client.close();
                    res.send();
                });
                res.send(result.favoriteJokes);
            }).catch(err => {
                console.log(err);
                res.status(500);
                res.send();
            }).finally(() => {
                client.close();
            });
        });
    });
    let joke = req.body.joke;
});

function getUserID(token) {
    return new Promise(function (resolve, reject) {
        tokenService.validateToken(token).then(decodedToken => {
            resolve(decodedToken.id);
        }).catch(() => {
            throw new Error('Invalid Token');
        });
    });
}

/**
 * Obtains the index of a joke from an array by id.
 */
function findJokeIndex(jokes, id) {
    index = 0;
    for (let joke of jokes) {
        if (joke.id == id) {
            return index;
        }
        index++;
    }
    return -1;
}

module.exports = router