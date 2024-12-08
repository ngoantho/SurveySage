interface IAnswerModel {
  surveyId: number;
  questionId: number;
  answers: [{
    answerId: number;
    payload: string[];
  }];
}

export type { IAnswerModel };