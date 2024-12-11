var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

chai.use(chaiHttp);

describe('Test Unprotected Survey Routes', function () {
    // Test for GET /api/test/surveys
    describe('GET /api/test/surveys', function () {
        var requestResult;
        var response;

        before(function (done) {
            chai.request("https://surveysage1-a8dkf7hcccbzcab5.westus-01.azurewebsites.net") 
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
            expect(response).to.have.status(200);
            expect(response.body).to.be.an('array'); 
        });

        // Test case to check if each survey object has expected properties and types
        it('Each survey should have expected properties and types', function () {
            response.body.forEach(survey => {
                expect(survey).to.have.property('surveyId').and.to.be.a('number'); 
                expect(survey).to.have.property('name').and.to.be.a('string'); 
                expect(survey).to.have.property('description').and.to.be.a('string'); 
                expect(survey).to.have.property('owner').and.to.be.a('string');
                expect(survey).to.have.property('status').and.to.be.a('string'); 
            });
        });
    });

    // Test for GET /api/test/survey/:surveyId
    describe('GET /api/test/survey/:surveyId', function () {
        const validSurveyId = 1; 
        const invalidSurveyId = 50;

        // Test case for a valid surveyId
        it('Should return the survey data for a valid surveyId', function (done) {
            const validSurveyId = 1; 

            chai.request("https://surveysage1-a8dkf7hcccbzcab5.westus-01.azurewebsites.net")
                .get(`/api/test/survey/${validSurveyId}`)
                .end(function (err, res) {
                    expect(err).to.be.null; 
                    expect(res).to.have.status(200); 
                    expect(res.body).to.be.an('object'); 
                    expect(res.body).to.be.an('object'); 
                    expect(res.body).to.have.property('surveyId').and.to.equal(validSurveyId);
                    expect(res.body).to.have.property('name').and.to.be.a('string'); 
                    expect(res.body).to.have.property('description').and.to.be.a('string'); 
                    expect(res.body).to.have.property('owner').and.to.be.a('string'); 
                    expect(res.body).to.have.property('status').and.to.be.a('string');
                    done();
                });
        });

        // Test case for an invalid surveyId
        it('Should return a response for an invalid surveyId', function (done) {
            chai.request("https://surveysage1-a8dkf7hcccbzcab5.westus-01.azurewebsites.net")
                .get(`/api/test/survey/${invalidSurveyId}`)
                .end(function (err, res) {
                    expect(err).to.be.null; 
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.null;
                    done();
                });
        });

    });
});