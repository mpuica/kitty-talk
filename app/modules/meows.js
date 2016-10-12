// meows.js
// =============
var path = require('path');

var MeowSchema = require('../models/meow');
var KittySchema = require('../models/kitty');

var Meows = ({

    /**
     * method to fetch all the Kitty meows from request
     * @param req
     * @param res
     *
     * @returns {*}
     */
    findKittyMeows : function (req, res) {
        var kitty_id = req.params.id;
        return Meows.findKittyMeowsById(req, res, kitty_id);
    },

    /**
     * method to fetch all the Kitty meows from id
     *
     * @param req
     * @param res
     * @param id
     *
     * @returns {*}
     */
    findKittyMeowsById : function (req, res, id) {

        KittySchema.findById(id, function (err, kitty) {
            if(err) {
                return res.json({'ERROR': err});
            }
            KittySchema.find({'_id': { $in: kitty.crew } }, function(err, crew){
                if(err) {
                    return res.json({'ERROR': err});
                }
                // add  selected kitty to crew to get all the meows
                crew.push(id);
                MeowSchema.find({'kitty' : { $in : crew } }).sort({date: 'desc'}).exec(function(err, meows){
                    if(err) {
                        return res.json({'ERROR': err});
                    }
                    return res.json({meows: meows});
                });
            });
        });
    },

    findMeowById : function () {
        return this;
    },

    addMeow : function (req, res) {
        var auth_kitty_id = req.kittySession.auth_kitty;
        var newMeow = new MeowSchema({
            kitty : auth_kitty_id,
            text: req.body.meow
        });
        newMeow.save(function(err, doc) {
            meow_id = doc._id;
            if (err){
                return res.json({message : err.message});
            }

            return Meows.findKittyMeowsById(req, res, auth_kitty_id);
        });
    }

});

module.exports = Meows;