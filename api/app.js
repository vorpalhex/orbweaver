'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var cors = require('cors');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(cors());
  //app.use(express.static('./api/swagger'));

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);

});
