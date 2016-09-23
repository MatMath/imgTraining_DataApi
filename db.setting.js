var config = {
  host: 'localhost',
  user: process.env.dbuser || 'mathieu',
  password: process.env.dbpass || 'none',
  database: 'goodbad',
  max: 10,
  idleTimeoutMillis: 30000
};

module.exports = config;
