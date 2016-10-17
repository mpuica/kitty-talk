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

    var testKitty = null;
    var crewKitty = null;

    before(function(done){

        KittySchema.collection.drop();
        MeowSchema.collection.drop();

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
            testKitty = doc._id;
        });

        var newKitty3 = new KittySchema({
            image: 'test3.jpg'
        });
        newKitty3.save(function(err, doc) {
            crewKitty = doc._id;
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
        this.timeout(5000);
        setTimeout(function() {
            done();
        }, 4000);

        //done();
    });

    after(function(done){
        KittySchema.collection.drop();
        MeowSchema.collection.drop();

        done();
    });

    describe("Kitty Model", function() {

        describe("Return a Kitty page", function() {
            it("should return a kitty object inside the response containing a Kitty", function(done) {
                chai.request(server)
                    .get('/kitty/' + testKitty)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('kitty');
                        res.body.kitty.should.be.a('object');
                        res.body.kitty.should.have.property('image');
                        done();
                    });
            });

            it("should return a crew object inside the response containing an array", function(done) {
                chai.request(server)
                    .get('/kitty/' + testKitty)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('crew');
                        res.body.crew.should.be.a('array');
                        done();
                    });
            });
        });

        describe("Return all Kitties", function() {
            it("should return an object kitties which contains an array of kitty objects", function(done) {
                chai.request(server)
                    .get('/kitties')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('kitties');
                        res.body.kitties.should.be.a('array');
                        res.body.kitties[0].should.be.a('object');
                        res.body.kitties[0].should.have.property('image');
                        done();
                    });
            });
        });

        describe("Add a Kitty to crew", function() {
            it("should return a kitty object inside the response containing a Kitty with two crew members", function(done) {
                chai.request(server)
                    .get('/crew/add/' + crewKitty)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('kitty');
                        res.body.should.have.property('crew');
                        res.body.kitty.should.be.a('object');
                        res.body.kitty.should.have.property('image');
                        res.body.should.have.property('crew');
                        res.body.crew.should.be.a('array');
                        done();
                    });
            });

        });

        describe("Remove a Kitty from crew", function() {
            it("should return a kitty object inside the response containing a Kitty with one crew members", function(done) {
                chai.request(server)
                    .get('/crew/remove/' + crewKitty)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('kitty');
                        res.body.should.have.property('crew');
                        res.body.kitty.should.be.a('object');
                        res.body.kitty.should.have.property('image');
                        res.body.should.have.property('crew');
                        res.body.crew.should.be.a('array');
                        done();
                    });
            });
        });
    });

    describe("Meow Model", function() {

        describe("Get kitty and crew mewos ", function() {
            it("should return an meows object containing an array of kitty meows", function(done) {
                chai.request(server)
                    .get('/meows/' + testKitty)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('meows');
                        res.body.meows.should.be.a('array');
                        done();
                    });
            });
        });

        describe("Add a meow", function() {
            it("should add a single meow returning an meows object containing an array of kitty meows including the one we add", function(done) {
                var testText = 'this is a just a test meow';
                chai.request(server)
                    .post('/meows')
                    .send({'auth_kitty': textKitty, 'text': testText})
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('SUCCESS');
                        res.body.SUCCESS.should.be.a('object');
                        res.body.SUCCESS.should.have.property('meows');
                        res.body.SUCCESS.meows.should.be.a('array');
                        var meows_lenght = res.body.SUCCESS.meows.length;
                        res.body.SUCCESS.meows[meows_lenght].should.have.property('text');
                        res.body.SUCCESS.meows[meows_lenght].text.should.equal(testText);
                        done();
                    });
            });
        });

    });

});
