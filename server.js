// server.js

// set up ======================
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var routes = require('./app/routes/routes.js');
var session = require('client-sessions');

// configuration ================
var config = require('./config/config');
var port = process.env.PORT || 8081;

var app = express();
app.use(express.static(__dirname + '/public'));

// db connect ====================
mongoose.connect(config.mongourl[app.settings.env]);

// session =======================
app.use(session({
    cookieName: 'kittySession',
    secret: 'a_big_big_secret',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

// routes ========================
app.use('/', routes);

// application ===================
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// listen ========================
app.listen(port);
console.log('Magic happens on port %d', port);
module.exports = app;
