var chai = require("chai");
var chaiHttp = require("chai-http");
var async = require("async");

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require("http");
chai.use(chaiHttp);

// Test suite for API call to /survey/<number>
describe("API call for /survey/<number>", () => {
   
  it("Should return null for survey 123", () => {   // Test case for checking the response of survey 123
    chai
      .request("http://localhost:8080")   // Making a request to the local server
      .get("/app/survey/123")             // Sending a GET request to the specified endpoint
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null; // null is stored in err
      });
  });
});
// Test suite for checking the Survey Object result
describe('Test Survey Object result', function () {
  //	this.timeout(15000);

  var requestResult;
  var response;          // Variables to store the request result and response

  before(function (done) {     // Before hook to make a request before running the tests
    chai.request("http://localhost:8080")
      .get("/app/survey/1")     // Sending a GET request to fetch survey 1
      .end(function (err, res) {
        requestResult = res.body;
        response = res;         // Storing the full response
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

   // Test case to check if the survey object contains expected properties and values
  it('Should contain the values _id, surveyId, name, description, owner, and status as expected for Survey 1', function () {
    expect(response.body).to.have.property('surveyId', 1).that.is.a('number');
    expect(response.body).to.have.property('name', 'Customer Feedback Survey');
    expect(response.body).to.have.property('description', 'Survey to gather customer feedback on our products and services.');
    expect(response.body).to.have.property('owner', 'VSomwanshi');
    expect(response.body).to.have.property('status', 'active');
  });
 // Test case to ensure the response body is an object and not a string
  it('Should be an object and not a string', function () {
    expect(response.body).to.be.a('object');
    expect(response.body).to.not.be.a.string;
  })
});

describe('Test survey 1 question 1', () => {
  var requestResult;
  var response;          // Variables to store the request result and response

  before(function (done) {     // Before hook to make a request before running the tests
    chai.request("http://localhost:8080")
      .get("/app/survey/1/question/1")     // Sending a GET request to fetch survey 1
      .end(function (err, res) {
        requestResult = res.body;
        response = res;         // Storing the full response
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should contain the values questionId, type, isRequired, text, payload', function () {
    expect(response.body).to.have.property('questionId')
    expect(response.body).to.have.property('type').and.to.be.a.string
    expect(response.body).to.have.property('isRequired').and.to.be.a('boolean')
    expect(response.body).to.have.property('text').and.to.be.a.string
    expect(response.body).to.have.property('payload').and.to.be.a('array')
  });
})