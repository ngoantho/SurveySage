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
        owner: String,
        status: String
      },
      { collection: "surveys" }
    );
  }

  async createModel(): Promise<Model<ISurveyModel>> {
    await this.connect()
    return model<ISurveyModel>("SurveyModel", this.schema, "surveys")
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

  public async getSurveyById(response: Response, id: number) {
    let query = this.model.findOne({surveyId: id})
    try {
      const survey = await query.exec()
      response.json(survey)
    } catch(e) {
      response.send(e)
    }
  }

  

  public async retrieveSurveyCount(response:any) {
    console.log("retrieve Survey Count ...");
    var query = this.model.estimatedDocumentCount();
    try {
        const numberOfLists = await query.exec();
        console.log("numberOfSurvey: " + numberOfLists);
        response.json(numberOfLists);
    }
    catch (e) {
        console.error(e);
    }
}

//RETURN SURVEY INSTEAD OF RESPONSE
public async returnSurveyById( id: number) {
  let query = this.model.findOne({surveyId: id})
  try {
    const survey = await query.exec()
    return survey;
  } catch(e) {
    throw new Error("Failed to retrieve survey");
  }
}
}
export { SurveyModel };
