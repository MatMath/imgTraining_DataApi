var Pool = require('pg').Pool;

var config = {
  host: 'localhost',
  user: 'mathieu',
  password: 'none',
  database: 'goodbad',
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new Pool(config);
var usersLogin = {};

usersLogin.doesUserExist = function (user) {
  pool.query('SELECT * FROM public.users WHERE email = $1', [user.email], function(err, result) {
    // handle an error from the query
    if (err) {return err;}
    if (result.rowCount === 0) {
    	// No user found, so add it
    	return usersLogin.newUser(user);
    } else if (result.rowCount === 1) {
    	// user found so just go back ?? Or add it to the cookie for later use?
    	return true;
    } else {
    	return false;
    }
  });
};

usersLogin.newUser = function(data) {
  data.creation_date = new Date();
  console.log("Creating a new user", data);
  //TODO: Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO users(email, username, name, creation_date) VALUES($1, $2, $3, $4)', [data.email, data.username, data.name, data.creation_date], function(err, result) {
    // handle an error from the query
    if (err) {return err;}
    // This return the user oid and other info.
    return true;
  });
};

module.exports = usersLogin;