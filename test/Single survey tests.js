var chai = require("chai");
var chaiHttp = require("chai-http");
var async = require("async");

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require("http");
chai.use(chaiHttp);

describe("API call for /survey/<number>", () => {
  it("Should return null for survey 123", () => {
    chai
      .request("http://localhost:8080")
      .get("/app/survey/123")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null; // null is stored in err
      });
  });
});

describe('Test Survey Object result', function () {
  //	this.timeout(15000);

  var requestResult;
  var response;

  before(function (done) {
    chai.request("http://localhost:8080")
      .get("/app/survey/1")
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should contain the values _id, surveyId, name, description, owner, and status as expected for Survey 1', function () {
    expect(response.body).to.have.property('surveyId', 1).that.is.a('number');
    expect(response.body).to.have.property('name', 'Customer Feedback Survey');
    expect(response.body).to.have.property('description', 'Survey to gather customer feedback on our products and services.');
    expect(response.body).to.have.property('owner', 'VSomwanshi');
    expect(response.body).to.have.property('status', 'active');
  });

  it('Should be an object and not a string', function () {
    expect(response.body).to.be.a('object');
    expect(response.body).to.not.be.a.string;
  })
});