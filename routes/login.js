// This page for view is only designes to Get information not to Push anything on it.
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end('<a href="/auth/google">Login with Google</a>');
});

module.exports = router;