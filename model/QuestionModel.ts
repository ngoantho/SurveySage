import { Schema, Model, connect, model } from "mongoose";
import { CommonModel } from "../utils/CommonModel";
import { Response } from "express";
import { IQuestionModel } from "../interfaces/IQuestionModel";

class QuestionModel extends CommonModel<IQuestionModel> {
  createSchema(): Schema {
    return new Schema({
      surveyId: Number,
      questions: [
        {
          questionId: Number,
          type: String,
          text: String,
          isRequired: {
            type: Boolean,
            default: true
          },
          options: {
            type: [String],
            default: []
          }
        }
      ]
    }, { collection: 'questions' }
    )
  }

  createModel(): Model<IQuestionModel> {
    connect(this.dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      return model<IQuestionModel>("Questions", this.schema)
    })
    return null
  }

  async getSurveyQuestions(response: Response, surveyId: number) {
    let query = this.model.find({ surveyId })
    try {
      let questions = await query.exec()
      response.json(questions)
    } catch (e) {
      response.send(e)
    }
  }
}

export { QuestionModel }
