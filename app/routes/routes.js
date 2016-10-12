// routes.js
// =============
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var Meows = require('../modules/meows');
var Kitties = require('../modules/kitties');


router.post('/signin', upload.single('file'), Kitties.signInKitty);

router.get('/kitty/:id', Kitties.findKitty);
router.get('/kitties', Kitties.findAllKitties);
router.get('/crew/add/:id', Kitties.addKittyToCrew);
router.get('/crew/remove/:id', Kitties.removeKittyFromCrew);


router.get('/meows/:id', Meows.findKittyMeows);
router.post('/meows', Meows.addMeow);
router.get('/meow/:id', Meows.findMeowById);

module.exports = router;

