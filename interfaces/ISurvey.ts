interface ISurvey {
  surveyId: number;
  userId: number;
  name: string;
  description: string;
  owner: string;
  status: string;
}

export type { ISurvey }