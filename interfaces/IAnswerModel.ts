import { Document } from "mongoose";

interface IAnswerModel extends Document {
  surveyId: number;
  questionId: number;
  answers: [{
    answerId: number;
    payload: string[];
  }];
}

export type { IAnswerModel };