# Morest #

Allows developers to quickly create RESTful APIs using a mix of MongoDB, Express and NodeJS.

### Using Morest ###

#### Morest generator ####
The quickest way to get started with Morest is by using the [Morest generator](https://github.com/Robinfr/generator-morest).

#### Manually ####

Install using npm: `npm install morest --save`

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
    model: 'Bear',
    availableOperations: [
        'GET_ALL',
        'GET'
    ]
});

module.exports = BearController;
```

Then set up a server to use the controller.

G**server.js:**

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

app.use('/api', morest(router, mongoose, {controllers: [BearController]}));
app.listen(port);
```

### Defining a controller ###
Morest comes with its own controllers that allow Morest to easily generate routes. 

Before defining a controller, a Mongoose schema is required.

The following options can be passed into the controller:

`model`: the name of the Mongoose model

`availableOperations`: array of operations that can be performed with this controller, e.g.: `GET_ALL`, `GET`, 
`POST`, `UPDATE`, `DELETE`. By default, all operations are enabled.

### Generating the routes ###
Generating CRUD routes is simple. 

First create an Express router by doing: `var router = express.Router()`.

Then generate the routes by adding them to your app: `app.use('/api', morest(router, mongoose, {controllers: 
[ControllerObject1, ControllerObject2]}))`.

The routes are generated based on the Mongoose collection names, e.g. bear is turned into `/bears`, and cave is turned 
into `/caves`.

### Filtering routes ###
There is a basic implementation of filtering available by default in each collection. This allows someone to filter 
items based on the URL. 

For example, searching for just grizzly bears could be done by navigating to the endpoint `/bears/?type=grizzly bear`.

You can also limit results by using `?limit=10` or skip results by using `?skip=10`.

If you want to perform more advanced filtering you can also use Javascript filtering by use `$where` in the URL, 
e.g.: `/bears/?$where=this.type.indexOf("Grizzly")>-1`.

### Customizing controllers ###
The base controller has one function for each operation. In case more advanced features are required for a certain 
controller they can easily be overwritten. 

For example:

```
var BearController = new Controller({
    model: 'Bear'
});

BearController.GET = function(req, res){
    res.send('We dont have any bears yet!');
};
```

# Contribute #
If you are willing to contribute, feel free to open an issue or create a pull request.


## Running tests ##
The tests can be run with ``npm test``. This will start the mocha tests.
