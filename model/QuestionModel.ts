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
            isRequired: {
              type: Boolean,
              default: true,
            },
            text: String,
            payload: [String]
          },
        ],
      },
      { collection: "questions" }
    );
  }

  async createModel(): Promise<Model<IQuestionModel>> {
    await this.connect()
    return model<IQuestionModel>("QuestionModel", this.schema, "questions");
  }

  async getSurveyQuestions(response: Response, surveyId: number) {
    let query = this.model.find({ surveyId });
    try {
      let questions = await query.exec();
      response.json(questions);
    } catch (e) {
      response.send(e);
    }
  }
}

export { QuestionModel };
