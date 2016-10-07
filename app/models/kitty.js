// kitty.js - Model
// =============
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var MeowSchema = require('./meow');

var KittySchema = new Schema();

KittySchema.add({
    //_id : ObjectId,
    image: String,
    crew: [ {type: mongoose.Schema.Types.ObjectId, ref: 'kitty'} ],
    meows: [ {type: mongoose.Schema.Types.ObjectId, ref: 'meow'} ]
});

module.exports = mongoose.model('kitty', KittySchema);