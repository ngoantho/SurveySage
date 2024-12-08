import { Schema, Model, connect, model } from "mongoose";
import { IAnalysisModel } from "../interfaces/IAnalysisModel";
import { Response } from "express";
import { CommonModel } from "../utils/CommonModel";

class AnalysisModel extends CommonModel<IAnalysisModel> {
  createSchema(): Schema {
    return new Schema(
        {
            surveyId: { type: Number, required: true },
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

  async createModel(): Promise<Model<IAnalysisModel>> {
    await this.connect()
    return model<IAnalysisModel>("AnalysisModel", this.schema, "analyses")
  }

  async getAnalysisBySurvey(response: Response, surID: number) {
    let query = this.model.find({ surveyId: surID });
    try {
      let analysis = await query.lean().exec();
      response.json(analysis);
    } catch (e) {
      response.send(e);
    }
  }
}
  export {AnalysisModel};
