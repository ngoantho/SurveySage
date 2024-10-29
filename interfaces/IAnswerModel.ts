import { Document } from "mongoose";

interface IAnswerModel extends Document {
  answerId: number;
  surveyId: number;
  questionId: number;
  respondentId: number;
  answerText: string;
}
export {IAnswerModel}