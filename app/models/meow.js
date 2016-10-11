// meow.js - Model
// =============
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var KittySchema = require('./kitty');

var MeowSchema = new Schema();
MeowSchema.add({
    //_id: ObjectId,
    kitty: {type: mongoose.Schema.Types.ObjectId, ref: 'kitty'},
    date: { type : Date, default: Date.now },
    text: String
});

module.exports = mongoose.model('meow', MeowSchema);