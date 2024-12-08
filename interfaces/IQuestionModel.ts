interface IQuestionModel {
  surveyId: number,
  questions: [{
    questionId: number;
    type: string;
    isRequired: boolean;
    text: string;
    payload: string[];
  }];
}

export type { IQuestionModel }