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
      
          it('Should contain _id, surveyId, name, description, owner, and status', function() {
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('surveyId').that.is.a('number');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('description');
            expect(response.body).to.have.property('owner');
            expect(response.body).to.have.property('status');
    });
    
  });

