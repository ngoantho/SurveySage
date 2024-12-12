import { Component, ViewChild } from '@angular/core';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ISurvey } from '../interfaces';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IResponses {
  [key: string]: number;
}

interface IDataSources {
  [key: string]: MatTableDataSource<ISurvey>;
}

@Component({
  selector: 'app-surveylist',
  templateUrl: './surveylist.component.html',
  styleUrl: './surveylist.component.css',
})
export class SurveyListComponent {
  defaultColumns: string[] = ['name', 'description', 'owner', 'publish', 'editBtn', 'deleteBtn'];
  displayedColumns: string[] = this.defaultColumns;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  responses: IResponses = {};
  currentTab: string = localStorage.getItem('previousTab') ?? 'Draft';
  tabOrder = ['Draft', 'Published', 'Ended'];
  dataSources: IDataSources = {
    Draft: new MatTableDataSource<ISurvey>(),
    Published: new MatTableDataSource<ISurvey>(),
    Ended: new MatTableDataSource<ISurvey>(),
  };

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private proxy$: SurveyproxyService
  ) {
    let getInitialData = async () => {
      this.dataSources['Draft'].data = await this.getDraftSurveys();
      this.dataSources['Published'].data = await this.getPublishedSurveys();
      this.dataSources['Ended'].data = await this.getEndedSurveys();
    }
    getInitialData()
    console.log('previous tab', this.currentTab)
  }

  ngOnInit() {}

  get tabIndex() {
    if (!this.tabGroup) return 0;
    for (let i = 0; i < this.tabGroup._tabs.length; i++) {
      if (this.tabGroup._tabs.get(i)?.textLabel === this.currentTab) {
        return i;
      }
    }
    return;
  }

  async endPublish(surveyId: string) { // published tab
    console.log('ending publishing for: ', surveyId);
    this.proxy$.patchSurvey(surveyId, 'status', 'ended').subscribe(
      async () => {
        this.dataSources['Published'].data = await this.getPublishedSurveys();
        this.dataSources['Ended'].data = await this.getEndedSurveys();
        console.log('ended survey', surveyId)
      }
    );
  }

  async startPublish(surveyId: string) { // draft tab
    console.log('start publishing for: ', surveyId);
    this.proxy$.patchSurvey(surveyId, 'status', 'published').subscribe(
      async () => {
        this.dataSources['Draft'].data = await this.getDraftSurveys();
        this.dataSources['Published'].data = await this.getPublishedSurveys();
        console.log('published survey', surveyId)
      }
    );
  }

  deleteSurvey(surveyId: string) {
    console.log('deleting survey: ', surveyId)
    this.proxy$.deleteSurvey(surveyId).subscribe(
      async () => {
        switch(this.currentTab) {
          case 'Draft':
            this.dataSources['Draft'].data = await this.getDraftSurveys();
            break;
          case 'Published':
            this.dataSources['Published'].data = await this.getPublishedSurveys();
            break;
          case 'Ended':
            this.dataSources['Ended'].data = await this.getEndedSurveys();
            break;
        }
      }
    )
  }

  copyRespondentURL(surveyId: string) {
    const url = `${location.host}/responseSubmit/${surveyId}`;
    this.clipboard.copy(url);
    this.snackBar.open('URL copied to clipboard!', 'Close', { duration: 1000 });
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTab = tabChangeEvent.tab.textLabel;
    switch(this.currentTab) {
      case 'Draft':
        this.displayedColumns = this.defaultColumns;
        localStorage.setItem('previousTab', 'Draft');
        break;
      case 'Published':
        localStorage.setItem('previousTab', 'Published');
        this.displayedColumns = [
          'name',
          'description',
          'owner',
          'responses',
          'analysis',
          'publish',
          'respondURL',
          'deleteBtn'
        ];
        break;
      case 'Ended':
        localStorage.setItem('previousTab', 'Ended');
        this.displayedColumns = [
          'name',
          'description',
          'owner',
          'responses',
          'analysis',
          'deleteBtn'
        ];
        break;
    }
  }

  async getDraftSurveys() {
    let surveys = await this.proxy$.getListsIndex().toPromise()
    let filtered = surveys?.filter((survey) => survey.status === 'draft') || [];
    this.setResponses(filtered)
    return filtered;
  }

  async getPublishedSurveys() {
    let surveys = await this.proxy$.getListsIndex().toPromise()
    let filtered = surveys?.filter((survey) => survey.status === 'published') || [];
    this.setResponses(filtered)
    return filtered;
  }

  async getEndedSurveys() {
    let surveys = await this.proxy$.getListsIndex().toPromise()
    let filtered = surveys?.filter((survey) => survey.status === 'ended') || [];
    this.setResponses(filtered)
    return filtered;
  }

  setResponses(surveys: ISurvey[]) {
    surveys.forEach((survey) => {
      let surveyId = String(survey.surveyId);
      this.proxy$.getSurveyResponses(surveyId).subscribe({
        next: (responses) => {
          this.responses[surveyId] = responses;
        },
        error: () => {
          this.responses[surveyId] = 0;
        },
      });
    });
  }
}
