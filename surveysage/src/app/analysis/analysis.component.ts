import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyproxyService } from '../surveyproxy.service';
import { IAnalysisModel } from '../interfaces';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {
  surveyId: string;
  analysis: IAnalysisModel[] | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  surveyName: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private surveyProxy: SurveyproxyService
  ) { 
    this.surveyId = route.snapshot.params['id'];
    this.loadAnalysis();
    this.surveyProxy.getSurvey(this.surveyId).subscribe((res) => {
      this.surveyName = res.name
    })
  }

  loadAnalysis(): void{
    this.isLoading = true;
    this.errorMessage = null;

    this.surveyProxy.getAnalysis(this.surveyId).subscribe({
      next: (analysis) => {
        if (analysis && analysis.length > 0) {
          this.analysis = analysis;
        } else {
          this.generateAnalysis(); // Generate if no existing analysis
        }
        this.isLoading = false;
      }
    })
  }

  generateAnalysis() : void{
    this.isLoading = true;
    this.errorMessage = null;

    this.surveyProxy.generateAnalysis(this.surveyId).subscribe({
      next: (analysis) => {
        this.analysis = analysis as IAnalysisModel[];
        this.isLoading = false;
        // After successfully regenerating, reload the analysis
        this.loadAnalysis();
      }
      
    })
    
  }
}
