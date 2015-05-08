# Morest #

Allows developers to quickly create RESTful APIs using MongoDB and Express.

### Using Morest ###

The basic idea behind Morest is to write as little boilerplate code as possible. To get started all you have to do is
define the MongoDB schema using Mongoose and add the routes to an Express Router.
 
**app/controllers/bear.js:**

```javascript
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema,
    morest = require('morest'),
    Controller = morest.Controller;

var BearSchema = new Schema({
    name: {type: String, required: true},
    type: String
});

mongoose.model('Bear', BearSchema);

var BearController = new Controller({
    schema: 'Bear',
    availableOperations: [
        'GET_ALL',
        'GET'
    ]
});

module.exports = BearController;
```

Then set up a server to use the controller.

**server.js:**

```javascript
var express = require('express'),
    app = express(),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morest = require('morest').Morest;

mongoose.connect('mongodb://127.0.0.1:27017/bears');

var BearController = require('./app/controllers/bear');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8000;

app.use('/api', morest(router, {controllers: [BearController]}));
app.listen(port);
```