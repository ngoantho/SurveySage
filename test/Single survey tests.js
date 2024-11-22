var chai = require("chai"); // Importing Chai for assertions
var chaiHttp = require("chai-http"); // Importing Chai HTTP for HTTP integration testing
var async = require("async"); // Importing async for handling asynchronous operations

var assert = chai.assert; // Using Chai's assert style
var expect = chai.expect; // Using Chai's expect style
var should = chai.should(); // Using Chai's should style

var http = require("http"); // Importing Node's HTTP module
chai.use(chaiHttp); // Enabling Chai HTTP plugin

// Test suite for API call to /survey/<number>
describe("API call for /survey/<number>", () => {
  // Test case for checking the response of survey 123
  it("Should return for survey 123", () => {
    chai
      .request("http://localhost:8080") // Making a request to the local server
      .get("/app/survey/123") // Sending a GET request to the specified endpoint
      .end((err, res) => {
        expect(res).to.have.status(200); // Expecting the response status to be 200
        expect(err).to.be.null; // Expecting no error in the response
      });
  });
});

// Test suite for checking the Survey Object result
describe('Test Survey Object result', function () {
  // Variables to store the request result and response
  var requestResult;
  var response;

  // Before hook to make a request before running the tests
  before(function (done) {
    chai.request("http://localhost:8080")
      .get("/app/survey/1") // Sending a GET request to fetch survey 1
      .end(function (err, res) {
        requestResult = res.body; // Storing the response body
        response = res; // Storing the full response
        expect(err).to.be.null; // Expecting no error in the response
        expect(res).to.have.status(200); // Expecting the response status to be 200
        done(); // Indicating the end of asynchronous operations
      });
  });

  // Test case to check if the survey object contains expected properties and values
  it('Should contain the values _id, surveyId, name, description, owner, and status as expected for Survey 1', function () {
    expect(response.body).to.have.property('surveyId', 1).that.is.a('number'); // Checking surveyId property
    expect(response.body).to.have.property('name', 'Customer Feedback Survey'); // Checking name property
    expect(response.body).to.have.property('description', 'Survey to gather customer feedback on our products and services.'); // Checking description property
    expect(response.body).to.have.property('owner', 'VSomwanshi'); // Checking owner property
    expect(response.body).to.have.property('status', 'active'); // Checking status property
  });

  // Test case to ensure the response body is an object and not a string
  it('Should be an object and not a string', function () {
    expect(response.body).to.be.a('object'); // Expecting the response body to be an object
    expect(response.body).to.not.be.a.string; // Ensuring the response body is not a string
  });
});