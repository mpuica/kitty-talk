// server.js

// set up ======================
var express = require('express');

var app     = express();
var port    = process.env.PORT || 8081;

app.use(express.static(__dirname + '/public'));

// application ===================
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// listen ========================
app.listen(port);
console.log('Magic happens on port %d', port);
