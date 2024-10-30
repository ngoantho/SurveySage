import { Document } from "mongoose";
import { IAnswerModel } from "./IAnswerModel";

interface IQuestionModel extends Document {
  questionId: number;
  questions: [{
    surveyId: number;
    type: string;
    isRequired: boolean;
    payload: string[];
  }];
}
export { IQuestionModel }