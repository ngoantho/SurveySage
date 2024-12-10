var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

chai.use(chaiHttp);

describe('Test Unprotected Survey Routes', function () {
    // Test for GET /api/test/surveys
    describe('GET /api/test/surveys', function () {
        var requestResult;
        var response;

        // Before hook to make a request before running the tests
        before(function (done) {
            chai.request("http://localhost:8080") // Replace with your server's base URL
                .get("/api/test/surveys")
                .end(function (err, res) {
                    requestResult = res.body;
                    response = res;
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });

        // Test case to check if the response is an array
        it('Should return an array of surveys', function () {
            expect(response).to.have.status(200); // Return status is 200
            expect(response.body).to.be.an('array'); // Test that return value is an array
        });

        // Test case to check if each survey object has expected properties and types
        it('Each survey should have expected properties and types', function () {
            response.body.forEach(survey => {
                expect(survey).to.have.property('surveyId').and.to.be.a('number'); // Checking surveyId property
                expect(survey).to.have.property('name').and.to.be.a('string'); // Checking name property
                expect(survey).to.have.property('description').and.to.be.a('string'); // Checking description property
                expect(survey).to.have.property('owner').and.to.be.a('string'); // Checking owner property
                expect(survey).to.have.property('status').and.to.be.a('string'); // Checking status property
            });
        });
    });

    // Test for GET /api/test/survey/:surveyId
    describe('GET /api/test/survey/:surveyId', function () {
        const validSurveyId = 1; // Replace with a valid surveyId for testing
        const invalidSurveyId = 50; // Replace with an invalid surveyId for testing

        // Test case for a valid surveyId
        it('Should return the survey data for a valid surveyId', function (done) {
            const validSurveyId = 1; // Replace with a valid surveyId from your database

            chai.request("http://localhost:8080") // Replace with your server's base URL
                .get(`/api/test/survey/${validSurveyId}`)
                .end(function (err, res) {
                    expect(err).to.be.null; // Ensure no error occurred
                    expect(res).to.have.status(200); // Ensure the status is 200
                    expect(res.body).to.be.an('object'); // Ensure the response body is an object
                    expect(res.body).to.be.an('object'); // Test that return value is an object
                    expect(res.body).to.have.property('surveyId').and.to.equal(validSurveyId); // Checking surveyId property
                    expect(res.body).to.have.property('name').and.to.be.a('string'); // Checking name property
                    expect(res.body).to.have.property('description').and.to.be.a('string'); // Checking description property
                    expect(res.body).to.have.property('owner').and.to.be.a('string'); // Checking owner property
                    expect(res.body).to.have.property('status').and.to.be.a('string'); // Checking status property
                    done();
                });
        });

        // Test case for an invalid surveyId
        it('Should return a response for an invalid surveyId', function (done) {
            chai.request("http://localhost:8080") // Replace with your server's base URL
                .get(`/api/test/survey/${invalidSurveyId}`)
                .end(function (err, res) {
                    expect(err).to.be.null; // Ensure no error occurred
                    expect(res).to.have.status(200); // Ensure the status is 200
                    expect(res.body).to.be.null; // Ensure the response body is
                    done();
                });
        });

    });
});