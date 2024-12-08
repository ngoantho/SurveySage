import { Document } from 'mongoose';
import { IQuestionModel } from './IQuestionModel';
interface ISurveyModel extends Document {
  surveyId: number;
  name: string;
  description: string;
  owner: string;
  status: string;
}

export type {ISurveyModel}