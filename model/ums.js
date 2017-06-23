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

function getUserById(id, callback){
var pool = new Pool(config);
pool.connect(function (e) {
    pool.query('SELECT * FROM person WHERE id=' + id, function (err, data) {
      if (err) {
        throw err;
      }
      person = data.rows[0];
      callback(null, person);
    })
  })
}

function login(username, password, callback){
var pool = new Pool(config);
pool.connect(function (e) {
    pool.query('SELECT * FROM person WHERE id=' + id, function (err, data) {
      if (err) {
        throw err;
      }
      person = data.rows[0];
      callback(null, person);
    })
  })
}


module.exports = {
  getUserById: getUserById,
  login: login
}