const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mustache = require('express-mustache');
const mongoose = require('mongoose');
const session = require('express-session');
mongoose.Promise = require('bluebird');


mongoose.connect('mongodb://localhost:27017/activityTracker');


const index = require('./routes/index');
const api = require('./routes/api');


const application = express();


application.engine('mustache', mustache({ defaultLayout: 'main' }));
application.set('view engine', 'mustache');

application.use('/assets', express.static(path.join(__dirname, 'public')))

// parse applicationlication/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }))

// parse applicationlication/json
application.use(bodyParser.json());

application.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


application.use(function(request,response, next){

  if (!request.session.isAuthenticated){
      request.session.isAuthenticated = false;
  }
  next();
});


application.use('/api', api);
application.use('/', index);


application.listen(3000, function () {
    console.log('Server listening on port 3000');
});