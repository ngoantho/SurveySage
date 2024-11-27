var chai = require("chai");
var chaiHttp = require("chai-http");
var async = require("async");

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require("http");
chai.use(chaiHttp);

// Test suite for API call to create survey
describe("API call for creating survey", () => {
  it("Should create a new survey successfully", () => {
    const surveyData = {
      name: "Customer Feedback Survey",
      description: "Survey to gather customer feedback",
      owner: "VSomwanshi",
      status: "active"
    };

    chai
      .request("http://localhost:8080")
      .post("/app/survey")
      .send(surveyData)
      .end((err, res) => {
        expect(res).to.have.status(200); // Changed from 201 to 200 to match your API
        expect(err).to.be.null;
        expect(res.body).to.have.property('surveyId');
      });
  });

  it("Should return error for invalid survey data", () => {
    const invalidSurveyData = {
      // Missing required fields
      description: "Invalid survey"
    };

    chai
      .request("http://localhost:8080")
      .post("/app/survey")
      .send(invalidSurveyData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
      });
  });
});

// Test suite for checking the Created Survey response
describe('Test Created Survey Response', function () {
  var requestResult;
  var response;

  before(function (done) {
    const newSurvey = {
      name: "Product Feedback Survey",
      description: "Gathering product feedback",
      owner: "VSomwanshi",
      status: "draft",
      questions: [
        {
          type: "multiple-choice",
          text: "How satisfied are you with our product?",
          isRequired: true,
          payload: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
        }
      ]
    };

    chai.request("http://localhost:8080")
      .post("/app/survey")
      .send(newSurvey)
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Changed from 201 to 200
        done();
      });
  });

  it('Should return created survey with all expected properties', function () {
    expect(response.body).to.have.property('surveyId').that.is.a('number');
    expect(response.body).to.have.property('name', 'Product Feedback Survey');
    expect(response.body).to.have.property('description');
    expect(response.body).to.have.property('owner', 'VSomwanshi');
    expect(response.body).to.have.property('status', 'draft');
    expect(response.body).to.have.property('questions').that.is.an('array');
  });
});

// Test suite for adding questions to survey
describe('Test Adding Questions to Survey', () => {
  let surveyId;

  // First create a survey and store its ID
  before(function (done) {
    const surveyData = {
      name: "Test Survey",
      description: "Test Description",
      owner: "VSomwanshi",
      status: "draft"
    };

    chai.request("http://localhost:8080")
      .post("/app/survey")
      .send(surveyData)
      .end(function (err, res) {
        surveyId = res.body.surveyId;
        done();
      });
  });

  it('Should add a question to existing survey', function (done) {
    const questionData = {
      type: "text",
      text: "Please provide your feedback",
      isRequired: true,
      payload: []
    };

    chai.request("http://localhost:8080")
      .post(`/app/survey/${surveyId}/questions`) // Updated endpoint
      .send(questionData)
      .end(function (err, res) {
        expect(res).to.have.status(200); // Changed from 201 to 200
        expect(res.body).to.have.property('questionId');
        expect(res.body.type).to.equal('text');
        expect(res.body.text).to.equal('Please provide your feedback');
        done();
      });
  });

  it('Should validate question data before adding', function (done) {
    const invalidQuestionData = {
      type: "invalid-type"
    };

    chai.request("http://localhost:8080")
      .post(`/app/survey/${surveyId}/questions`) // Updated endpoint
      .send(invalidQuestionData)
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
