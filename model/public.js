const Pool = require('pg-pool');
const url = require('url');
const params = url.parse(process.env.DATABASE_URL || 'postgres://spotter_client:spotter_client@127.0.0.1:5432/spotter');
const auth = params.auth.split(':');
const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
}
if(params.pathname.split('/')[1] == 'spotter'){
  config.ssl = false;
}
const pool = new Pool(config);

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

function createLocation(title, description, lat, lng, isPublic, authorId, callback) {
  pool.connect(function () {
    var query = "INSERT INTO locations(title, description, lat, lng, isPublic, authorId) values ('" + title + "', '" + description + "', " + lat + ", " + lng + ", " + isPublic + ", " + authorId + ") RETURNING id;"
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
    var query = "UPDATE locations SET (title, description, isPublic) = ('" + title + "', '" + description + "', " + isPublic + ") WHERE id = " + id + " RETURNING id;"
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

function getFavorites(req, callback) {
  console.log(req.session.userId)
  pool.connect(function () {
    var query = "SELECT l.* FROM favorites f JOIN locations l ON f.locationId = l.id WHERE f.userId = " + req.session.userId + ";"
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
  getFavorites: getFavorites,
  deleteFavorite: deleteFavorite,
  addFavorite: addFavorite,
  addLocationCategory: addLocationCategory,
  deleteLocationCategory: deleteLocationCategory
}
