import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IQuestionModel, ISurvey } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SurveyproxyService {
  private apiServer: string = "";

  constructor(private httpClient: HttpClient) {
    console.log(location.host)
    // https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
    // if (location.host == "localhost:4200") {
    //   this.apiServer = "http://localhost:8080"
    // } else {
    //   this.apiServer = ""
    // }
  }

  getListsIndex() {
    return this.httpClient.get<ISurvey[]>(`${this.apiServer}/api/surveys`);
  }

  getSurvey(index: string) {
    return this.httpClient.get<ISurvey>(`${this.apiServer}/api/survey/${index}`);
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<number>(`${this.apiServer}/api/survey/${index}/responses`);
  }

  getQuestions(index: string) {
    return this.httpClient.get<IQuestionModel[]>(`${this.apiServer}/api/survey/${index}/questions`);
  }

  postSurvey(survey: ISurvey) {
    return this.httpClient.post<number>(`${this.apiServer}/api/survey`, survey);
  }

  postQuestions(index: number, questions: any[]) {
    return this.httpClient.post(`${this.apiServer}/api/survey/${index}/questions`, { questions });
  }

  postAnswers(surveyId: string, answers: any[]) {
    return this.httpClient.post(`${this.apiServer}/api/survey/${surveyId}/answers`, { answers });
  }
}
