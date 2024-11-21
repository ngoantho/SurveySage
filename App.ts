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
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI} from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve the GEMINI API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Retrieve the OPENAI API key from environment variables
const OpenAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI();

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
      console.log("Get all surveys");
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

    router.get("/app/survey/:surveyId/responses", async (req, res) => {
      try {
        const surveyId = Number(req.params.surveyId);
        const questions = await this.Questions.returnSurveyQuestions(surveyId);
        
        if (!questions || !questions[0]?.questions) {
          res.status(404).json({ error: "No questions found" });
        }
    
        let questionId = null;
        for (const question of questions[0].questions) {
          if (question.isRequired) {
            questionId = question.questionId;
            break;
          }
        }
    
        let answers = await this.Answers.returnAnswersBySurveyQuestion(surveyId, questionId)
        res.json(answers.length)
      } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    // ANSWER ROUTE
    //Get all answers of an survey

    router.get("/app/survey/:surveyId/answers", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query all answers for survey with id:  " + id);
      await this.Answers.getAnswersBySurvey(res, id);
    });

    //Get all answers of a question in a survey
    router.get("/app/survey/:surveyId/question/:questionId/answers", async (req, res) => {
      var sid = Number(req.params.surveyId);
      var qid = Number(req.params.questionId);
      console.log("Query all answers of question with id " + qid + " from survey with id " + sid);
      await this.Answers.getAnswersBySurveyQuestion(res, sid, qid);
    });

    // SURVEY&ANALYSIS GENERATE ROUTE

    router.get("/app/survey/:surveyId/generateSurvey", async (req, res) => {
      var surveyId = Number(req.params.surveyId);
      const survey = await this.Surveys.returnSurveyById(surveyId);
      const questionsLoad = await this.Questions.returnSurveyQuestions(surveyId);
      
      // Combine survey, questions, and answers
      const surveyDetails = {
        surveyName: survey.name, // Use 'name' for survey title
        questions: await Promise.all(
          questionsLoad[0].questions.map(async (question: any) => {
            const answers = await this.Answers.returnAnswersBySurveyQuestion(
              surveyId,
              question.questionId
            );
            return {
              question: question.text, // Assuming 'text' is inside the nested objects
              answers, // Include the answer payload for the question
            };
          })
        ),
      };

      
    console.log("Generate survey with id:", surveyId)
    res.json(surveyDetails);

    });

    //Gemini Analysis
    router.get("/app/survey/:surveyId/generateAnalysis", async (req, res) => {
      var surveyId = Number(req.params.surveyId);
      const survey = await this.Surveys.returnSurveyById(surveyId);
      const questionsLoad = await this.Questions.returnSurveyQuestions(surveyId);
      
      // Combine survey, questions, and answers
      const surveyDetails = {
        surveyName: survey.name, // Use 'name' for survey title
        questions: await Promise.all(
          questionsLoad[0].questions.map(async (question: any) => {
            const answers = await this.Answers.returnAnswersBySurveyQuestion(
              surveyId,
              question.questionId
            );
            return {
              question: question.text, // Assuming 'text' is inside the nested objects
              answers, // Include the answer payload for the question
            };
          })
        ),
      };

      const prompt = `${JSON.stringify(
        surveyDetails
      )} Provide the thoughtful analysis for the answers of each question for this survey (Despite the size of the survey sample). For your context, answers are the collection of answers from the responders who completed the survey (i.e, if answers = ['No','Yes','No'], that means Respondant 1 answers no, Respondent 2 answer yes, Respondent 3 answer no)
Return result as a JSON object with the format: [{question:analysis}, {question:analysis}, ...]`;
      
      const result = await model.generateContent(prompt);
      const rawResponse = await result.response.text();

    console.log("Raw Response:", rawResponse); // Debug raw response

    // Clean up the response by removing the backticks and `json` markers
    const cleanedResponse = rawResponse
      .replace(/```json/g, "") // Remove starting code block marker
      .replace(/```/g, ""); // Remove ending code block marker

    console.log("Cleaned Response:", cleanedResponse); // Debug cleaned response

    const report = JSON.parse(cleanedResponse); // Parse the cleaned response

    res.json(report); // Send JSON response
    console.log("Generate analysis with id:", surveyId);
    });

    //CHATGPT Analysis
    router.get("/app/survey/:surveyId/ChatGPTAnalysis", async (req, res) => {
      var surveyId = Number(req.params.surveyId);
      const survey = await this.Surveys.returnSurveyById(surveyId);
      const questionsLoad = await this.Questions.returnSurveyQuestions(surveyId);
      
      // Combine survey, questions, and answers
      const surveyDetails = {
        surveyName: survey.name, // Use 'name' for survey title
        questions: await Promise.all(
          questionsLoad[0].questions.map(async (question: any) => {
            const answers = await this.Answers.returnAnswersBySurveyQuestion(
              surveyId,
              question.questionId
            );
            return {
              question: question.text, // Assuming 'text' is inside the nested objects
              answers, // Include the answer payload for the question
            };
          })
        ),
      };

      const prompt = `${JSON.stringify(
        surveyDetails
      )} Provide the thoughtful analysis for the answers of each question for this survey (Despite the size of the survey sample). For your context, answers are the collection of answers from the responders who completed the survey (i.e, if answers = ['No','Yes','No'], that means Respondant 1 answers no, Respondent 2 answer yes, Respondent 3 answer no)
Return result as a JSON object with the format: [{"question":question.text,"analysis": analysis content}, ...]`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a data analyst providing thoughtful survey analysis." },
          { role: "user", content: prompt },
        ],
      });
      const rawResponse = response.choices[0].message?.content || ""; // Get the AI's response

      console.log("Raw Response:", rawResponse);

      // Clean up the response if it contains backticks or formatting
      const cleanedResponse = rawResponse
        .replace(/```json/g, "") // Remove starting code block marker
        .replace(/```/g, ""); // Remove ending code block marker

      console.log("Cleaned Response:", cleanedResponse);

      // Parse the response into JSON
      const report = JSON.parse(cleanedResponse); // Parse cleaned JSON string

      console.log(" CHATGPT Generate analysis with id:", surveyId);
      res.json(report); // Send the JSON response

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
