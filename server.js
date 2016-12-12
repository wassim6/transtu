var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./app/config/config.js'); // get our config file

var apiRoutes = require('./app/config/routes'); // bring in API routes


// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080;
mongoose.connect(config.database); // connect to database
//app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));


// use morgan to log requests to the console
app.use(morgan('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// this is the entry way into the client-side
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/user/index.html');
});
app.get('/admin', function(request, response) {
  response.sendFile(__dirname + '/public/admin/index.html');
});



app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
