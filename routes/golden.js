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
  pool.query('SELECT * FROM public.golden', function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

router.post('/', function(req, res) {
  // $ curl --data "filename=someFilename&url=&'somekittenUrl'description=Unpeuplus&criteria_target1=4&passfail=true&explanation=nothing" localhost:8010/golden
  var data = {
    'filename': req.body.filename,
    'url': req.body.url,
    'description': req.body.description,
    'criteria_target1': req.body.criteria_target1,
    'creation_date': new Date(),
    'passfail': req.body.passfail,
    'explanation': req.body.explanation
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO golden(filename, url, description, criteria_target1, creation_date, passfail, explanation) VALUES($1, $2, $3, $4, $5, $6, $7)', [data.filename, data.url, data.description, data.criteria_target1, data.creation_date, data.passfail, data.explanation], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result);
  });
});

router.delete('/:goldenOid', function(req, res) {
  var goldenOid = req.params.goldenOid;
  pool.query('DELETE FROM public.golden WHERE oid=($1)', [goldenOid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
  });
});

module.exports = router;