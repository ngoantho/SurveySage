import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

import { IQuestionModel, ISurveyModel, IAnalysisModel } from './interfaces';

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
      this.apiServer = ""
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

  postAnswers(surveyId: string, answers: any[]) {
    return this.httpClient.post(`${this.apiServer}/api/survey/${surveyId}/answers`, { answers });
  }

  getAnalysis(index:string){
    return this.httpClient.get<IAnalysisModel[]>(`${this.apiServer}/api/survey/${index}/getAnalysis`);
  }

  generateAnalysis(index:string){
    return this.httpClient.get(`${this.apiServer}/api/survey/${index}/ChatGPTAnalysis/save`);
  }
}
