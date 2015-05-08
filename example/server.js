var express = require('express'),
    app = express(),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morest = require('../src/morest').Morest;

mongoose.connect('mongodb://127.0.0.1:27017/bears');

var BearController = require('./app/controllers/bear');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8000;

app.use('/api', morest(router, {controllers: [BearController]}));
app.listen(port);