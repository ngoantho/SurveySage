import { Schema, Model, connect, model } from "mongoose";
import { ISurveyModel } from "../interfaces/ISurveyModel";
import { Response } from "express";

class SurveyModel {
  public schema: Schema;
  public model: Model<ISurveyModel>;
  public dbConnectionString: string;

  public constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
  }

  public createSchema() {
    this.schema = new Schema(
      {
        surveyId: Number,
        name: String,
        description: String,
        status: String,
      },
      { collection: "surveys" }
    );
  }

  public async createModel() {
    try {
      await connect(this.dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.model = model<ISurveyModel>("Surveys", this.schema);
    } catch (e) {
      console.error(e);
    }
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
