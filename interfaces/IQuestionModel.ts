interface IQuestionModel {
  surveyId: number,
  userId: number,
  questions: [{
    questionId: number;
    type: string;
    isRequired: boolean;
    text: string;
    payload: string[];
  }];
}

export type { IQuestionModel }