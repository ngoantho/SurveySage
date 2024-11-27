import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { SurveylistComponent } from './surveylist/surveylist.component';
import { SurveyformComponent } from './surveyform/surveyform.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CreateSurveyComponent } from './createsurvey/createsurvey.component';

const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'surveylist', component: SurveylistComponent },
  { path: 'survey/:id', component: SurveyformComponent},
  { path: 'survey/:id/analysis', component: AnalysisComponent},
  { path: 'createsurvey', component: CreateSurveyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
