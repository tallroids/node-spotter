var express = require('express');
var router = express.Router();
var ums = require('../model/ums');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
  if (typeof (req.session.userId) != 'undefined') {
    res.redirect('/home')
  } else {
    res.render('index', {
      user: "Test",
      loggedIn: false
    });
  }
});

router.get('/register', function (req, res, next) {
  res.render('register', {
    loggedIn: false
  });
});

router.get('/login', function (req, res, next) {
  res.render('login', {
    loggedIn: false,
    message: null
  });
});

router.post('/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var user = ums.login(username, password, function (err, user) {
    if (user.success === true) {
      req.session.userId = user.id
      req.session.fname = user.fname
      res.json(user)
    } else {
      res.json(user)
    }
  });
});

router.post('/registerUser', function (req, res, next) {
  var fname = req.body.fname
  var lname = req.body.lname
  var email = req.body.email
  var confPass = req.body.confPass
  var pass = req.body.pass
  if (pass == confPass) {
    bcrypt.hash(req.body.pass, saltRounds, function (err, hash) {
      ums.registerUser(fname, lname, email, hash, function (err, response) {
        if (response.id != null) {
          res.render('login', {
            loggedIn: false,
            message: "Successfully Registered, " + response.fname + ", please log in"
          });
        }
      });
    });
  } else {
    res.sendStatus(400)
  }
})

router.get('/getUserById/:id', function (req, res, next) {
  var id = req.params.id;
  var user = model.getUserById(id, userOps);

  function userOps(err, data) {
    res.json({
      'test': data
    });
  }
});

router.get('/home', function (req, res, next) {
  if (typeof (req.session.userId) != 'undefined') {
    res.render('home', {
      loggedIn: true
    })
  } else {
    res.redirect('/')
  }
})

router.get('/favorites', function (req, res, next) {
  if (typeof (req.session.userId) != 'undefined') {
    res.render('favorites', {
      loggedIn: true
    })
  } else {
    res.redirect('/')
  }
})

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/')
  })
})

module.exports = router;
