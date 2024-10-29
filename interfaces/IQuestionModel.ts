import { Document } from "mongoose";
import { IAnswerModel } from "./IAnswerModel";

interface IQuestionModel extends Document {
  questionId: number;
  surveyId: number;
  type: string;
  text: string;
  isRequired: boolean;
  options: string[];
}
export {IQuestionModel}