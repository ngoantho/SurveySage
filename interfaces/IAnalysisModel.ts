import { Document } from 'mongoose';

interface IAnalysisModel extends Document {
  surveyId: number;
  payload: {
    question: string;
    analysis: string;
  }[];
}

export type {IAnalysisModel}