import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  getItems(index: string) {
    return this.httpClient.get( this.hostUrl + 'app/survey/' + index + '/questions');
  }
}
