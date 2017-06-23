var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getUserById/:id', function(req, res, next){
  var id = req.params.id;
  var user = model.getUserById(id, userOps);
  function userOps(err, data){
    res.json({'test':data});
  }
});
router.post('/login', function(req, res, next){
  var username = req.post.username;
  var id = req.params.id;
  var user = model.login(username, password, userOps);
  function userOps(err, data){
    res.json({'test':data});
  }
});
module.exports = router;
