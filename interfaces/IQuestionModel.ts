interface IQuestion {
  questionId: number;
  type: string;
  isRequired: boolean;
  text: string;
  payload: string[];
}

interface IQuestionModel {
  surveyId: number,
  userId: number,
  questions: IQuestion[]
}

export type { IQuestionModel, IQuestion }