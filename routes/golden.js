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
  pool.query('SELECT *, oid FROM public.golden', function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

router.post('/', function(req, res) {
  // $ curl --data "filename=someFilename&url=&'somekittenUrl'description=Unpeuplus&criteria_array=4&passfail=true&explanation=nothing" localhost:8010/golden
  var data = {
    'filename': req.body.filename,
    'url': req.body.url,
    'type': req.body.type || null,
    'description': req.body.description,
    'criteria_array': req.body.criteria_array,
    'creation_date': new Date(),
    'passfail': req.body.passfail,
    'explanation': req.body.explanation,
    'info_url': req.body.info_url,
    'deleted': req.body.deleted || null
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO golden(filename, url, description, criteria_array, creation_date, passfail, explanation, type, info_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)', [data.filename, data.url, data.description, data.criteria_array, data.creation_date, data.passfail, data.explanation, data.type, data.info_url], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result);
  });
});


router.get('/:goldenOid', function(req, res) {
  var goldenOid = req.params.goldenOid;
  pool.query('SELECT *, oid FROM public.golden WHERE oid=($1)', [goldenOid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

router.post('/:goldenOid', function(req, res) {
  var goldenOid = req.params.goldenOid;
  var data = {
    'filename': req.body.filename,
    'url': req.body.url,
    'type': req.body.type || null,
    'description': req.body.description,
    'criteria_array': req.body.criteria_array,
    'creation_date': new Date(),
    'passfail': req.body.passfail,
    'explanation': req.body.explanation,
    'info_url': req.body.info_url,
    'deleted': req.body.deleted || null
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('UPDATE golden SET filename=($1), url=($2), description=($3), criteria_array=($4), passfail=($5), explanation=($6), type=($7), info_url=($8) WHERE oid=($9)', [data.filename, data.url, data.description, data.criteria_array, data.passfail, data.explanation, data.type, data.info_url, goldenOid], function(err, result) {
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
