// This page for view is only designes to Get information not to Push anything on it.
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
router.get('/', function(req, res, next) {
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end('Possible Views: \n ' +
    '/view/pfgolden (Give the Total Passign and Failling image inside the Golden Sample DB.) \n ' +
    '/view/passfailresult (Count the Total Pass + Fail Positive + Fail Negative for all user.) \n' +
    '/view/passfailresult/:username (Count the Total Pass + Fail Positive + Fail Negative for this user.)');
});

/* GET the total number of good and bad images inside the Golden sample DB. */
router.get('/pfgolden', function(req, res, next) {
  // console.log("Inside The Golden Request");
    pool.query('SELECT * FROM public.goldencount', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      // console.log(result.rows);
      res.json(result.rows);
    });
});

router.get('/passfailresult/:username', function(req, res, next) {
  var usernameid = req.params.username;
    pool.query('SELECT * FROM public.passfailresultcount WHERE username = $1', [usernameid], function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      res.json(result.rows);
    });
});

router.get('/passfailresult', function(req, res, next) {
    pool.query('SELECT * FROM public.passfailresultcount', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      res.json(result.rows);
    });
});


module.exports = router;






