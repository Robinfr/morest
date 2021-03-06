var mongoose = require('mongoose');

var Controller = function (opts) {
    //Parse all the options
    this.availableOperations = opts.availableOperations || ['GET_ALL', 'GET', 'POST', 'PUT', 'DELETE'];
    this.model = opts.model || null;

    this._mongooseModel = null;
};

Controller.prototype = {
    ALL: function (req, res, next) {
        next();
    },

    GET_ALL: function (req, res) {
        if (this._mongooseModel === null) {
            throw new Error('[Morest] Controller does not have access to a Mongoose instance');
        }

        var limit = 0,
            skip = 0;

        //Limit
        if (req.query.hasOwnProperty('limit')) {
            limit = req.query['limit'];
            delete req.query['limit'];
        }

        //Skip
        if (req.query.hasOwnProperty('skip')) {
            skip = req.query['skip'];
            delete req.query['skip'];
        }

        var query = this._mongooseModel.find(req.query);

        if (limit > 0) {
            query.limit(limit);
        }

        if (skip > 0) {
            query.skip(skip);
        }

        query.exec(function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        });
    },

    GET: function (req, res) {
        if (this._mongooseModel === null) {
            throw new Error('[Morest] Controller does not have access to a Mongoose instance');
        }

        this._mongooseModel.findById(mongoose.Types.ObjectId(req.params.id), function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    },

    POST: function (req, res) {
        if (this._mongooseModel === null) {
            throw new Error('[Morest] Controller does not have access to a Mongoose instance');
        }

        var item = new this._mongooseModel();

        for (var key in req.body) {
            item[key] = req.body[key];
        }

        item.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(item);
            }
        });
    },

    PUT: function (req, res) {
        if (this._mongooseModel === null) {
            throw new Error('[Morest] Controller does not have access to a Mongoose instance');
        }

        this._mongooseModel.findById(mongoose.Types.ObjectId(req.params.id), function (err, result) {
            if (err) {
                res.send(err);
            } else {
                for (var key in req.body) {
                    result[key] = req.body[key];
                }

                result.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    },

    DELETE: function (req, res) {
        if (this._mongooseModel === null) {
            throw new Error('[Morest] Controller does not have access to a Mongoose instance');
        }

        this._mongooseModel.findById(mongoose.Types.ObjectId(req.params.id), function (err, result) {
            if (err) {
                res.send(err);
            } else {
                result.remove(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    },

    getBaseRoute: function () {
        return this._mongooseModel.collection.name.toLowerCase();
    },

    setMongooseInstance: function (mongoose) {
        this._mongooseModel = mongoose.model(this.model);
    }
};

module.exports.Controller = Controller;

var Morest = function (router, mongoose, opts) {
    this.controllers = opts.controllers || []; //Define the controllers
    this.baseRoute = opts.baseRoute || '/'; //Define a base router from which all routes extend, e.g. '/api/'

    if (router === null || typeof router === 'undefined') {
        throw new Error('[Morest] Router not defined');
    }

    if (mongoose === null || typeof mongoose === 'undefined') {
        throw new Error('[Morest] Mongoose not defined');
    }

    //Generate routes
    for (var c = 0; c < this.controllers.length; c++) {
        var controller = this.controllers[c];

        controller.setMongooseInstance(mongoose);

        router.all(this.baseRoute + controller.getBaseRoute(), controller.ALL.bind(controller));

        if (controller.availableOperations.indexOf('GET_ALL') > -1) {
            //GET_ALL
            router.get(this.baseRoute + controller.getBaseRoute(), controller.GET_ALL.bind(controller));
        }

        if (controller.availableOperations.indexOf('GET') > -1) {
            //GET
            router.get(this.baseRoute + controller.getBaseRoute() + '/:id', controller.GET.bind(controller));
        }

        if (controller.availableOperations.indexOf('POST') > -1) {
            //POST
            router.post(this.baseRoute + controller.getBaseRoute(), controller.POST.bind(controller));
        }

        if (controller.availableOperations.indexOf('PUT') > -1) {
            //PUT
            router.put(this.baseRoute + controller.getBaseRoute() + '/:id', controller.PUT.bind(controller));
        }

        if (controller.availableOperations.indexOf('DELETE') > -1) {
            //DELETE
            router.delete(this.baseRoute + controller.getBaseRoute() + '/:id', controller.DELETE.bind(controller));
        }
    }

    return router;
};

module.exports.Morest = Morest;
