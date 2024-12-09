interface IAnswerModel {
  surveyId: number;
  questionId: number;
  userId: number;
  answers: [{
    answerId: number;
    payload: string[];
  }];
}

export type { IAnswerModel };