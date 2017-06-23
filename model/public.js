const {
  Pool
} = require('pg');
var config = {
  user: 'spotter_client', //env var: PGUSER
  database: 'spotter', //env var: PGDATABASE
  password: 'spotter_client', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}

function getLocations(callback) {
  var pool = new Pool(config);
  pool.connect(function (e) {
    pool.query('SELECT * FROM locations WHERE isPublic=true', function (err, data) {
      if (err) {
        throw err;
      }
      locations = data.rows;
      callback(null, locations);
    })
  })
}

function getLocationById(id, callback) {
  var pool = new Pool(config);
  pool.connect(function (e) {
    pool.query('SELECT * FROM locations WHERE id=' + id, function (err, data) {
      if (err) {
        throw err;
      }
      location = data.rows[0];
      callback(null, location);
    })
  })
}

function getLocationsByCategoryId(id, callback) {
  var pool = new Pool(config);
  pool.connect(function (e) {
    pool.query('SELECT l.* FROM locations_categories lc JOIN locations l ON lc.locationId = l.id WHERE lc.categoryId=' + id + ';', function (err, data) {
      if (err) {
        throw err;
      }
      location = data.rows;
      callback(null, location);
    });
  })
}

function createLocation(title, description, lat, lon, isPublic, authorId, callback) {
  var pool = new Pool(config);
  pool.connect(function (e) {
    var query = "INSERT INTO locations(title, description, lat, lon, isPublic, authorId) values ('" + title + "', '" + description + "', " + lat + ", " + lon + ", " + isPublic + ", " + authorId + ") RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err;
      }
      location = data.rows[0];
      callback(null, location);
    })
  })
}

function updateLocation(id, name, description, isPublic, callback){
  var pool = new Pool(config);
  pool.connect(function (e) {
    var query = "UPDATE locations SET (title, description, isPublic) values ('" + title + "', '" + description + "', " + isPublic + ") WHERE id = " + id + "RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err;
      }
      location = data.rows[0];
      callback(null, location);
    })
  })
}

module.exports = {
  getLocationById: getLocationById,
  getLocationsByCategoryId: getLocationsByCategoryId,
  createLocation: createLocation,
  updateLocation: updateLocation
}