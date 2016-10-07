process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var expect = chai.expect();
var should = chai.should();

//we load the models for testing
var KittySchema = require("../app/models/kitty");
var MeowSchema = require("../app/models/meow");

//we load the modules for testing
var Kitties = require("../app/modules/kitties");
var Meows = require("../app/modules/meows");

chai.use(chaiHttp);

describe("Kitty-Talk Testing", function() {
    KittySchema.collection.drop();
    MeowSchema.collection.drop();

    beforeEach(function(done){
        //we add dummy kitties
        var newKitty1 = new KittySchema({
            image: 'test1.jpg'
        });
        newKitty1.save(function(err, doc) {
        });
        var newKitty2 = new KittySchema({
            image: 'test2.jpg',
            crew: [newKitty1]
        });
        newKitty2.save(function(err, doc) {
        });
        var newKitty3 = new KittySchema({
            image: 'test3.jpg'
        });
        newKitty3.save(function(err, doc) {
        });
        //we add dummy meows
        var newMeow1 = new MeowSchema({
            kitty: newKitty1,
            text: 'Meow 1 of Kitty 1'
        });
        newMeow1.save(function(err, doc) {
        });
        var newMeow2 = new MeowSchema({
            kitty: newKitty1,
            text: 'Meow 2 of Kitty 1'
        });
        newMeow2.save(function(err, doc) {
        });
        var newMeow3 = new MeowSchema({
            kitty: newKitty1,
            text: 'Meow 2 of Kitty 1'
        });
        newMeow3.save(function(err, doc) {
        });
        var newMeow4 = new MeowSchema({
            kitty: newKitty2,
            text: 'Meow 4 of Kitty 2'
        });
        newMeow4.save(function(err, doc) {
        });
        var newMeow5 = new MeowSchema({
            kitty: newKitty3,
            text: 'Meow 5 of Kitty 3'
        });
        newMeow5.save(function(err, doc) {
        });
        done();
    });

    afterEach(function(done){
        KittySchema.collection.drop();
        MeowSchema.collection.drop();
        done();
    });

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

        describe("Return all Kitties", function() {
            it("should return an array of kitty objects", function(done) {
                chai.request(server)
                    .get('/kitty/all')
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

});
