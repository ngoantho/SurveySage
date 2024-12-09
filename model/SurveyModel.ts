import { Schema } from "mongoose";
import { ISurvey } from "../interfaces/ISurvey";
import { Response } from "express";
import { CommonModel } from "./CommonModel";

class SurveyModel extends CommonModel<ISurvey> {
  createSchema(): Schema {
    return new Schema(
      {
        surveyId: Number,
        userId: Number,
        name: String,
        description: String,
        owner: String,
        status: {
          type: String,
          enum: ['draft', 'published', 'ended']
        }
      },
      { collection: "surveys" }
    );
  }

  get modelName() {
    return "SurveyModel"
  }

  get collectionName() {
    return "surveys"
  }

  public async getAllSurveys(response: Response, id: number) {
    let query = this.model.find({userId: id})
    try {
      const surveys = await query.exec()
      response.json(surveys)
    } catch(e) {
      response.send(e)
    }
  }

  public async getSurveyById(response: Response, surveyId: number, userId: number) {
    let query = this.model.findOne({surveyId, userId})
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

//TEST PURPOSE

public async getAllSurveys_unprotection(response: Response) {
  let query = this.model.find({})
  try {
    const surveys = await query.exec()
    response.json(surveys)
  } catch(e) {
    response.send(e)
  }
}

public async getSurveyById_unprotection(response: Response, id: number) {
  let query = this.model.findOne({surveyId: id})
  try {
    const survey = await query.exec()
    response.json(survey)
  } catch(e) {
    response.send(e)
  }
}
}
export { SurveyModel };
