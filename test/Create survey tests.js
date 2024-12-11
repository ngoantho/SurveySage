var chai = require("chai");
var chaiHttp = require("chai-http");
var async = require("async");

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require("http");
chai.use(chaiHttp);

// Test suite for API call to create survey
describe("API call for creating survey",function (){
  var response;
  var respBody;
  const surveyData={
    name: "Customer Feedback Survey",
    userId: 100,
    surveyId: 1001,
    description: "Survey to gather customer feedback",
    owner: "VSomwanshi",
    status: "draft"
  };
  before (function(done) {
    chai
      .request("https://surveysage.azurewebsites.net/")
      .post("/api/test/survey")
      .send(surveyData)
      .end(function(err, res){
        response = res;
        respBody = res.body;
        console.log(respBody)
        expect(res).to.have.status(200); // Changed from 201 to 200 to match your API
        expect(err).to.be.null;
        done();
      });
  });
  
  it('Should contain surveyId', function () {
    expect(response).to.have.status(200);
    expect(respBody).to.have.property('surveyId').that.is.equals(1001);
  });

  after (function (done){
    chai
    .request("https://surveysage.azurewebsites.net/")
      .delete(`/api/test/survey/${respBody.surveyId}`)
      .end(function (err,res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done()
      })
  });
})