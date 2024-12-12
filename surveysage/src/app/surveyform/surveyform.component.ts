import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { SurveyproxyService } from '../surveyproxy.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IQuestionModel } from '../interfaces';

@Component({
  selector: 'app-surveyform',
  templateUrl: './surveyform.component.html',
  styleUrl: './surveyform.component.css'
})
export class SurveyFormComponent {
  surveyId: string;
  surveyName: string | undefined;
  surveyQuestions: IQuestionModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private list$: SurveyproxyService
  ) { 
    this.surveyId = route.snapshot.params['id'];
    
    this.list$.getSurvey(this.surveyId).subscribe((res) => {
      this.surveyName = res.name
    })

    this.list$.getQuestions(this.surveyId).subscribe((res) => {
      this.surveyQuestions = res;
      console.log("surveyQuestions:", this.surveyQuestions);
      console.log("surveyQuestions.questions:", this.surveyQuestions.questions);
    });
  }

  ngOnInit():void {}
}
