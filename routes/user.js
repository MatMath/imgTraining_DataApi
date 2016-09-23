var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;
var logger = require('../loggerToFile');
var config = require('../db.setting');

process.on('unhandledRejection', function(e) {
  logger.warn(e.message, e.stack);
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
  // $ curl --data "username=newUserName&name=Mathieu Legault&email=mathieu.k.legault@gmail.com" localhost:8010/user
  var data = {
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    creation_date: new Date()
  };
  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO users(email, username, name, creation_date) VALUES($1, $2, $3, $4)', [data.email, data.username, data.name, data.creation_date], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // This return the user oid and other info.
    res.json(result);
  });
});

router.delete('/:username', function(req, res) {
  var usernameid = req.params.username;
  pool.query('DELETE FROM public.users WHERE username=($1)', [usernameid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
  });
});

module.exports = router;
