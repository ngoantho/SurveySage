import * as express from "express";
import * as bodyParser from "body-parser";
import { ListModel } from "./model/ListModel";
import { TaskModel } from "./model/TaskModel";
import * as crypto from "crypto";
import { SurveyModel } from "./model/SurveyModel";
import { QueuingStrategy } from "stream/web";
import { QuestionModel } from "./model/QuestionModel";
import { AnswerModel } from "./model/AnswerModel";
import { isNumberObject } from "util/types";

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public expressApp: express.Application;
  public Lists: ListModel;
  public Tasks: TaskModel;
  public Surveys: SurveyModel;
  public Questions: QuestionModel;
  public Answers: AnswerModel;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.Lists = new ListModel(mongoDBConnection);
    this.Tasks = new TaskModel(mongoDBConnection);
    this.Surveys = new SurveyModel(mongoDBConnection);
    this.Questions = new QuestionModel(mongoDBConnection);
    this.Answers = new AnswerModel(mongoDBConnection);
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    router.get("/app/list/:listId/count", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Tasks.retrieveTasksCount(res, id);
    });

    router.get("/app/list/:listId", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Lists.retrieveLists(res, id);
    });

    router.post("/app/list/", async (req, res) => {
      const hex = crypto.randomBytes(4).toString("hex");
      const id = parseInt(hex, 16);

      console.log(req.body);
      var jsonObj = req.body;
      jsonObj.listId = id;
      try {
        await this.Lists.model.create([jsonObj]);
        res.send('{"id":"' + id + '"}');
      } catch (e) {
        console.error(e);
        console.log("object creation failed");
      }
    });

    router.post("/app/list2/", async (req, res) => {
      const hex = crypto.randomBytes(4).toString("hex");
      const id = parseInt(hex, 16);

      console.log(req.body);
      var jsonObj = req.body;
      jsonObj.listId = id;
      const doc = new this.Lists.model(jsonObj);
      try {
        await doc.save();
        res.send('{"id":"' + id + '"}');
      } catch (e) {
        console.log("object creation failed");
        console.error(e);
      }
    });

    router.get("/app/list/:listId/tasks", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Tasks.retrieveTasksDetails(res, id);
    });

    router.get("/app/list/", async (req, res) => {
      console.log("Query All list");
      await this.Lists.retrieveAllLists(res);
    });

    router.get("/app/listcount", async (req, res) => {
      console.log("Query the number of list elements in db");
      await this.Lists.retrieveListCount(res);
    });

    //SURVEYSAGE APP

    //SURVEY ROUTES

    //Get survey using surveyId
    router.get("/app/survey/:surveyId", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query single survey with id: " + id);
      await this.Surveys.getSurveyById(res, id);
    });

    router.get("/app/surveys", async (req, res) => {
      await this.Surveys.getAllSurveys(res)
    })

    //Get number of survey
    router.get("/app/surveycount", async (req, res) => {
      console.log("Query the number of survey elements in db");
      await this.Surveys.retrieveSurveyCount(res);
    });

    //Create new survey
    router.post("/app/survey", async (req, res) => {
      const hex = crypto.randomBytes(4).toString("hex");
      const id = parseInt(hex, 16);

      console.log(req.body);
      var jsonObj = req.body;
      jsonObj.surveyId = id;
      try {
        await this.Surveys.model.create([jsonObj]);
        res.send('{"id":"' + id + '"}');
      } catch (e) {
        console.error(e);
        console.log("object creation failed");
      }
    });

    // Questions Route
    router.get("/app/survey/:surveyId/questions", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("QUESTION: Query for survey " + id);
      await this.Questions.getSurveyQuestions(res, id)
    })
    //Get Question by id
    router.get("/app/survey/:surveyId/question/:questionId", async (req, res) => {
      const surveyId = Number(req.params.surveyId);
      const questionId = Number(req.params.questionId);
      console.log(`Query question with id ${questionId} from survey with id ${surveyId}`);
      await this.Questions.getQuestionById(res, surveyId, questionId);
    });

    // ANSWER ROUTE
    //Get all answers of an survey

    router.get("/app/survey/:surveyId/answers", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query all answers for survey with id:  " + id);
      await this.Answers.getAnswersBySurvey(res, id);
    });

    //Get all answers of a question in a survey
    router.get("/app/survey/:surveyId/:questionId/answers", async (req, res) => {
      var sid = Number(req.params.surveyId);
      var qid = Number(req.params.questionId);
      console.log("Query all answers of question with id " + qid + " from survey with id " + sid);
      await this.Answers.getAnswersBySurveyQuestion(res, sid, qid);
    });


    this.expressApp.use("/", router);
    this.expressApp.use("/jquery", express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'))
    this.expressApp.use("/bootstrap/css", express.static(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css'))
    this.expressApp.use("/bootstrap/js", express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'))
    this.expressApp.use("/app/json/", express.static(__dirname + "/app/json"));
    this.expressApp.use("/images", express.static(__dirname + "/img"));
    this.expressApp.use("/", express.static(__dirname + "/angular/dist/browser"));
  }
}


export { App };
