import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

import { IQuestionModel, ISurveyModel } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SurveyproxyService {
  hostUrl: string = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  getListsIndex() {
    return this.httpClient.get<ISurveyModel[]>(this.hostUrl + '/api/surveys');
  }

  getSurvey(index: string) {
    return this.httpClient.get<ISurveyModel>(
      this.hostUrl + '/api/survey/' + index
    );
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<number>(
      `${this.hostUrl}/api/survey/${index}/responses`
    );
  }

  getQuestions(index: string) {
    return this.httpClient.get<IQuestionModel[]>(
      this.hostUrl + '/api/survey/' + index + '/questions'
    );
  }
}
