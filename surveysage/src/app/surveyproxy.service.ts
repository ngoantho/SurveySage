import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyproxyService {
  hostUrl:string = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  getListsIndex() {
    return this.httpClient.get<any[]>( this.hostUrl + 'app/surveys');  
  }

  getSurvey(index: string) {
    return this.httpClient.get<Object>(this.hostUrl + 'app/survey/' + index);
  }

  getSurveyResponses(index: string) {
    return this.httpClient.get<any>(`${this.hostUrl}app/survey/${index}/responses`);
  }

  getQuestions(index: string) {
    return this.httpClient.get( this.hostUrl + 'app/survey/' + index + '/questions');
  }
}
