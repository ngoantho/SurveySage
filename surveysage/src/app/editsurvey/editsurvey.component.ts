import { Component } from '@angular/core';
import { ISurvey } from '../interfaces';
import { ActivatedRoute } from '@angular/router';
import { SurveyproxyService } from '../surveyproxy.service';

@Component({
  selector: 'app-editsurvey',
  templateUrl: './editsurvey.component.html',
  styleUrl: './editsurvey.component.css'
})
export class EditSurveyComponent {
  survey?: ISurvey;

  constructor(private route: ActivatedRoute, private proxy: SurveyproxyService) {
    let id = route.snapshot.params['id'];
    proxy.getSurvey(id).subscribe({
      next: (survey) => {
        this.survey = survey;
        console.log(survey)
      },
    })
  }
}
