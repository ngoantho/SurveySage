import { Component, inject } from '@angular/core';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ISurvey } from '../interfaces';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IResponses {
  [key: string]: number;
}

@Component({
  selector: 'app-surveylist',
  templateUrl: './surveylist.component.html',
  styleUrl: './surveylist.component.css',
})
export class SurveylistComponent {
  displayedColumns:string[] = ['name', 'description', 'owner', 'publish', 'edit'];
  proxy$ = inject(SurveyproxyService);
  responses: IResponses = {};
  surveys: ISurvey[] = [];
  draftSurveys = new MatTableDataSource<ISurvey>();
  publishedSurveys = new MatTableDataSource<ISurvey>();
  endedSurveys = new MatTableDataSource<ISurvey>();

  constructor(private router: Router, private clipboard: Clipboard, private snackBar: MatSnackBar) {
    this.proxy$.getListsIndex().subscribe(
      (result) => {
        this.surveys = result;
        this.draftSurveys.data = this.getDraftSurveys();
        this.publishedSurveys.data = this.getPublishedSurveys();
        this.endedSurveys.data = this.getEndedSurveys();

        result.forEach((survey) => {
          let surveyId = String(survey.surveyId);
          this.proxy$.getSurveyResponses(surveyId).subscribe(
            (result) => {
              this.responses[surveyId] = result;
            },
            () => {
              console.log(`Error fetching responses for survey: ${surveyId}`);
              this.responses[surveyId] = 0;
            }
          );
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

  endPublish(surveyId: string) {
    console.log('ending publishing for ', surveyId)
    this.proxy$.patchSurvey(surveyId, 'status', 'ended').subscribe()
    location.reload()
  }

  startPublish(surveyId: string) {
    console.log('start publishing for ', surveyId)
    this.proxy$.patchSurvey(surveyId, 'status', 'published').subscribe()
    location.reload()
  }

  copyRespondentURL(surveyId: string) {
    const url = `${location.host}/responseSubmit/${surveyId}`;
    this.clipboard.copy(url);
    this.snackBar.open('URL copied to clipboard!', 'Close', { duration: 1000 });
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    console.log('tab change:', tabChangeEvent.tab.textLabel)
    if (tabChangeEvent.tab.textLabel === "Draft") {
      this.displayedColumns = ['name', 'description', 'owner', 'publish', 'edit'];
    } else if (tabChangeEvent.tab.textLabel === "Published") {
      this.displayedColumns = ['name', 'description', 'owner', 'responses', 'analysis', 'publish', 'respondURL'];
    } else if (tabChangeEvent.tab.textLabel === "Ended") {
      this.displayedColumns = ['name', 'description', 'owner', 'responses', 'analysis'];
    }
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
