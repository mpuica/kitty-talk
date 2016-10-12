// kitties.js
// =============
var path = require('path');
var async = require('async');
var multer = require('multer');
var easyimg = require('easyimage');
var  _  = require('lodash');
var session = require('client-sessions');

var KittySchema = require('../models/kitty');

// MIME types for image uploads
var exts = {
    'image/jpeg': '.jpg',
    'image/png' : '.png',
    'image/gif' : '.gif'
};

var Kitties = ({

    /**
     * method to signin with the upload of a image
     *
     * @param req
     * @param res
     */
    signInKitty : function (req, res) {
        // Use filename generated for us, plus the appropriate extension
        var filename = req.file.filename + exts[req.file.mimetype],
            // and source and destination filepaths
            src = './' + req.file.path,
            dst = './public/images/' + filename,
            kitty_id = 0;

        async.waterfall(
            [
                function(callback){
                    // Check the mimetype to ensure the uploaded file is an image
                    if (!_.contains(['image/jpeg','image/png','image/gif'],req.file.mimetype)){
                        return callback(new Error(
                            'Invalid file - please upload an image (.jpg, .png, .gif).')
                        )
                    }
                    return callback();
                },
                function(callback){
                    // Get some information about the uploaded file
                    easyimg.info(src).then(
                        function(file){
                            // Check that the image is suitably large
                            if ((file.width < 200) || (file.height < 200)){
                                return callback(new Error('Image must be at least 200 x 200 pixels'));
                            }

                            return callback();
                        }
                    );
                },
                function(callback){
                    //Resize the image to a sensible size
                    easyimg.resize({
                        width: 200,
                        height: 200,
                        src: src,
                        dst: dst
                    }).then(
                        function(image){
                            return callback();
                        }
                    );
                },
                function(callback){
                    //add Kitty to the database
                    var newKitty = new KittySchema({
                        image: filename,
                        crew : [],
                        meows: []
                    });
                    newKitty.save(function(err, doc) {
                        kitty_id = doc._id;
                        req.kittySession.auth_kitty = kitty_id;
                        return callback();
                    });
                }
            ],
            function(err){
                // If an error occurred somewhere along the way, render the error page.
                if (err){
                    return res.json({message : err.message});
                }
                // Otherwise render the logged in Kitty page.
                return Kitties.findKittyById(req, res, kitty_id);
            }
        );
    },
    /**
     * method to fetch the selected kitty page from the request
     *
     * @param req
     * @param res
     *
     * @returns {*}
     */
    findKitty : function (req, res) {
        var kitty_id = req.params.id;
        return Kitties.findKittyById(req, res, kitty_id);
    },
    /**
     * method to fetch the selected kitty page
     *
     * @param req
     * @param res
     * @param kitty_id
     *
     * @returns {*}
     */
    findKittyById : function (req, res, kitty_id) {
        KittySchema.findById(kitty_id, function (err, kitty) {
            if(err) {
                return res.json({'ERROR': err});
            }

            KittySchema.find({'_id': { $in: kitty.crew } }, function(err, crew){
                if(err) {
                    return res.json({'ERROR': err});
                }
                return res.json({kitty : kitty, crew: crew});
            });
        });
    },

    /**
     * method to fetch all the Kitties
     *
     * @param req
     * @param res
     *
     * @returns {*}
     */
    findAllKitties : function (req, res) {
        KittySchema.find(function(err, kitties) {
            if(err) {
                res.json({'ERROR': err});
            } else {
                res.json({kitties : kitties});
            }
        });
        return this;
    },

    /**
     * method to add a kitty to signed in kitty crew
     *
     * @param req
     * @param res
     *
     * @returns {*}
     */
    addKittyToCrew : function (req, res) {
        var auth_kitty_id = req.kittySession.auth_kitty;
        var crew_kitty_id = req.params.id;
        KittySchema.findById(auth_kitty_id, function (err, kitty) {
            if(err) {
                return res.json({'ERROR': err});
            }
            kitty.crew.push(crew_kitty_id);
            kitty.save(function(err) {
                if (err){
                    return res.json({message : err.message});
                }
                return Kitties.findKittyById(req, res, auth_kitty_id);
            });
        });

    },

    /**
     * method to remove a kitty  from the signed in kitty crew
     *
     * @param req
     * @param res
     *
     * @returns {*}
     */
    removeKittyFromCrew : function (req, res) {
        var auth_kitty_id = req.kittySession.auth_kitty;
        var crew_kitty_id = req.params.id;
        KittySchema.findById(auth_kitty_id, function (err, kitty) {
            if(err) {
                return res.json({'ERROR': err});
            }
            kitty.crew.remove(crew_kitty_id);
            kitty.save(function(err) {
                if (err){
                    return res.json({message : err.message});
                }
                return Kitties.findKittyById(req, res, auth_kitty_id);
            });
        });

    },
});

module.exports = Kitties;