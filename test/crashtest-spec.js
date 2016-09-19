/*
======== A Handy Little Jasmine Reference ========
inspired by  https://github.com/pivotal/jasmine/wiki/Matchers
Spec matchers:
expect(x).toEqual(y); compares objects or primitives x and y and passes if they are equivalent
expect(x).toBe(y); compares objects or primitives x and y and passes if they are the same object
expect(x).toMatch(pattern); compares x to string or regular expression pattern and passes if they match
expect(x).toBeDefined(); passes if x is not undefined
expect(x).toBeUndefined(); passes if x is undefined
expect(x).toBeNull(); passes if x is null
expect(x).toBeTruthy(); passes if x evaluates to true
expect(x).toBeFalsy(); passes if x evaluates to false
expect(x).toContain(y); passes if array or string x contains y
expect(x).toBeLessThan(y); passes if x is less than y
expect(x).toBeGreaterThan(y); passes if x is greater than y
expect(x).toBeCloseTo; matcher is for precision math comparison
expect(x).toThrow; matcher is for testing if a function throws an exception
expect(x).toThrowError; matcher is for testing a specific thrown exception
expect(function(){fn();}).toThrow(e); passes if function fn throws exception e when executed
Every matcher's criteria can be inverted by prepending .not:
expect(x).not.toEqual(y); compares objects or primitives x and y and passes if they are not equivalent
Custom matchers help to document the intent of your specs, and can help to remove code duplication in your specs.
beforeEach(function() {
this.addMatchers({});
*/

process.env.GOOGLE_CLIENT_ID = "fakeID";
process.env.GOOGLE_CLIENT_SECRET = "fakeSecret";
// I could test against a real server, but what I really want is to test the flow on my side when I get the answer back with passeport. And it is not good practice to test against a real server.
// I tried to mock only the receiving answer, but it seems that is is harder than expected... So... I will by-pass the middleware completely when testing
process.env.FAKE_AUTH = "authenticated"; //This fake the Auth so the user appears to be loguedin.
var request = require("request");
var myApp = require("../app.js");
var base_url = 'http://localhost:8010/';
var base_url_api = base_url + 'api/';

var testingUser = {
		username: 'jasmineTest',
		email: 'greattest@gmail.com',
		name: 'Jasmine is Hot'
};

describe('testing error functions', function() {
  var myApp = require("../app.js");
  it('get wrong view argument but get redirected', function(done){
    request.get(base_url_api + 'view/dosent exist here', function(err,res,body) {
      expect(body.indexOf('Possible Views:')).toBeGreaterThan(-1);
      done();
    });
  });
  it('get fakeurl get redirected', function(done){
    request.get(base_url_api + 'fakeurl', function(err,res,body) {
      expect(body.indexOf('Possible Views:')).toBeGreaterThan(-1);
      done();
    });
  });
  it('get wrong golden arguments no space', function(done){
    request.get(base_url_api + 'golden/dosentexist123here', function(err,res,body) {
      expect(JSON.parse(body).message).toBe('Wrong argument');
      done();
    });
  });
  it('get wrong golden arguments', function(done){
    request.get(base_url_api + 'golden/dosent &"" here', function(err,res,body) {
      expect(JSON.parse(body).message).toBe('Wrong argument');
      done();
    });
  });
  it('get wrong result argument', function(done){
    request.get(base_url_api + 'result/dosent &" here', function(err,res,body) {
      expect(JSON.parse(body).message).toBe('Wrong username');
      done();
    });
  });

  function urlWithWord(word) {
    it('golden/crit/::uuid with sql:' + word, function(done) {
      request.get(base_url_api + 'golden/crit/' + word, function(err, res, body) {
        expect(JSON.parse(body).message).toBe('Wrong argument');
        expect(JSON.parse(body).error.status).toEqual(400);
        done();
      });
    });
  }

  var sqlWordList = ['SELECT', 'DROP', 'FROM', 'WHERE', 'AND'];
    for (var word in sqlWordList) {
      // console.log('testing: ',sqlWordList[word]);
      if (sqlWordList.hasOwnProperty(word)) {
          urlWithWord(sqlWordList[word]);
      }
    }
});


describe('Closing the server', function() {
  it('logout and closing the server', function(done){
    request.get(base_url + 'logout', function(err, res, body) {
      expect(res.request.path).toBe('/login');
      myApp.closeServer();
      done();
    });
  });
});
