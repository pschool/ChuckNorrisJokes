var express = require('express');
var app = express();
var router = require('./routers/router')
var bodyParser = require('body-parser');
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Api gateway available!')
})

app.use(router)
console.log(`Api gateway running on localhost:${port}`)
app.listen(3000);