process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var expect = chai.expect();
var should = chai.should();

//we load the models for testing
var Kitty = require("../app/models/kitty");
var Meow = require("../app/models/meow");

//we load the modules for testing
var Kitties = require("../app/modules/kitties");
var Meows = require("../app/modules/meows");

chai.use(chaiHttp);

describe("Meow Model", function() {

    describe("Return a single meow", function() {
        var testId =  1;
        it("should return a Meow object", function(done) {
            chai.request(server)
                .get('/meow/' + testId)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('kitty');
                    res.body.should.have.property('text');
                    res.body.should.have.property('_id');
                    res.body.should.equal(testId);
                    done();
                });
        });
    });

    describe("Return kitty meows, including crew meows", function() {
        it("should return an array of meows", function(done) {
            chai.request(server)
                .get('/meows')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe("Add a meow", function() {
        it("should add a single meow", function(done) {
            var testText = 'this is a just a test meow';
            chai.request(server)
                .post('/meow')
                .send({'text': testText})
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('SUCCESS');
                    res.body.SUCCESS.should.be.a('object');
                    res.body.SUCCESS.should.have.property('text');
                    res.body.SUCCESS.should.have.property('_id');
                    res.body.SUCCESS.name.should.equal(testText);
                    done();
                });
        });
    });

});

describe("Kitty Model", function() {

    describe("Return logged Kitty homepage", function() {
        it("should return a kitty object", function(done) {
            chai.request(server)
                .get('/kitty')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('kitty');
                    res.body.should.have.property('_id');
                    done();
                });
        });
    });

    describe("Return a Kitty page", function() {
        it("should return a kitty object", function(done) {
            var testId = 1;
            chai.request(server)
                .get('/kitty/' + testId)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('kitty');
                    res.body.should.have.property('_id');
                    done();
                });
        });
    });

    describe("Return non-crew Kitties", function() {
        it("should return an array of kitty objects", function(done) {
            chai.request(server)
                .get('/kitty/others')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    //@todo : add here test for one of the items to be a kitty object
                    done();
                });
        });
    });

    describe("Return crew Kitties", function() {
        it("should return an array of kitty objects", function(done) {
            chai.request(server)
                .get('/kitty/crew')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    //@todo : add here test for one of the items to be a kitty object
                    done();
                });
        });
    });

    describe("Add a Kitty to crew", function() {
        //@todo : not sure yet if use a post or get
    });

    describe("Remove a Kitty from crew", function() {
        //@todo : not sure yet if use a post or get
    });
});