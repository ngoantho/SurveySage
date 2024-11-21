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
