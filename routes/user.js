var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;


var config = {
  host: 'localhost',
  user: 'mathieu',
  password: 'none',
  database: 'goodbad',
  max: 10,
  idleTimeoutMillis: 30000
};


process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack);
});

var pool = new Pool(config);

router.get('/', function(req, res) {
  pool.query('SELECT * FROM public.users', function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.post('/', function(req, res) {
  // $ curl --data "username=newUserName&name=Mathieu Legault&creation_date=2016-07-05" localhost:3000/users
  var data = {
    username: req.body.username,
    name: req.body.name,
    creation_date: req.body.creation_date
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO users(username, name, creation_date) VALUES($1, $2, $3)', [data.username, data.name, data.creation_date], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

module.exports = router;