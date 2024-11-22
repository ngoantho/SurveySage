var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
const { query } = require('express');
chai.use(chaiHttp);

describe('Test Survey lists result', function () {
	//	this.timeout(15000);

	var requestResult;
	var response;
// Before hook to make a request before running the tests
	before(function (done) {
		chai.request("http://localhost:8080")
			.get("/app/surveys")
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
	});
	// Test case to check if the response is an array with at least 3 objects
	it('Should return an array object with 3 or more objects', function () {
		expect(response).to.have.status(200); //return status is 200
		expect(response.body).to.be.an('array') //test that return value is an array
		expect(response.body).to.have.lengthOf.at.least(3);
		expect(response).to.have.headers;
	});
	// Test case to check if each survey object has expected properties and types
	it('Each survey should have a expected types', () => {
		response.body.every(survey => expect(survey).to.have.property('surveyId').and.to.be.a('number')) // Checking surveyId property
		response.body.every(survey => expect(survey).to.have.property('name').and.to.be.a.string)// Checking name property
		response.body.every(survey => expect(survey).to.have.property('description').and.to.be.a.string)
		response.body.every(survey => expect(survey).to.have.property('owner').and.to.be.a.string)
		response.body.every(survey => expect(survey).to.have.property('status').and.to.be.a.string)
	})
// Test case to ensure the survey list is an array of objects
	it('Survey list should be an array of objects', () => {
		expect(response.body).to.not.be.a.string; // Ensuring the response body is not a string
		response.body.every(survey => expect(survey).to.be.an('object')) // Ensuring each survey is an object
	})
});