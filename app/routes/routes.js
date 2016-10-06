// routes.js
// =============
var express = require('express');
var router = express.Router();
var Meows = require('../modules/meows');
var Kitties = require('../modules/kitties');

router.get('/meows/:id', Meows.findAllMeowsOfKitty);
router.post('/meows', Meows.addMeow);
router.get('/meow/:id', Meows.findMeowById);

router.get('/kitty', Kitties.findKittyPage);
router.get('/kitty/:id', Kitties.findKittyById);
router.get('/kitty/crew', Kitties.findCrewKitties);
router.get('/kitty/others', Kitties.findNonCrewKitties);
router.get('/kitty/add/:id', Kitties.addKittyToCrew);
router.get('/kitty/remove/:id', Kitties.removeKittyFromCrew);

module.exports = router;

