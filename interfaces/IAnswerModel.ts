import { Document } from "mongoose";

interface IAnswerModel extends Document {

  surveyId: number;
  questionId: number;
  answer: [{
    answerId: number;
    payload: string[];
  }];
}
export { IAnswerModel }