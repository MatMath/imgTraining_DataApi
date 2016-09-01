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
var base_url_api = "http://localhost:8010/api/";

var testingUser = {
		username: 'jasmineTest',
		email: 'greattest@gmail.com',
		name: 'Jasmine is Hot'
};
var nbrOfUserInit = 0;

describe('Validating that the criteria are accecible', function() {
	var totalCriteria = null;
	it("Get the list of ALL criteria", function(done) {
		request.get(base_url_api + 'view/criteria', function(err,res,body) {
			totalCriteria = JSON.parse(body).length;
			expect(totalCriteria).toBeGreaterThan(8);
			done();
		});
	});

	it("Get the list of ALL Active criteria", function(done) {
		request.get(base_url_api + 'view/criteria/active', function(err,res,body) {
			var active = JSON.parse(body).length;
			expect(active).toBeGreaterThan(1);
			expect(active).toBeLessThan(totalCriteria);
			done();
		});
	});
});

describe("Testing the Creation of a user", function() {
	describe("GET & POST /user", function() {
		// Ger the initial Nbr of user:
		it("should return the initial number of user", function(done) {
			request.get(base_url_api + 'user', function(error, response, body) {
				nbrOfUserInit = JSON.parse(body).length;
				// console.log("nbrOfUser is: ", nbrOfUserInit);
				expect(nbrOfUserInit).toBeGreaterThan(2);
				done();
			});
		});

		it("Add the test user", function(done) {
			// TODO: Add a feedback to the user
			request.post(base_url_api + 'user', {form: testingUser}, function(error, response, body) {
				expect(JSON.parse(body).oid).toBeDefined(); //index of the user
				done();
			});
		});

		it("Should have 1 more user in the list", function(done) {
			request.get(base_url_api + 'user', function(error, response, body) {
				expect(JSON.parse(body).length - nbrOfUserInit).toEqual(1);
				done();
			});
		});
	});
});

var nbrOfgoldenImg = 0;
var newGoldenImg = {
    'filename': 'jasmineTestingGoldenImg',
    'url': 'https://placekitten.com/g/601/501',
    'description': 'Plz look at the Wiki Page here: (https://en.wikipedia.org/wiki/Humour) to learn more on this imgage',
    'criteria_array': '[1,2,7,null,6]',
    'passfail': false,
    'explanation': 'This is Failling due to Blurry and also due to a trademark problem.'
  };
var criteria_array = [{
		"crit_uuid":"Crit1",
		"value":1
	},{
		"crit_uuid":"Crit2",
		"value":4
	},{
		"crit_uuid":"Crit3",
		"value":5
	},{
		"crit_uuid":"Crit9",
		"value":9
	}
];
var goldenOid = null; //This is not persistant across Describe because it is asynch and inputed at the start
var goldenUuid = null; //This is not persistant across Describe because it is asynch and inputed at the start
describe("Testing the Creation and removal of a Golden image", function() {
	describe("GET & POST /golden", function() {

		// Ger the initial Nbr of Golden Images in the system:
		it("should return the initial number of golden img", function(done) {
			request.get(base_url_api + 'golden', function(error, response, body) {
				nbrOfgoldenImg = JSON.parse(body).length;
				// console.log("nbrOfgoldenImg is: ", nbrOfgoldenImg);
				expect(nbrOfgoldenImg).toBeGreaterThan(2);
				done();
			});
		});

		it('Add one Golden Img', function(done) {
			// TODO: Add a feedback to the user
			request.post(base_url_api + 'golden', {form: newGoldenImg}, function(error, response, body) {
				var parsedAns = JSON.parse(body);
				goldenOid = parsedAns.oid;
				goldenUuid = parsedAns.rows[0].uuid;
				// console.log("parsedAns:",parsedAns.rows);
				// console.log("UUID:", goldenUuid);
				expect(parsedAns.oid).toBeDefined(); //index of the user
				expect(parsedAns.rows[0].uuid).toBeDefined(); //index of the user
				done();
			});
		});

		it('Add all the criteria Value of the Golden Img', function(done) {
			var body = {
				valueArray: criteria_array,
				uuid: goldenUuid
			};
			request.post(base_url_api + 'golden/crit', {form: body}, function(error, response, body) {
				expect(JSON.parse(body)).toBeDefined(); //index of the user
				done();
			});
		});

		it('Should have 1 more image in the list', function(done) {
			request.get(base_url_api + 'golden', function(error, response, body) {
				expect(JSON.parse(body).length).toEqual(nbrOfgoldenImg + 1);
				done();
			});
		});

		it("Should delete all golden Criteria link with the test image", function(done) {
			// Note the criteria value need to be deleted BEFORE we delete the Image because the UUID is link.
			request.delete(base_url_api + 'golden/crit/' + goldenUuid, function(error, response, body) {
				expect(JSON.parse(body).rowCount).toEqual(criteria_array.length);
				done();
			});
		});

		it("Should delete only 1 golden test image", function(done) {
			request.delete(base_url_api + 'golden/' + goldenOid, function(error, response, body) {
				// console.log(body);
				expect(JSON.parse(body).rowCount).toEqual(1);
				done();
			});
		});

	});
});

var nbrOfResult = 0;
var newResult = {
    'username': testingUser.username,
    'filenameid': 555555,
    'success': false,
    'fail_passed': true,
    'delta_criteria_array': '[1,-4,-3,0,0]',
    'user_comments': "The user seems blurry, but the principal object looks in focus enough"
};

var resultOid = null;
var resultUuid = null;
resultValue = [
	{
		'criteria_uuid': 'Crit2',
		'value': 1
	},{
		'criteria_uuid': 'Crit3',
		'value': 2
	},{
		'criteria_uuid': 'Crit5',
		'value': 3
	},{
		'criteria_uuid': 'Crit9',
		'value': 7
	}
];
describe("Adding new result, ", function(){
	describe('Check the result and adding new one', function() {
		it("Should get the initial nbr of results for all user", function(done) {
			request.get(base_url_api + 'result', function(err, resp, body) {
				nbrOfResult = JSON.parse(body).length;
				// console.log("Initial Nbr of result in DB:", nbrOfResult);
				expect(nbrOfResult).toBeGreaterThan(2);
				done();
			});
		});

		it('should check the Nbr of result for that user is 0', function(done) {
			request.get(base_url_api + 'result/' + testingUser.username, function(err, resp, body){
				// console.log("Body in nbrResult0:",body);
				expect(JSON.parse(body).length).toEqual(0);
				done();
			});
		});

		it('Should post 1 result for that user', function(done) {
			request.post(base_url_api + 'result', {form: newResult}, function(err, resp, body) {
				var parsedAns = JSON.parse(body);
				resultOid = parsedAns.oid;
				resultUuid = parsedAns.rows[0].uuid;
				expect(resultOid).toBeDefined();
				expect(resultUuid).toBeDefined();
				done();
			});
		});

		it('Add all Criteria link with that result', function(done) {
			var body = {
				valueArray: resultValue,
				uuid: resultUuid
			};
			request.post(base_url_api + 'result/crit/', {form: body}, function(err,resp,body) {
				expect(body).toBeDefined();
				done();
			});
		});

		it('should check the Nbr of result for that user is now 1', function(done) {
			request.get(base_url_api + 'result/' + testingUser.username, function(err,resp, body){
				// console.log("The result resultOid is persistant? ", resultOid);
				expect(JSON.parse(body).length).toEqual(1);
				done();
			});
		});

		// Check all the view here with the new img we just added
		it('Check the view passfailresult for the user', function(done) {
			request.get(base_url_api + 'view/passfailresult/' + testingUser.username, function(err, resp, body) {
				expect(JSON.parse(body).length).toEqual(1);
				done();
			});
		});

		it('validate that view/resultwithcrit load', function(done) {
			request.get(base_url_api + 'view/resultwithcrit', function(err, resp, body) {
				expect(JSON.parse(body).length).toBeGreaterThan(1);
				done();
			});
		});

		it('validate that view/resultwithcrit load for THAT user', function(done) {
			request.get(base_url_api + 'view/resultwithcrit/' + testingUser.username, function(err, resp, body) {
				console.log("THAT user:",body);
				expect(JSON.parse(body).length).toEqual(1);
				done();
			});
		});

		it('Delete all criteria link with the result', function(done) {
			// Note: We cannot delete the result if there is still criteria value saved
			request.delete(base_url_api + 'result/crit/' + resultUuid, function(err, resp, body) {
				expect(JSON.parse(body).rowCount).toEqual(resultValue.length);
				done();
			});
		});

		it('Should delete The last test created', function(done) {
			// This is more for cleanup when we have to restart the test multiple time
			// console.log("trying to delete result#: ", resultOid);
			request.delete(base_url_api + 'result/id/' + resultOid, function(error, response, body) {
				console.log(body);
				expect(JSON.parse(body).rowCount).toEqual(1);
				done();
			});
		});
	});

});


describe("Testing the Cleanup of alltest at the end", function() {
	describe("Delete /result/:filenameID", function() {
		it("Should delete all result with Golden Img Test", function(done) {
			// This is more for cleanup when we have to restart the test multiple time
			// console.log("trying to delete result#: ", newResult.filenameid);
			request.delete(base_url_api + 'result/all/' + newResult.filenameid, function(error, response, body) {
				// console.log(body);
				expect(JSON.parse(body).rowCount).toEqual(0);
				done();
			});
		});
	});

	describe("Delete /user/:username", function() {
		it("Should delete only 1 test user", function(done) {
			// Note: This can fail if we started a test and it failed and we remove more than 1 user, Later, make the user creation Unique in the DB.
			request.delete(base_url_api + 'user/' + testingUser.username, function(error, response, body) {
				expect(JSON.parse(body).rowCount).toEqual(1);
				myApp.closeServer(); //this take time, It finish the Test, All Good in 131ms, but dosent close the server until 30sec later.
				//I probably have a glitch in the Delete function??
				done();
			});
		});
	});
});
