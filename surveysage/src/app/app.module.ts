// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';

// material table
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

// our components
import { WelcomePageComponent } from './welcomepage/welcomepage.component';
import { SurveyListComponent } from './surveylist/surveylist.component';
import { SurveyFormComponent } from './surveyform/surveyform.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CreateSurveyComponent } from './createsurvey/createsurvey.component';
import { RespondentComponent } from './respondent/respondent.component';
import { EditSurveyComponent } from './editsurvey/editsurvey.component';

// our services
import { SurveyproxyService } from './surveyproxy.service';
import { AuthproxyService } from './authproxy.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    SurveyListComponent,
    SurveyFormComponent,
    AnalysisComponent,
    CreateSurveyComponent,
    RespondentComponent,
    EditSurveyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  providers: [
    provideHttpClient(),
    SurveyproxyService,
    AuthproxyService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
