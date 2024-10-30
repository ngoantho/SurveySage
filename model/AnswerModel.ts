import { Schema, Model, connect, model } from "mongoose";
import { CommonModel } from "../utils/CommonModel";
import { Response } from "express";
import { IAnswerModel } from "../interfaces/IAnswerModel";

class AnswerModel extends CommonModel<IAnswerModel> {
  createSchema(): Schema {
    return new Schema(
      {
        surveyId: Number,
        questionId: Number,
        answers: [
          {
            answerId: Number,
            payload: [String],
          },
        ],
      },
      { collection: "answers" }
    );
  }

  async createModel(): Promise<Model<IAnswerModel>> {
    await this.connect()
    return model<IAnswerModel>("Answers", this.schema, "answers");
  }

  async getAnswersBySurvey(response: Response, surveyId: number) {
    let query = this.model.find({ surveyId });
    try {
      let answers = await query.exec();
      response.json(answers);
    } catch (e) {
      response.send(e);
    }
  }

  async getAnswersBySurveyQuestion(
    response: Response,
    surveyId: number,
    questionId: number
  ) {
    let query = this.model.findOne({ surveyId, questionId });
    try {
      let answer = await query.exec();
      response.json(answer);
    } catch (e) {
      response.send(e);
    }
  }
}

export { AnswerModel };
