var express = require('express'),
    app = express(),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morest = require('../src/morest').Morest;

//Connect to your mongoDB database
var conn = mongoose.connect('mongodb://127.0.0.1:27017/bears').connection;

//Use bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8000;

//Load all the controllers
var BearController = require('./app/controllers/bear'),
    HoneypotController = require('./app/controllers/honeypot'),
    CaveController = require('./app/controllers/cave');

//Let Morest generate the routes for the /api endpoint
app.use('/api', morest(router, mongoose, {
    controllers: [
        BearController,
        HoneypotController,
        CaveController
    ]
}));

//Remove all old data
mongoose.model('Bear').remove()
    .then(function () {
        return mongoose.model('Honeypot').remove();
    })
    .then(function () {
        return mongoose.model('Cave').remove();
    })
    //Prepare some new data to use
    .then(function () {
        return HoneypotController.prepData();
    })
    .then(function () {
        return CaveController.prepData()
    })
    .then(function () {
        return BearController.prepData()
    })
    .then(function () {
        app.listen(port);
    });