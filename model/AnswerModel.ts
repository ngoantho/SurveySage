import { Schema, Model, connect, model } from "mongoose";
import { CommonModel } from "./CommonModel";
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

  get modelName() {
    return "AnswerModel"
  }

  get collectionName() {
    return "answers"
  }

  async getAnswersBySurvey(response: Response, surID: number) {
    let query = this.model.find({ surveyId: surID });
    try {
      let answers = await query.lean().exec();
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
      let answerContent = await query.exec();
      const payload = answerContent.answers.map(answer => answer.payload).flat();
      response.json(payload);
    } catch (e) {
      response.send(e);
    }
  }
  
  //RETURN INSTEAD OF RESPONSE
  async returnAnswersBySurveyQuestion(
    surId: number,
    quesId: number
  ) {
    let query = this.model.findOne({ surveyId : surId, questionId : quesId});
    try {
      let answerContent = await query.exec();
      const payload = answerContent.answers.map(answer => answer.payload).flat();
      return payload;
    } catch (e) {
      throw new Error("Failed to retrieve answers");
    }
  }

  
}

export { AnswerModel };
