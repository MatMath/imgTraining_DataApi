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

router.get('/crit/:uuid', function(req, res, next) {
  // Possible error:
  // Check that uuid dosent contain sertain SQL injection "word" like "Select"
  var golden_uuid = req.params.uuid;
  var sqlWordList = ['SELECT', 'DROP', 'FROM', 'WHERE', 'AND'];
  if (new RegExp(sqlWordList.join("|")).test(golden_uuid)) {
    var err = new Error('Wrong argument');
    err.status = 400;
    return next(err);
  }
  pool.query('SELECT crit_uuid, crit_value FROM public.golden_result AS gold INNER JOIN public.criteria AS crit ON crit.uuid = gold.crit_uuid WHERE gold.golden_uuid=($1) AND crit.deleted IS NOT TRUE', [golden_uuid], function(err, result) {
    // handle an error from the query
    if (err) {
      return next(err);
    }
    res.json(result.rows);
  });
});

function stringBuilder(keyValueArr, uuid) {
  var result = '';
  for (var i = 0; i < keyValueArr.length; i++) {
    result = result + "('" + keyValueArr[i].crit_uuid + "' , " + keyValueArr[i].value + " , '" + uuid +"')";
    if (i !== keyValueArr.length -1) { result = result+','; }
  }
  return result;
}

router.post('/crit', function(req, res) {
  var allCriteria = stringBuilder(req.body.valueArray, req.body.uuid);
  var text = 'WITH new_values (crit_uuid, crit_value, golden_uuid) as (values '+ allCriteria + '), upsert as ( ' +
      'update golden_result m ' +
          'set crit_value = nv.crit_value, golden_uuid = nv.golden_uuid ' +
      'FROM new_values nv WHERE m.crit_uuid = nv.crit_uuid AND m.golden_uuid = nv.golden_uuid RETURNING m.* ) ' +
  'INSERT INTO golden_result (crit_uuid, crit_value, golden_uuid) SELECT crit_uuid, crit_value, golden_uuid FROM new_values WHERE NOT EXISTS (SELECT 1 FROM upsert up WHERE up.golden_uuid = new_values.golden_uuid)';
  // console.log('QUERRY GOLDEN CRIT: ', text);
  // Optimisation/refactor needed here once I understand more.
  pool.query(text, function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result);
  });
});

router.delete('/crit/:uuid', function(req, res) {
  var golden_uuid = req.params.uuid;
  console.log("deleting crit:", golden_uuid);
  pool.query('DELETE FROM public.golden_result WHERE golden_uuid=($1)', [golden_uuid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
  });
});

router.get('/deletecreteria', function(req, res) {
  // This delete all criteria from the table where the Golden image is labeled as Deleted.
  pool.query('SELECT * FROM deletecreteria()', function(err, result){
    if (err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.get('/', function(req, res) {
  pool.query('SELECT *, oid FROM public.golden', function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

router.post('/', function(req, res) {
  var data = {
    'filename': req.body.filename,
    'url': req.body.url,
    'type': req.body.type || null,
    'description': req.body.description,
    'creation_date': new Date(),
    'passfail': req.body.passfail,
    'explanation': req.body.explanation,
    'info_url': req.body.info_url,
    'deleted': req.body.deleted || null
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO golden(filename, url, description, creation_date, passfail, explanation, type, info_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING oid, uuid', [data.filename, data.url, data.description, data.creation_date, data.passfail, data.explanation, data.type, data.info_url], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});


router.get('/:goldenOid', function(req, res, next) {
  var goldenOid = req.params.goldenOid;
  if (goldenOid != parseInt(goldenOid)) {
    // Not a number so there is somethign wrong.
    var err = new Error('Wrong argument');
    err.status = 400;
    return next(err);
  }
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
    'creation_date': new Date(),
    'passfail': req.body.passfail,
    'explanation': req.body.explanation,
    'info_url': req.body.info_url,
    'deleted': req.body.deleted || null
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('UPDATE golden SET filename=($1), url=($2), description=($3), passfail=($4), explanation=($5), type=($6), info_url=($7) , deleted=($8) WHERE oid=($9) RETURNING oid, uuid', [data.filename, data.url, data.description, data.passfail, data.explanation, data.type, data.info_url, data.deleted, goldenOid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    // console.log(result.rows);
    res.json(result.rows);
  });
});

router.delete('/:goldenOid', function(req, res) {
  var goldenOid = req.params.goldenOid;
  pool.query('DELETE FROM public.golden WHERE oid=($1)', [goldenOid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result.rowCount);
  });
});

module.exports = router;
