var express = require('express'),
    app = express(),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morest = require('../src/morest').Morest;

//Connect to your mongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/bears');

//Use bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Load all the controllers
var CaveController = require('../example/app/controllers/cave');

//Let Morest generate the routes for the /api endpoint
app.use('/api', morest(router, mongoose, {
    controllers: [
        CaveController
    ]
}));

//Remove all old data
module.exports = app;