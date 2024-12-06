import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

import { IQuestionModel, ISurveyModel } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SurveyproxyService {
  constructor(private httpClient: HttpClient) {}

  getListsIndex() {
    return this.httpClient.get<ISurveyModel[]>('/api/surveys');
  }

  getSurvey(index: string) {
    return this.httpClient.get<ISurveyModel>(`/api/survey/${index}`);
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<number>(`/api/survey/${index}/responses`);
  }

  getQuestions(index: string) {
    return this.httpClient.get<IQuestionModel[]>(`/api/survey/${index}/questions`);
  }
}
