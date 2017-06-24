var Pool = require('pg-pool');
var config = {
  user: 'spotter_client', //env var: PGUSER
  database: 'spotter', //env var: PGDATABASE
  password: 'spotter_client', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: process.env.PORT || 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}
var pool = new Pool(config);

function getLocations(callback) {
  pool.connect(function () {
    pool.query('SELECT * FROM locations WHERE isPublic=true', function (err, data) {
      if (err) {
        throw err;
      }
      var locations = data.rows;
      callback(null, locations);
    })
  })
}

function getLocationById(id, callback) {
  pool.connect(function () {
    pool.query('SELECT * FROM locations WHERE id=' + id, function (err, data) {
      if (err) {
        throw err;
      }
      var result = data.rows[0];
      callback(null, result);
    })
  })
}

function getLocationsByCategoryId(id, callback) {
  pool.connect(function () {
    pool.query('SELECT l.* FROM locations_categories lc JOIN locations l ON lc.locationId = l.id WHERE lc.categoryId=' + id + ';', function (err, data) {
      if (err) {
        throw err;
      }
      var result = data.rows;
      callback(null, result);
    });
  })
}

function createLocation(title, description, lat, lon, isPublic, authorId, callback) {
  pool.connect(function () {
    var query = "INSERT INTO locations(title, description, lat, lon, isPublic, authorId) values ('" + title + "', '" + description + "', " + lat + ", " + lon + ", " + isPublic + ", " + authorId + ") RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err;
      }
      var result = data.rows[0];
      callback(null, result);
    })
  })
}

function updateLocation(id, title, description, isPublic, callback) {
  pool.connect(function () {
    var query = "UPDATE locations SET (title, description, isPublic) = ('" + title + "', '" + description + "', " + isPublic + ") WHERE id = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err;
      }
      id = data.rows[0];
      callback(null, id);
    })
  })
}

function deleteLocation(id, callback) {
  pool.connect(function () {
    var query = "DELETE FROM locations WHERE id = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err;
      }
      var id = data.rows[0];
      callback(null, id);
    })
  })
}

function getCategories(callback) {
  pool.connect(function () {
    var query = "SELECT * FROM categories;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows
      callback(null, result)
    })
  })
}

function createCategory(title, callback) {
  pool.connect(function () {
    var query = "INSERT INTO categories(title) values ('" + title + "') RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

function deleteCategory(id, callback) {
  pool.connect(function () {
    var query = "DELETE FROM categories WHERE id = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

function getFavoritesForUser(id, callback) {
  pool.connect(function () {
    var query = "SELECT l.* FROM favorites f JOIN locations l ON f.locationId = l.id WHERE f.userId = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows
      callback(null, result)
    })
  })
}

function deleteFavorite(id, callback) {
  pool.connect(function () {
    var query = "DELETE FROM favorites WHERE id = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

function addFavorite(userId, locationId, callback) {
  pool.connect(function () {
    var query = "INSERT INTO favorites (userId, locationId) VALUES (" + userId + ", " + locationId + ") RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

function addLocationCategory(locationId, categoryId, callback) {
  pool.connect(function () {
    var query = "INSERT INTO locations_categories (locationId, categoryId) VALUES (" + locationId + ", " + categoryId + ") RETURNING id;"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

function deleteLocationCategory(id, callback) {
  pool.connect(function () {
    var query = "DELETE FROM locations_categories WHERE id = " + id + ";"
    pool.query(query, function (err, data) {
      if (err) {
        throw err
      }
      var result = data.rows[0]
      callback(null, result)
    })
  })
}

module.exports = {
  getLocations: getLocations,
  getLocationById: getLocationById,
  getLocationsByCategoryId: getLocationsByCategoryId,
  createLocation: createLocation,
  updateLocation: updateLocation,
  deleteLocation: deleteLocation,
  getCategories: getCategories,
  createCategory: createCategory,
  deleteCategory: deleteCategory,
  getFavoritesForUser: getFavoritesForUser,
  deleteFavorite: deleteFavorite,
  addFavorite: addFavorite,
  addLocationCategory: addLocationCategory,
  deleteLocationCategory: deleteLocationCategory
}
