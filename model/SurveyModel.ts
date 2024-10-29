import { Schema, Model, connect, model } from "mongoose";
import { ISurveyModel } from "../interfaces/ISurveyModel";
import { Response } from "express";
import { CommonModel } from "../utils/CommonModel";

class SurveyModel extends CommonModel<ISurveyModel> {
  createSchema(): Schema {
    return new Schema(
      {
        surveyId: Number,
        name: String,
        description: String,
        status: String,
      },
      { collection: "surveys" }
    );
  }

  createModel(): Model<ISurveyModel> {
    connect(this.dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      return model<ISurveyModel>("Surveys", this.schema)
    })
    return null
  }

  public async getAllSurveys(response: Response) {
    let query = this.model.find({})
    try {
      const surveys = await query.exec()
      response.json(surveys)
    } catch(e) {
      response.send(e)
    }
  }

  public async getSurveyById(response: Response, surveyId: number) {
    let query = this.model.findOne({surveyId})
    try {
      const survey = await query.exec()
      response.json(survey)
    } catch(e) {
      response.send(e)
    }
  }
}
export { SurveyModel };
