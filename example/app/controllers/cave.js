var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    morest = require('../../../src/morest'),
    Controller = morest.Controller;

var CaveSchema = new Schema({
    size: Number
});

mongoose.model('Cave', CaveSchema);

var CaveController = new Controller({
    model: 'Cave'
});

//Example function to populate data
//Example function
CaveController.prepData = function () {
    var model = mongoose.model(this.model);

    //Create two caves
    return model.create([{
        size: 2
    }, {
        size: 3
    }]);
};

module.exports = CaveController;