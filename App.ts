import * as express from "express";
import * as bodyParser from "body-parser";
import { ListModel } from "./model/ListModel";
import { TaskModel } from "./model/TaskModel";
import * as crypto from "crypto";
import { SurveyModel } from "./model/SurveyModel";
import { QuestionModel } from "./model/QuestionModel";
import { AnswerModel } from "./model/AnswerModel";
import { AnalysisModel } from "./model/AnalysisModel";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import * as passport from "passport";
import GooglePassportObj from "./GooglePassport";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { UserModel } from "./model/UserModel";

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
  public Analysis: AnalysisModel;
  public Users: UserModel;
  public googlePassportObj: GooglePassportObj;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.googlePassportObj = new GooglePassportObj();
    this.Lists = new ListModel(mongoDBConnection);
    this.Tasks = new TaskModel(mongoDBConnection);
    this.Surveys = new SurveyModel(mongoDBConnection);
    this.Questions = new QuestionModel(mongoDBConnection);
    this.Answers = new AnswerModel(mongoDBConnection);
    this.Analysis = new AnalysisModel(mongoDBConnection);
    this.Users = new UserModel(mongoDBConnection);
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
    this.expressApp.use(session({ secret: "keyboard cat" }));
    this.expressApp.use(cookieParser());
    this.expressApp.use(passport.initialize());
    this.expressApp.use(passport.session());
  }

  private validateAuth(req, res, next: express.NextFunction): void {
    if (req.isAuthenticated()) {
      console.log("user is authenticated", req.route);
      return next();
    }
    console.log("user is not authenticated", req.route);
    res.redirect("/");
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    router.get(
      "/auth/login",
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      })
    );

    router.get(
      "/auth/login/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        console.log(
          "successfully authenticated user and returned to callback page"
        );

        console.log("ID: ", req["user"].id);
        console.log("email: ", req["user"].emails[0].value);
        
        console.log("redirecting to /");
        res.redirect("/");
      }
    );

    router.get("/auth/status", async (req, res) => {
      res.json(req["user"] ? true : false);
    });

    router.get('/auth/logout', this.validateAuth, async (req, res, next) => {
      req['logout'](function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    })

    router.get("/auth/id", this.validateAuth, async (req, res) => {
      res.json(req["user"].id);
    });

    router.get("/auth/email", this.validateAuth, async (req, res) => {
      res.json(req["user"].emails[0].value);
    });

    router.get('/auth/displayName', this.validateAuth, async (req, res) => {
      res.json(req["user"].displayName);
    })

    router.get("/api/list/:listId/count", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Tasks.retrieveTasksCount(res, id);
    });

    router.get("/api/list/:listId", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Lists.retrieveLists(res, id);
    });

    router.post("/api/list/", async (req, res) => {
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

    router.post("/api/list2/", async (req, res) => {
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

    router.get("/api/list/:listId/tasks", async (req, res) => {
      var id = Number(req.params.listId);
      console.log("Query single list with id: " + id);
      await this.Tasks.retrieveTasksDetails(res, id);
    });

    router.get("/api/list/", async (req, res) => {
      console.log("Query All list");
      await this.Lists.retrieveAllLists(res);
    });

    router.get("/api/listcount", async (req, res) => {
      console.log("Query the number of list elements in db");
      await this.Lists.retrieveListCount(res);
    });

    //SURVEYSAGE APP

    //SURVEY ROUTES

    //Get survey using surveyId
    router.get("/api/survey/:surveyId", this.validateAuth, async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query single survey with id: " + id);
      await this.Surveys.getSurveyById(res, id, req["user"].id);
    });

    router.get("/api/surveys", this.validateAuth, async (req, res) => {
      console.log("Get all surveys");
      await this.Surveys.getAllSurveys(res, req["user"].id);
    });

    //Get number of survey
    router.get("/api/surveycount", async (req, res) => {
      console.log("Query the number of survey elements in db");
      await this.Surveys.retrieveSurveyCount(res);
    });

    //Create new survey
    router.post("/api/survey", async (req, res) => {
      console.log("POST /api/survey", req.body);
      var jsonObj = req.body;
      if (!jsonObj.surveyId) {
        // survey Id not present
        const hex = crypto.randomBytes(4).toString("hex");
        const id = parseInt(hex, 16);
        jsonObj.surveyId = id;
      }

      try {
        await this.Surveys.model.create([jsonObj]);
        res.json(jsonObj.surveyId);
      } catch (e) {
        console.error(e);
        console.log("object creation failed");
      }
    });

    router.patch("/api/survey/:surveyId/", async (req, res) => {
      const surveyId = Number(req.params.surveyId);
      const { command, payload } = req.body;
      console.log(`PATCH survey ${surveyId}`, req.body);

      try {
        if (command == "status") {
          let survey = await this.Surveys.model.findOneAndUpdate(
            { surveyId },
            { status: payload },
            { new: true }
          );
          res.send(200).json();
        }
      } catch (e) {
        console.error(e);
        console.log("object creation failed");
      }
    });

    // Questions Route
    router.post("/api/survey/:surveyId/questions", async (req, res) => {
      const surveyId = Number(req.params.surveyId);
      const questions = req.body.questions; // Expecting an array of answers

      console.log(`POST: Adding questions for Survey ID: ${surveyId}`);

      try {
        // Iterate through each question and update the corresponding question
        for (const question of questions) {
          if (!question.questionId) {
            // survey Id not present
            const hex = crypto.randomBytes(4).toString("hex");
            const id = parseInt(hex, 16);
            question.questionId = id;
          }

          // Validate individual question
          if (!question.questionId || !Array.isArray(question.payload)) {
            console.error("Invalid question format:", question);
            continue; // Skip invalid questions
          }

          // Find the existing questions document for the survey
          const questionDoc = await this.Questions.model.findOne({ surveyId });

          if (questionDoc) {
            // Update the existing document by adding the new question
            questionDoc.questions.push(question);
            await questionDoc.save();
          } else {
            // Create a new document if no questions exist for this survey
            const newQuestionDoc = {
              surveyId,
              questions: [question],
            };
            await this.Questions.model.create(newQuestionDoc);
          }
        }

        res.status(201).json({ message: "Questions submitted successfully." });
      } catch (error) {
        console.error("Error submitting questions:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    });

    router.get("/api/survey/:surveyId/questions", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("QUESTION: Query for survey " + id);
      await this.Questions.getSurveyQuestions(res, id);
    });

    //Get Question by id
    router.get(
      "/api/survey/:surveyId/question/:questionId",
      async (req, res) => {
        const surveyId = Number(req.params.surveyId);
        const questionId = Number(req.params.questionId);
        console.log(
          `Query question with id ${questionId} from survey with id ${surveyId}`
        );
        await this.Questions.getQuestionById(res, surveyId, questionId);
      }
    );

    router.get("/api/survey/:surveyId/responses",this.validateAuth, async (req, res) => {
      try {
        const surveyId = Number(req.params.surveyId);
        const questions = await this.Questions.returnSurveyQuestions(surveyId);

        if (!questions || !questions[0]?.questions) {
          res.status(404).json({ error: "No questions found" });
          return;
        }

        let questionId = null;
        for (const question of questions[0].questions) {
          if (question.isRequired) {
            questionId = question.questionId;
            break;
          }
        }

        let answers = await this.Answers.returnAnswersBySurveyQuestion(
          surveyId,
          questionId,
          req["user"].id
        );
        res.json(answers.length);
      } catch (error) {
        console.error("Error fetching survey responses:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // ANSWER ROUTE
    //Get all answers of an survey

    router.get("/api/survey/:surveyId/answers",this.validateAuth, async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query all answers for survey with id:  " + id);
      await this.Answers.getAnswersBySurvey(res, id, req["user"].id);
    });

    //Get all answers of a question in a survey
    router.get(
      "/api/survey/:surveyId/question/:questionId/answers", this.validateAuth,
      async (req, res) => {
        var sid = Number(req.params.surveyId);
        var qid = Number(req.params.questionId);
        console.log(
          "Query all answers of question with id " +
            qid +
            " from survey with id " +
            sid
        );
        await this.Answers.getAnswersBySurveyQuestion(res, sid, qid, req["user"].id);
      }
    );

    // SURVEY&ANALYSIS GENERATE ROUTE

    //Generate a complete survey with every questions and answer for each questions
    router.get("/api/survey/:surveyId/generateSurvey",this.validateAuth, async (req, res) => {
      var surveyId = Number(req.params.surveyId);
      const survey = await this.Surveys.returnSurveyById(surveyId);
      const questionsLoad = await this.Questions.returnSurveyQuestions(
        surveyId
      );

      // Combine survey, questions, and answers
      const surveyDetails = {
        surveyName: survey.name,
        questions: await Promise.all(
          questionsLoad[0].questions.map(async (question: any) => {
            const answers = await this.Answers.returnAnswersBySurveyQuestion(
              surveyId,
              question.questionId,
              req["user"].id
            );
            return {
              question: question.text,
              answers,
            };
          })
        ),
      };

      console.log("Generate survey with id:", surveyId);
      res.json(surveyDetails);
    });

    //CHATGPT Analysis

    //Posting Analysis into Database
    router.get(
      "/api/survey/:surveyId/ChatGPTAnalysis/save",this.validateAuth,
      async (req, res) => {
        var surveyId = Number(req.params.surveyId);
        const survey = await this.Surveys.returnSurveyById(surveyId);
        const questionsLoad = await this.Questions.returnSurveyQuestions(
          surveyId
        );

        // Combine survey, questions, and answers
        const surveyDetails = {
          surveyName: survey.name,
          questions: await Promise.all(
            questionsLoad[0].questions.map(async (question: any) => {
              const answers = await this.Answers.returnAnswersBySurveyQuestion(
                surveyId,
                question.questionId,
                req["user"].id
              );
              return {
                question: question.text,
                answers,
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
            {
              role: "system",
              content:
                "You are a data analyst providing thoughtful survey analysis.",
            },
            { role: "user", content: prompt },
          ],
        });
        const rawResponse = response.choices[0].message?.content || "";

        console.log("Raw Response:", rawResponse);

        // Clean up the response if it contains backticks or formatting
        const cleanedResponse = rawResponse
          .replace(/```json/g, "")
          .replace(/```/g, "");

        const report = JSON.parse(cleanedResponse); // Parse cleaned JSON string

        console.log(" CHATGPT Generate analysis with id:", surveyId);

        const modelInstance = await this.Analysis.createModel();

        // Remove the old instance (if exists) and insert the new one
        await modelInstance.deleteOne({ surveyId: surveyId }); // Remove old analysis
        await modelInstance.create({
          surveyId: surveyId,
          payload: report, // Save the new analysis
        });
        res.json(report);
      }
    );

    router.get("/api/survey/:surveyId/getAnalysis", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query analysis for survey with id: " + id);
      await this.Analysis.getAnalysisBySurvey(res, id);
    });

    //ANSWER POSTING ROUTE
    router.post("/api/survey/:surveyId/answers", async (req, res) => {
      const surveyId = Number(req.params.surveyId);
      const answers = req.body.answers; // Expecting an array of answers
      const userId = (await this.Surveys.returnSurveyById(surveyId)).userId;

      console.log(`POST: Adding answers for Survey ID: ${surveyId}`);
      console.log(`POST: Adding answers for Survey ID: ${userId}}`);

      // Validate incoming data
      if (!Array.isArray(answers) || answers.length === 0) {
        res.status(400).json({
          error: "Invalid answer format. Answers must be a non-empty array.",
        });
        return;
      }

      try {
        // Iterate through each answer and update the corresponding question
        for (const answer of answers) {
          const {questionId, payload } = answer;

          // Validate individual answer
          if (!questionId || !Array.isArray(payload)) {
            console.error("Invalid answer format:", answer);
            continue; // Skip invalid answers
          }

          // Find the existing answers document for the question
          const answerDoc = await this.Answers.model.findOne({
            surveyId,
            questionId,
            userId
          });

          if (answerDoc) {
            // Update the existing document by adding the new answer
            const newAnswerId = answerDoc.answers.length + 1;
            answerDoc.answers.push({ answerId: newAnswerId, payload });
            await answerDoc.save();
          } else {
            // Create a new document if no answers exist for this question
            const newAnswerDoc = {
              surveyId,
              questionId,
              userId,
              answers: [
                {
                  answerId: 1,
                  payload,
                },
              ],
            };
            await this.Answers.model.create(newAnswerDoc);
          }
        }

        res.status(201).json({ message: "Answers submitted successfully." });
      } catch (error) {
        console.error("Error submitting answers:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    })
    
    //TESTING ROUTE (UNPROTECTION)

    //Get survey using surveyId
    router.get("/api/test/survey/:surveyId", async (req, res) => {
      var id = Number(req.params.surveyId);
      console.log("Query single survey with id: " + id);
      await this.Surveys.getSurveyById_unprotection(res, id);
    })

    router.get("/api/test/surveys", async (req, res) => {
      console.log("Get all surveys");
      await this.Surveys.getAllSurveys_unprotection(res);
    });
    // end of router

    this.expressApp.use("/", router);
    this.expressApp.use(
      "/jquery",
      express.static(__dirname + "/node_modules/jquery/dist/jquery.min.js")
    );
    this.expressApp.use(
      "/bootstrap/css",
      express.static(
        __dirname + "/node_modules/bootstrap/dist/css/bootstrap.min.css"
      )
    );
    this.expressApp.use(
      "/bootstrap/js",
      express.static(
        __dirname + "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
      )
    );
    this.expressApp.use("/api/json/", express.static(__dirname + "/api/json"));
    this.expressApp.use("/images", express.static(__dirname + "/img"));
    this.expressApp.use(
      "/",
      express.static(__dirname + "/surveysage/dist/surveysage/browser")
    );
    this.expressApp.use(
      "*",
      express.static(
        __dirname + "/surveysage/dist/surveysage/browser/index.html"
      )
    );
  }
}

export { App };
