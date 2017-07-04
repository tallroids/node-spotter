const Pool = require('pg-pool');
const url = require('url');
const params = url.parse(process.env.DATABASE_URL || 'postgres://spotter_client:spotter_client@localhost:5432/spotter');
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

function getUserById(id, callback) {
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

function login(username, password, callback) {
  var pool = new Pool(config);
  var user = {};
  pool.connect(function (e) {
    pool.query("SELECT * FROM users WHERE username = '" + username + "';", function (err, data) {
      if (err) {
        throw err;
      }
      user = data.rows[0];
      if(user.password == password){
        var result = {
          id: user.id,
          fname: user.fname,
          lname: user.lname,
          success: true
        }
        callback(null, result)
      } else {
      callback(null, {success: false});
      }
    })
  })
}

function registerUser(fname, lname, username, password, callback) {
  var pool = new Pool(config);
  pool.connect(function (e) {
    pool.query("INSERT INTO users (fname, lname, username, password) VALUES ('" + fname + "' ,'" + lname + "' ,'" + username + "' ,'" + password + "') RETURNING id, fname;", function (err, data) {
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
  login: login,
  registerUser: registerUser
}
