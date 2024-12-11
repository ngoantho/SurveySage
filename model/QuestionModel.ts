import { Schema, Model, model } from "mongoose";
import { CommonModel } from "./CommonModel";
import { Response } from "express";
import { IQuestionModel } from "../interfaces/IQuestionModel";
import { generateId } from "../App";

class QuestionModel extends CommonModel<IQuestionModel> {
  createSchema(): Schema {
    return new Schema(
      {
        surveyId: Number,
        userId: Number,
        questions: [
          {
            questionId: Number,
            type: { type: String },
            isRequired: Boolean,
            text: String,
            payload: [String],
          },
        ],
      },
      { collection: "questions" }
    );
  }

  get modelName() {
    return "QuestionModel"
  }

  get collectionName() {
    return "questions"
  }

  async getSurveyQuestions(response: Response, surveyId: number, userId: number) {
    let query = this.model.findOne({ surveyId, userId });
    try {
      let questions = await query.lean().exec();
      response.json(questions);
    } catch (e) {
      response.send(e);
    }
  }

  async getSurveyQuestions_unprotected(response: Response, surID: number) {
    let query = this.model.findOne({ surveyId: surID });
    try {
      let questions = await query.lean().exec();
      response.json(questions);
    } catch (e) {
      response.send(e);
    }
  }
  
  async getQuestionById(response: Response, surveyId: number, userId: number, questionId: number) {
    try {
      const survey = await this.model.findOne({ surveyId, userId }).lean().exec();
      if (survey) {
        const question = survey.questions.find(q => q.questionId === questionId);
        if (question) {
          response.json(question);
        } else {
          response.status(404).send('Question not found');
        }
      } else {
        response.status(404).send('Survey not found');
      }
    } catch (e) {
      console.error(e);
      response.status(500).send('Internal server error');
    }
  }

  async replaceQuestions(response: Response, surveyId: number, userId:number, questions) {
    try {
      let survey = await this.model.findOne({ surveyId, userId });
      if (survey) {
        questions.forEach(question => {
          if (!question.questionId) {
            question.questionId = generateId()
          }
        });
        survey.questions = questions;
        await survey.save()
      } else {
        response.status(404).send('Survey not found');
      }
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
    response.status(200).send()
  }

  async replaceQuestions_unprotected(response: Response, surveyId: number, questions) {
    try {
      let survey = await this.model.findOne({ surveyId });
      if (survey) {
        questions.forEach(question => {
          if (!question.questionId) {
            question.questionId = generateId()
          }
        });
        survey.questions = questions;
        await survey.save()
      } else {
        response.status(404).send('Survey not found');
      }
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
    response.status(200).send()
  }

  async getQuestionById_unprotected(response: Response, surveyId: number, questionId: number) {
    try {
      const survey = await this.model.findOne({ surveyId }).lean().exec();
      if (survey) {
        const question = survey.questions.find(q => q.questionId === questionId);
        if (question) {
          response.json(question);
        } else {
          response.status(404).send('Question not found');
        }
      } else {
        response.status(404).send('Survey not found');
      }
    } catch (e) {
      console.error(e);
      response.status(500).send('Internal server error');
    }
  }
  
  //RETURN INSTEAD OF RESPONSE
  async returnSurveyQuestions( surID: number) {
    let query = this.model.find({ surveyId: surID });
    try {
      let questions = await query.lean().exec();
      return questions;
    } catch (e) {
      throw new Error("Failed to retrieve questions");
    }
  }
}

export { QuestionModel };
