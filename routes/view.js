// This page for view is only designes to Get information not to Push anything on it.
var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;
var logger = require('../loggerToFile');
var config = require('../db.setting');

process.on('unhandledRejection', function(e) {
  logger.warn(e.message, e.stack);
});

var pool = new Pool(config);
router.get('/', function(req, res, next) {
  res.render('possibleview', { user: req.user });
});

/* GET the total number of good and bad images inside the Golden sample DB. */
router.get('/pfgolden', function(req, res, next) {
    pool.query('SELECT * FROM public.goldencount', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug(result.rows);
      res.json(result.rows);
    });
});

router.get('/result-per-dates/:username', function(req, res, next) {
  var usernameid = req.params.username;
  pool.query('SELECT * FROM public.result-per-user-dates WHERE username = $1', [usernameid], function(err, result) {
    // handle an error from the query
    if(err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.get('/result-per-dates', function(req, res, next) {
  pool.query('SELECT * FROM public.result-per-dates', function(err, result) {
    // handle an error from the query
    if(err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.get('/top-failling-img', function(req, res, next) {
    pool.query('SELECT * FROM public.top-failling-img', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
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

router.get('/randgolden', function(req, res, next) {
  logger.debug("Inside The Golden Request");
    pool.query('SELECT * FROM public.randgolden', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug("randgolden:", result.rows);
      res.json(result.rows);
    });
});

router.get('/totimgfailratio/:username', function(req, res, next) {
  var usernameid = req.params.username;
    pool.query('SELECT * FROM public.totimgfailratio WHERE username = $1', [usernameid], function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug(result.rows);
      res.send(result.rows);
    });
});

router.get('/totimgfailratio', function(req, res, next) {
    pool.query('SELECT * FROM public.totimgfailratio', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug(result.rows);
      res.send(result.rows);
    });
});

router.get('/resultwithcrit', function(req, res, next) {
    pool.query('SELECT * FROM public.result_w_crit', function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug(result.rows);
      res.json(result.rows);
    });
});

router.get('/resultwithcrit/:username', function(req, res, next) {
    var username = req.params.username;
    pool.query('SELECT * FROM public.result_w_crit WHERE username = $1', [username], function(err, result) {
      // handle an error from the query
      if(err) {return res.json(err);}
      logger.debug(result.rows);
      res.json(result.rows);
    });
});

router.get('/criteria/active', function(req, res) {
  // This is the first route that get called by the Front app to get the structure needed to display stuff.
  pool.query('SELECT * FROM public.criteria WHERE deleted IS NOT TRUE', function(err, result) {
    if (err) {return res.json(err);}
    res.json(result.rows);
  });
});

router.get('/criteria', function(req, res) {
  // This is the first route that get called by the Front app to get the structure needed to display stuff.
  pool.query('SELECT * FROM public.criteria', function(err, result) {
    if (err) {return res.json(err);}
    res.json(result.rows);
  });
});



module.exports = router;
