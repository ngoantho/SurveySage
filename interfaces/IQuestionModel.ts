import { Document } from "mongoose";

interface IQuestionModel extends Document {
  surveyId: number,
  questions: [{
    questionId: number,
    type: string;
    isRequired: boolean;
    text: string;
    payload: string[];
  }];
}

export type { IQuestionModel }