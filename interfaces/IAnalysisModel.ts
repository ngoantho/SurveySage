interface IAnalysisModel {
  surveyId: number;
  payload: {
    question: string;
    analysis: string;
  }[];
}

export type { IAnalysisModel }