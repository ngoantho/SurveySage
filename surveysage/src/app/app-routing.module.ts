import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomePageComponent } from './welcomepage/welcomepage.component';
import { SurveyListComponent } from './surveylist/surveylist.component';
import { SurveyFormComponent } from './surveyform/surveyform.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CreateSurveyComponent } from './createsurvey/createsurvey.component';
import { RespondentComponent } from './respondent/respondent.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'surveylist', component: SurveyListComponent },
  { path: 'survey/:id', component: SurveyFormComponent },
  { path: 'survey/:id/analysis', component: AnalysisComponent },
  { path: 'createsurvey', component: CreateSurveyComponent },
  { path: 'responseSubmit/:surveyId', component: RespondentComponent },
  { path: 'edit/:id', component: CreateSurveyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
