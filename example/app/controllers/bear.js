var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    morest = require('../../../src/morest'),
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