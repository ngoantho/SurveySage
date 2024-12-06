import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

import { IQuestionModel, ISurveyModel } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SurveyproxyService {
  private apiServer?: string;

  constructor(private httpClient: HttpClient) {
    console.log(location.host)
    if (location.host == "localhost:4200") {
      this.apiServer = "http://localhost:8080"
    } else {
      this.apiServer = "https://surveysage.azurewebsites.net"
    }
  }

  getListsIndex() {
    return this.httpClient.get<ISurveyModel[]>(`${this.apiServer}/api/surveys`);
  }

  getSurvey(index: string) {
    return this.httpClient.get<ISurveyModel>(`${this.apiServer}/api/survey/${index}`);
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<number>(`${this.apiServer}/api/survey/${index}/responses`);
  }

  getQuestions(index: string) {
    return this.httpClient.get<IQuestionModel[]>(`${this.apiServer}/api/survey/${index}/questions`);
  }

  getAPISurveyRoute() {
    return `${this.apiServer}/api/survey`
  }
}
