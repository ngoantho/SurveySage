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
    return model<IAnswerModel>("AnswerModel", this.schema, "answers");
  }

  async getAnswersBySurvey(response: Response, surID: number) {
    let query = this.model.find({ surveyId: surID });
    try {
      let answers = await query.exec();
      response.json(answers);
    } catch (e) {
      response.send(e);
    }
  }

  async getAnswersBySurveyQuestion(
    response: Response,
    surId: number,
    quesId: number
  ) {
    let query = this.model.findOne({ surveyId : surId, questionId : quesId});
    try {
      let answerDoc = await query.exec();
      const payload = answerDoc.answers.map(answer => answer.payload).flat();
      response.json(payload);
    } catch (e) {
      response.send(e);
    }
  }
}

export { AnswerModel };
