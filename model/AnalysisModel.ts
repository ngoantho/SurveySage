import { Schema } from "mongoose";
import { IAnalysisModel } from "../interfaces/IAnalysisModel";
import { Response } from "express";
import { CommonModel } from "./CommonModel";

class AnalysisModel extends CommonModel<IAnalysisModel> {
  createSchema(): Schema {
    return new Schema(
        {
            surveyId: { type: Number, required: true },
            userId: {type: Number, required: true},
            payload: [
              {
                question: { type: String, required: true },
                analysis: { type: String, required: true },
              },
            ],
          },
      { collection: "analyses" }
    );
  }

  get modelName() {
    return "AnalysisModel"
  }
  
  get collectionName() {
    return "analyses"
  }

  async getAnalysisBySurvey(response: Response, surID: number, userID: number) {
    let query = this.model.find({ surveyId: surID, userId: userID });
    try {
      let analysis = await query.lean().exec();
      response.json(analysis);
    } catch (e) {
      response.send(e);
    }
  }
}
  export {AnalysisModel};
