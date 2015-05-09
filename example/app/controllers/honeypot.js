var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    morest = require('../../../src/morest'),
    Controller = morest.Controller;

var HoneypotSchema = new Schema({
    name: {type: String, required: true},
    color: String
});

mongoose.model('Honeypot', HoneypotSchema);

var HoneypotController = new Controller({
    model: 'Honeypot'
});

//Example function to prepare data
HoneypotController.prepData = function () {
    var model = mongoose.model(this.model);

    //Create two honeypots
    return model.create([{
        name: 'Tiger honeypot',
        color: 'Orange'
    }, {
        name: 'Whale honeypot',
        color: 'Blue'
    }]);
};

module.exports = HoneypotController;