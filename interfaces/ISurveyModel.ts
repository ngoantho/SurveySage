import { Document } from 'mongoose';
import { IQuestionModel } from './IQuestionModel';


interface ISurvey {
  surveyId: number;
  name: string;
  description: string;
  owner: string;
  status: string;
}

interface ISurveyModel extends Document, ISurvey {}

export type { ISurveyModel, ISurvey }