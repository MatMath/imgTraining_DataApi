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

var request = require("request");
var qs = require('querystring');
var base_url = "http://localhost:8010/";

describe('Test redirect of the routes to login: ', function() {
	it('api/view routes security', function(done) {
		request.get(base_url + 'api/view', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});
	it('api/view/pfgolden routes security', function(done) {
		request.get(base_url + 'api/view/pfgolden', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});
	it('api/view/passfailresult routes security', function(done) {
		request.get(base_url + 'api/view/passfailresult', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});
	it('api/view/passfailresult/User routes security', function(done) {
		request.get(base_url + 'api/view/passfailresult/mathieu', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});

	it('api/golden routes security', function(done) {
		request.get(base_url + 'api/golden', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});

	// user routing
	it('api/user routes security', function(done) {
		request.get(base_url + 'api/user', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});
	it('api/user POST is block and redirect to the login', function(done) {
		// Not sure here how to Check if the Function was called without directly looking in the DB, Spy?
		var data = {
		  email: "randomemail@gmail.com",
		  username: "notrealUsername",
		  name: "plzDont Save Me"
		};
		request.post({url: base_url + 'api/user', form: data}, function(err, res, body) {
			// TODO: Not sure why here the "res.request.path" dosent work and do not equal to /login like the Get request ?!? 
			expect(res.headers.location).toBe('/login'); //I have to find the information inside the headers, that is strange.
			done();
		});
	});
	it('api/user DELETE should not work if not login', function(done) {
		// It work when I check with the local DB, nothing get deleted.
		request.delete(base_url + 'api/user/mathieu', function(err, res, body) {
			// TODO: Same questionning as the Post request
			// I have the same problem/difference as the POST request (test before)
			expect(res.headers.location).toBe('/login');
			done();
		});
	});
	
	// Result routing
	it('api/result routes security', function(done) {
		request.get(base_url + 'api/result', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});

	// Default login
	it('api/login routes security', function(done) {
		request.get(base_url + 'api/login', function(err, res, body) {
			expect(res.request.path).toBe('/login');
			done();
		});
	});
});

