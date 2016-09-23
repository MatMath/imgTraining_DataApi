var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;
var logger = require('../loggerToFile');

var config = {
  host: 'localhost',
  user: 'mathieu',
  password: 'none',
  database: 'goodbad',
  max: 10,
  idleTimeoutMillis: 30000
};


process.on('unhandledRejection', function(e) {
  logger.warn(e.message, e.stack);
});

var pool = new Pool(config);

router.delete('/id/:resultOid', function(req, res) {
  var resultOid = req.params.resultOid;
  pool.query('DELETE FROM public.result WHERE oid=($1)', [resultOid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
  });
});

router.delete('/all/:goldenImgId', function(req, res) {
  var goldenId = req.params.goldenImgId;
  pool.query('DELETE FROM public.result WHERE filenameid=($1)', [goldenId], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
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
  var text = 'WITH new_values (crit_uuid, crit_value, result_uuid) as ( values ' + allCriteria +' ), ' +
  'upsert as ( update answer_result m set crit_value = nv.crit_value, result_uuid = nv.result_uuid ' +
  'FROM new_values nv WHERE m.crit_uuid = nv.crit_uuid AND m.result_uuid = nv.result_uuid RETURNING m.* ) ' +
  'INSERT INTO answer_result (crit_uuid, crit_value, result_uuid) SELECT crit_uuid, crit_value, result_uuid FROM new_values WHERE NOT EXISTS (SELECT 1 FROM upsert up WHERE up.result_uuid = new_values.result_uuid)';
  // Optimisation/refactor needed here once I understand more.
  pool.query(text, function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    logger.debug(result.rows);
    res.json(result);
  });
});

router.delete('/crit/:uuid', function(req, res) {
  var result_uuid = req.params.uuid;
  logger.debug("deleting crit:", result_uuid);
  pool.query('DELETE FROM public.answer_result WHERE result_uuid=($1)', [result_uuid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result);
  });
});

router.get('/', function(req, res) {
  // TODO Security: Check the current user role?
  pool.query('SELECT * FROM public.result', function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.get('/:username', function(req, res, next) {
  // TODO Security: Could check the Username with current logued user ?
  var usernameid = req.params.username;
  if (usernameid !== usernameid.replace(/\W/g,'')) {
    // username contain space and it should not???
    var err = new Error('Wrong username');
    err.status = 400;
    return next(err);
  }
  pool.query('SELECT * FROM public.result WHERE username = ($1)', [usernameid], function(err, result) {
    // handle an error from the query
    if (err) {return res.json(err); }
    res.json(result.rows);
  });
});

router.post('/', function(req, res) {
  // $ curl --data "username=mathieuTest&filenameid=123422&success=false&positive_failed=true&delta_criteria_array=-2&user_comments=this should fail and have a positive fail." localhost:8010/result
  // $ curl --data "username=mathieuTest&filenameid=123423&success=false&fail_passed=true&delta_criteria_array=2&user_comments=this should fail and have a Failed Positive." localhost:8010/result

  var data = {
    'username': req.body.username,
    'filenameid': req.body.filenameid,
    'golden_passfail_state': req.body.golden_passfail_state,
    'type': req.body.type || null,
    'success': req.body.success,
    'fail_passed': req.body.fail_passed || null,
    'positive_failed': req.body.positive_failed || null,
    'inspection_date': new Date(),
    'user_comments': req.body.user_comments,
    'timeinsec': req.body.timeinsec
  };

  // Optimisation/refactor needed here once I understand more.
  pool.query('INSERT INTO result(username, filenameid, success, fail_passed, positive_failed, inspection_date, user_comments, golden_passfail_state, timeinsec) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING oid, uuid', [data.username, data.filenameid, data.success, data.fail_passed, data.positive_failed, data.inspection_date, data.user_comments, data.golden_passfail_state, data.timeinsec], function(err, result) {
    // handle an error from the query
    if (err) {return result.json(err);}
    logger.debug(res.rows);
    res.json(result.rows[0]);
  });
});


module.exports = router;
