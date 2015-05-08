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

app.use('/api', mongoose, morest(router, {controllers: [BearController]}));
app.listen(port);
```

### Defining a controller ###
Morest comes with its own controllers that allow Morest to easily generate routes. 

Before defining a controller, a Mongoose schema is required.

The following options can be passed into the controller:

`schema`: the name of the Mongoose schema

`availableOperations`: array of operations that can be performed with this controller, e.g.: `GET_ALL`, `GET`, 
`POST`, `UPDATE`, `DELETE`. By default, all operations are enabled.

### Generating the routes ###
First create an Express router by doing: `var router = express.Router()`.

Then generate the routes by adding them to your app: `app.use('/api', mongoose, morest(router, {controllers: 
[ControllerObject1, ControllerObject2]}))`.