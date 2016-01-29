var express = require('express');
var app = express();

app.use(express.static('.'));

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Server for test is running，please visit: http://127.0.0.1:%s", port);

})