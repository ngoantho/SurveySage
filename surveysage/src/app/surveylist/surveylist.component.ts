import { Component, inject } from '@angular/core';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ISurvey } from '../interfaces';

interface IResponses {
  [key: string]: number | null;
}

@Component({
  selector: 'app-surveylist',
  templateUrl: './surveylist.component.html',
  styleUrl: './surveylist.component.css',
})
export class SurveylistComponent {
  displayedColumns = ['name', 'description', 'owner', 'responses'];
  proxy$ = inject(SurveyproxyService);
  responses: IResponses = {};
  surveys: ISurvey[] = [];
  draftSurveys = new MatTableDataSource<ISurvey>();
  publishedSurveys = new MatTableDataSource<ISurvey>();
  endedSurveys = new MatTableDataSource<ISurvey>();

  constructor(private router: Router) {
    this.proxy$.getListsIndex().subscribe(
      (result) => {
        this.surveys = result;
        this.draftSurveys.data = this.getDraftSurveys();
        this.publishedSurveys.data = this.getPublishedSurveys();
        this.endedSurveys.data = this.getEndedSurveys();

        result.forEach((survey) => {
          if (survey.status == 'published' || survey.status == 'ended') {
            let surveyId = String(survey.surveyId);
            this.proxy$.getSurveyResponses(surveyId).subscribe(
              (result) => {
                this.responses[surveyId] = result;
              },
              () => {
                console.log(`Error fetching responses for survey: ${surveyId}`);
                this.responses[surveyId] = null;
              }
            );
          }
        });
      },
      () => {
        console.error('Failed to retrieve surveys');
      }
    );
  }

  ngOnInit() {}

  clickEvent(): void {
    this.router.navigate(['']);
  }

  getDraftSurveys() {
    return this.surveys.filter((survey) => survey.status === 'draft');
  }

  getPublishedSurveys() {
    return this.surveys.filter((survey) => survey.status === 'published');
  }

  getEndedSurveys() {
    return this.surveys.filter((survey) => survey.status === 'ended');
  }
}
