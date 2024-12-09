interface IAnalysisModel {
  surveyId: number;
  userId: number;
  payload: {
    question: string;
    analysis: string;
  }[];
}

export type { IAnalysisModel }