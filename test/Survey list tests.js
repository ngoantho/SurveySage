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

	it('Should return an array object with 3 or more objects', function () {
		expect(response).to.have.status(200); //return status is 200
		expect(response.body).to.be.an('array') //test that return value is an array
		expect(response.body).to.have.lengthOf.at.least(3);
		expect(response).to.have.headers;
	});

	it('Each survey should have a expected types', () => {
		response.body.every(survey => expect(survey).to.have.property('surveyId').and.to.be.a('number'))
		response.body.every(survey => expect(survey).to.have.property('name').and.to.be.a.string)
		response.body.every(survey => expect(survey).to.have.property('description').and.to.be.a.string)
		response.body.every(survey => expect(survey).to.have.property('owner').and.to.be.a.string)
		response.body.every(survey => expect(survey).to.have.property('status').and.to.be.a.string)
	})

	it('Survey list should be an array of objects', () => {
		expect(response.body).to.not.be.a.string;
		response.body.every(survey => expect(survey).to.be.an('object'))
	})
});
