var express = require('express');
var router = express.Router();
var model = require('../model/public');

router.get('/', function (req, res, next) {
  res.redirect('../api_docs.html');
});

router.get('/getLocations', function (req, res, next) {
  model.getLocations(function (err, data) {
    res.json({locations: data, success: true});
  })
})

router.get('/getLocationById/:id', function (req, res, next) {
  var id = req.params.id
  model.getLocationById(id, function (err, data) {
    res.json({location: data, success: true});
  })
})

router.get('/getLocationsByCategoryId/:id', function (req, res, next) {
  var id = req.params.id
  model.getLocationsByCategoryId(id, function (err, data){
    console.log(data)
    res.json({locations: data, success:true});
  })
})

router.post('/createLocation', function (req, res, next) {
  console.log(req.body)
  var title = req.body.title;
  var description = req.body.description;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var isPublic = req.body.isPublic;
  var authorId = req.session.userId;
  console.log(title, description, lat, lng, isPublic, authorId)
  model.createLocation(title, description, lat, lng, isPublic, authorId, function (err, data) {
    res.json({success: true});
  })
})

router.put('/updateLocation', function(req, res, next){
  var id = req.body.id;
  var title = req.body.title;
  var description = req.body.description;
  var isPublic = req.body.isPublic;
  model.updateLocation(id, title, description, isPublic, function(err, data){
    res.json({success: true, data:id});
  })
})

router.delete('/deleteLocation/:id', function(req, res, next){
  var id = req.params.id;
  model.deleteLocation(id, function(err, data){
    res.json({success: true});
  })
})

router.delete('/deleteLocation/:id', function(req, res, next){
  var id = req.params.id;
  model.deleteLocation(id, function(err, data){
    res.end({success: true});
  })
})

router.get('/getCategories', function (req, res, next) {
  model.getCategories(function (err, data) {
    res.json({categories: data, success: true});
  })
})

router.post('/createCategory', function (req, res, next) {
  var title = req.body.title
  model.createCategory(title, function (err, data) {
    res.json(data);
  })
})

router.delete('/deleteCategory/:id', function(req, res, next){
  var id = req.params.id;
  model.deleteCategory(id, function(err, data){
    res.json(data);
  })
})

router.get('/getFavorites', function (req, res, next) {
  model.getFavorites(req, function (err, data) {
    res.json({locations:data, success:true});
  })
})

router.post('/addFavorite', function (req, res, next) {
  var userId = req.session.userId
  var locationId = req.body.locationId
  model.addFavorite(userId, locationId, function (err, data) {
    res.json({success: true});
  })
})

router.delete('/deleteFavorite/:id', function(req, res, next){
  var id = req.params.id;
  model.deleteFavorite(id, function(err, data){
    res.json(data);
  })
})

router.post('/addLocationCategory', function (req, res, next) {
  var categoryId = req.body.categoryId
  var locationId = req.body.locationId
  model.addLocationCategory(locationId, categoryId, function (err, data) {
    res.json(data);
  })
})

router.delete('/deleteLocationCategory/:id', function (req, res, next) {
  var id = req.params.id;
  model.deleteLocationCategory(id, function (err, data) {
    res.json(data);
  })
})

module.exports = router;
