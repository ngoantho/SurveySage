import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IQuestionModel, IAnalysisModel, ISurvey } from './interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyproxyService {
  private apiServer: string = '';

  constructor(private httpClient: HttpClient) {
    console.log(location.host);
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
    return this.httpClient.get<ISurvey>(
      `${this.apiServer}/api/test/survey/${index}`
    );
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<number>(
      `${this.apiServer}/api/survey/${index}/responses`
    );
  }

  getQuestions(index: string) {
    return this.httpClient.get<IQuestionModel[]>(
      `${this.apiServer}/api/survey/${index}/questions`
    );
  }

  postSurvey(survey: ISurvey) {
    return this.httpClient.post<number>(`${this.apiServer}/api/survey`, survey);
  }

  patchSurvey(index: string, command: string, payload: any) {
    console.log('Patching survey...');
    const url = `${this.apiServer}/api/survey/${index}`;
    const body = { command, payload };

    return this.httpClient.patch(url, body);
  }

  postQuestions(index: number, questions: any[]) {
    return this.httpClient.post(
      `${this.apiServer}/api/survey/${index}/questions`,
      { questions }
    );
  }

  postAnswers(surveyId: string, answers: any[]) {
    return this.httpClient.post(
      `${this.apiServer}/api/survey/${surveyId}/answers`,
      { answers }
    );
  }

  getAnalysis(index: string) {
    return this.httpClient.get<IAnalysisModel[]>(
      `${this.apiServer}/api/survey/${index}/getAnalysis`
    );
  }

  generateAnalysis(index: string) {
    return this.httpClient.get(
      `${this.apiServer}/api/survey/${index}/ChatGPTAnalysis/save`
    );
  }

  getUserId() {
    return this.httpClient.get<string>(`${this.apiServer}/auth/id`).toPromise()
  }

  getUserEmail() {
    return this.httpClient.get<string>(`${this.apiServer}/auth/email`).toPromise()
  }

  getUserInfo() {
    return this.httpClient.get('/auth/info').toPromise()
  }
}
