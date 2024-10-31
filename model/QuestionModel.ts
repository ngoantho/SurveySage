import { Schema, Model, model } from "mongoose";
import { CommonModel } from "../utils/CommonModel";
import { Response } from "express";
import { IQuestionModel } from "../interfaces/IQuestionModel";

class QuestionModel extends CommonModel<IQuestionModel> {
  createSchema(): Schema {
    return new Schema(
      {
        surveyId: Number,
        questions: [
          {
            questionId: Number,
            type: String,
            isRequired: Boolean,
            text: String,
            payload: [String],
          },
        ],
      },
      { collection: "questions" }
    );
  }

  async createModel(): Promise<Model<IQuestionModel>> {
    await this.connect();
    return model<IQuestionModel>("QuestionModel", this.schema, "questions");
  }

  async getSurveyQuestions(response: Response, surID: number) {
    let query = this.model.find({ surveyId: surID });
    try {
      let questions = await query.lean().exec();
      response.json(questions);
    } catch (e) {
      response.send(e);
    }
  }

  async getQuestionById(response: Response, surveyId: number, questionId: number) {
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
}

export { QuestionModel };
