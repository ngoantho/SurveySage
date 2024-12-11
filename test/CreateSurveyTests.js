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
  
  it('Should contain return status 200 and validate surveyId', function () {
    expect(response).to.have.status(200);
    expect(respBody).to.have.property('surveyId').that.is.equals(1001);
  });

  it('Should post the correct properties to the new created survey object', function(){
    expect(respBody).to.have.property('surveyId');
    expect(respBody).to.have.property('name');
    expect(respBody).to.have.property('userId');
    expect(respBody).to.have.property('description');
    expect(respBody).to.have.property('owner');
    expect(respBody).to.have.property('status');
  });

  it('Should have the correct details for all the properties to the new created survey object', function(){

    expect(respBody).to.have.property('name').and.to.equal('Customer Feedback Survey');
    expect(respBody).to.have.property('userId').that.is.equals(100);
    expect(respBody).to.have.property('description').and.to.equal('Survey to gather customer feedback');
    expect(respBody).to.have.property('owner').and.to.equal('VSomwanshi');
    expect(respBody).to.have.property('status').and.to.equal('draft');
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