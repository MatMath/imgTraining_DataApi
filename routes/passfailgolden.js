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

var onError = function(err) {
  console.log(e.message, e.stack);
  res.writeHead(500, {'content-type': 'text/plain'});
  res.end('An error occurred');
};

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack);
});

var pool = new Pool(config);

/* GET the total number of good and bad images inside the Golden sample DB. */
router.get('/', function(req, res, next) {
  console.log("Inside The Golden Request");

    pool.query('SELECT * FROM public.goldencount', function(err, result) {
      // handle an error from the query
      if(err) return onError(err);
      // console.log(result.rows);
      res.json(result.rows);
    });
});

module.exports = router;






