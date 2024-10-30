import { Document } from "mongoose";
import { IAnswerModel } from "./IAnswerModel";

interface IQuestionModel extends Document {
  questionId: number;
  questions: [{
    surveyId: number;
    type: string;
    isRequired: boolean;
    text: string;
    payload: string[];
  }];
}
export { IQuestionModel }