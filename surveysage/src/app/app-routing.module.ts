import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { SurveylistComponent } from './surveylist/surveylist.component';
import { SurveyformComponent } from './surveyform/surveyform.component';

const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'surveylist', component: SurveylistComponent },
  { path: 'survey/:id', component: SurveyformComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
