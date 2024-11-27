import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { SurveylistComponent } from './surveylist/surveylist.component';
import { SurveyformComponent } from './surveyform/surveyform.component';
import { SurveyproxyService } from './surveyproxy.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AnalysisComponent } from './analysis/analysis.component';
import { CreateSurveyComponent } from './createsurvey/createsurvey.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WelcomepageComponent,
    SurveylistComponent,
    SurveyformComponent,
    AnalysisComponent,
    CreateSurveyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [provideHttpClient(),SurveyproxyService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
