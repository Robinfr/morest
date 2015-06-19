var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var server = require('./server_mock');

describe('Operations', function () {
    beforeEach(function (done) {
        mongoose.model('Cave').remove({}, done);
    });

    beforeEach(function (done) {
        var CaveController = require('../example/app/controllers/cave');
        CaveController.prepData().then(function () {
            done();
        });
    });

    it('should GET_ALL', function (done) {
        request(server)
            .get('/api/caves')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should GET', function (done) {
        //Get id first
        mongoose.model('Cave').findOne({}).exec().then(function (cave) {
            var id = cave._id;

            //Perform test
            request(server)
                .get('/api/caves/' + id)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    it('should POST', function (done) {
        request(server)
            .post('/api/caves')
            .send({size: 5})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.size, 5);
                done();
            });
    });

    it('should PUT', function (done) {
        //Get id first
        mongoose.model('Cave').findOne({}).exec().then(function (cave) {
            var id = cave._id;

            //Perform test
            request(server)
                .put('/api/caves/' + id)
                .send({size: 12})
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    it('should DELETE', function (done) {
        //Get id first
        mongoose.model('Cave').findOne({}).exec().then(function (cave) {
            var id = cave._id;

            //Perform test
            request(server)
                .delete('/api/caves/' + id)
                .expect(200)
                .end(function (err) {
                    if (err) return done(err);

                    //Check amount of models
                    mongoose.model('Cave').find().exec().then(function (caves) {
                        assert.equal(caves.length, 1);
                        done();
                    });
                });
        });
    });
});