var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    morest = require('../../../src/morest'),
    Controller = morest.Controller;

//Make sure the models are loaded
require('./honeypot');
require('./cave');

var BearSchema = new Schema({
    name: {type: String, required: true},
    type: String,
    honeypot: {type: mongoose.Schema.Types.ObjectId, ref: 'Honeypot'},
    caves: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cave'}]
});

mongoose.model('Bear', BearSchema);

var BearController = new Controller({
    model: 'Bear',
    availableOperations: [
        'GET_ALL',
        'GET',
        'POST',
        'DELETE'
    ]
});

//Example function to prepare data
BearController.prepData = function () {
    //We will use promises to make sure everything happens in the correct order
    var model = mongoose.model(this.model);

    var honeypots,
        caves;

    return mongoose.model('Honeypot').find().exec()
        .then(function (honeypotModels) {
            honeypots = honeypotModels;

            return mongoose.model('Cave').find().exec();
        })
        .then(function (caveModels) {
            caves = caveModels;

            return model.create([
                {
                    name: 'Mr. Klaus',
                    type: 'Rainbow bear',
                    honeypot: honeypots[0]._id,
                    caves: [caves[0]._id, caves[1]._id]
                },
                {
                    name: 'Mrs. Klaus',
                    type: 'Grizzly bear',
                    honeypot: honeypots[1]._id,
                    caves: [caves[0]._id, caves[1]._id]
                }
            ])
        });
};

module.exports = BearController;