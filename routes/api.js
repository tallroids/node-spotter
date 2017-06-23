var express = require('express');
var router = express.Router();
var model = require('../model/public');

/* GET api calls. */
router.get('/', function (req, res, next) {
  res.redirect('../api_docs.html');
});

router.get('/getLocations', function (req, res, next) {
  model.getLocations(function (err, data) {
    res.json(data);
  })
})

router.get('/getLocationById/:id', function (req, res, next) {
  var id = req.params.id
  model.getLocationById(id, function (err, data) {
    res.json(data);
  })
})

router.get('/getLocationsByCategoryId/:id', function (req, res, next) {
  var id = req.params.id
  model.getLocationsByCategoryId(id, function (err, data) {
    res.json(data);
  })
})

router.post('/createLocation', function (req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var lat = req.body.lat;
  var lon = req.body.lon;
  var isPublic = req.body.isPublic;
  var authorId = req.body.authorId;
  model.createLocation(title, description, lat, lon, isPublic, authorId, function (err, data) {
    res.json(data);
  })
})

router.put('/updateLocation', function(req, res, next){
  var id = req.body.id;
  var name = req.body.name;
  var description = req.body.description;
  var isPublic = req.body.isPublic;
  model.updateLocation(id, name, description, isPublic, function(err, data){
    res.json(data);
  })
})

module.exports = router;
