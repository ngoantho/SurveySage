import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { SurveyproxyService } from '../surveyproxy.service';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-surveyform',
  templateUrl: './surveyform.component.html',
  styleUrl: './surveyform.component.css'
})
export class SurveyformComponent {

  name: string = "";
  surveyId: string;
  surveyQuestions: any;

  constructor(
    private route: ActivatedRoute,
    private list$: SurveyproxyService
  ) { 
    this.surveyId = route.snapshot.params['id'];
    this.list$.getItems(this.surveyId).subscribe((res: any) => {
      this.name = res.name;
      this.surveyQuestions = res[0];
      console.log("surveyQuestions:", this.surveyQuestions); // Log surveyQuestions
      console.log("surveyQuestions.questions:", this.surveyQuestions?.questions);
    });
  }

  ngOnInit():void {}
}
