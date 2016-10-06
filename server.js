// server.js

// set up ======================
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var routes = require('./app/routes/routes.js');

// configuration ================
var config = require('./config/config');
var port = process.env.PORT || 8081;

var app = express();
app.use(express.static(__dirname + '/public'));

// db connect ====================
mongoose.connect(config.mongourl);

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
