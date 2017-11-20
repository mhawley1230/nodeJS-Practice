// import modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('customerapp', ['users']);

// import express dependency
const app = express();

// // also middleware
// var logger = function(req, res, next){
//   console.log('Logging...');
//   next();
// }
//
// app.use(logger);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Global Vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

// Express Validator Middleware
app.use(expressValidator());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({entended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  db.users.find(function (err, docs) {
     res.render('index', {
       title: 'Customers',
       users: docs
     });
  });
});

app.post('/user/add', function(req, res) {

  req.checkBody('first_name', 'User must have a First Name').notEmpty();
  req.checkBody('last_name', 'User must have a Last Name').notEmpty();
  req.checkBody('email', 'User must have an Email').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }

    db.users.insert(newUser, function(err, result) {
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });
  }
});

app.delete('/users/delete/:id', function(req, res) {
  db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, function() {
  console.log('Server started on port 3000...')
});
