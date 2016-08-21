'use strict';

var SwaggerExpress = require('swagger-express-mw'); //swagger middleware stack
var express = require('express'); //olde faithful
var app = express();
var server = require('http').Server(app);
var websocket = require('./websocket/server.js')(server);
var cors = require('cors'); //this *should* be in swagger, but doesn't apply to all routes
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(cors()); //make sure we get 404s, and not CORS errors on bad routes

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000; //default to 3000
  server.listen(port);

});
