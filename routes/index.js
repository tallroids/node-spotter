var express = require('express');
var router = express.Router();
var ums = require('../model/ums');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('registerUser', function (req, res, next) {
  var fname = req.body.fname
  var lname = req.body.lname
  var email = req.body.email
  var pass = req.body.pass
  var confPass = req.body.confPass
  ums.register(fname, lname, email, pass, function (err, response) {
    if (response.id != null) {
      res.render('login', {
        message: "Successfully Registered, " + response.fname + ", please log in"
      });
    }
  });
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

router.post('/login', function (req, res, next) {
  var username = req.post.username;
  var id = req.params.id;
  var user = model.login(username, password, userOps);

  function userOps(err, data) {
    res.json({
      'test': data
    });
  }
});

module.exports = router;
