var http = require('http');
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

var server = http.createServer(function(req, res) {

  var onError = function(err) {
    console.log(e.message, e.stack);
    res.writeHead(500, {'content-type': 'text/plain'});
    res.end('An error occurred');
  };

  pool.query('INSERT INTO visit (date) VALUES ($1)', [new Date()], function(err) {
    if (err) return onError(err);
    console.log("This write to the server????");
    // get the total number of visits today (including the current visit)
    pool.query('SELECT COUNT(NULLIF(false, golden.passfail)) AS passimg, COUNT(NULLIF(true, golden.passfail)) AS failedimg FROM public.golden', function(err, result) {
      // handle an error from the query
      if(err) return onError(err);
      res.writeHead(200, {'content-type': 'text/plain'});
      console.log(result.rows);
      res.end('Passing Img: ' + result.rows[0].passimg + '\n' + 'Failling Img: ' + result.rows[0].failedimg);
    });
  });
});

pool
  .query('CREATE TABLE IF NOT EXISTS visit (date timestamptz)')
  .then(function() {
    server.listen(3001, function() {
      console.log('server is listening on 3001');
    });
  });

