import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyproxyService } from '../surveyproxy.service';

@Component({
  selector: 'app-respondent',
  templateUrl: './respondent.component.html',
  styleUrls: ['./respondent.component.css'],
})
export class RespondentComponent {
  survey: any = null; // Holds survey metadata
  responseForm!: FormGroup; // Form group for managing responses
  loading: boolean = true; // Indicates loading state
  errorMessage: string = ''; // Stores error messages

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private surveyProxy: SurveyproxyService
  ) {
    const surveyId = this.route.snapshot.paramMap.get('surveyId'); // Extract surveyId from the route

    if (surveyId) {
      // Step 1: Fetch survey metadata
      this.surveyProxy.getSurvey(surveyId).subscribe(
        (survey) => {
          this.survey = survey;

          if (this.survey && this.survey.status === 'published') {
            // Step 2: Fetch survey questions
            this.surveyProxy.getQuestions_unprotected(surveyId).subscribe(
              (response) => {
                if (response && response.questions) {
                  this.survey.questions = response.questions; // Assign questions to the survey object
                  this.initializeForm(); // Initialize form with questions
                } else {
                  this.errorMessage = 'No questions found for the survey.';
                }
                this.loading = false;
              },
              (error) => {
                console.error('Error fetching questions:', error);
                this.errorMessage = 'Failed to load survey questions.';
                this.loading = false;
              }
            );
          } else {
            this.errorMessage = 'The survey is not currently published.';
            this.loading = false;
          }
        },
        (error) => {
          console.error('Error fetching survey:', error);
          this.errorMessage = 'Failed to load survey details.';
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      this.errorMessage = 'Invalid survey ID.';
    }
  }

  initializeForm(): void {
    this.responseForm = this.fb.group({});
    this.survey.questions.forEach((question: any) => {
      if (question.type === 'multiple-choice') {
        this.responseForm.addControl(
          `question${question.questionId}`,
          this.fb.control([], question.isRequired ? Validators.required : null)
        );
      } else {
        this.responseForm.addControl(
          `question${question.questionId}`,
          this.fb.control('', question.isRequired ? Validators.required : null)
        );
      }
    });
  }

  onCheckboxChange(event: any, questionId: number): void {
    const control = this.responseForm.get(`question${questionId}`);
    const selectedOptions = control?.value || [];
    if (event.target.checked) {
      control?.setValue([...selectedOptions, event.target.value]);
    } else {
      control?.setValue(selectedOptions.filter((opt: any) => opt !== event.target.value));
    }
  }

  submitResponses(): void {
    if (this.responseForm.valid) {
      const answers = Object.keys(this.responseForm.value).map((key) => {
        const questionId = parseInt(key.replace('question', ''), 10);
        const payloadValue = this.responseForm.value[key];
        
        // Wrap the payload in an array if it's not already an array
        const payload = Array.isArray(payloadValue) ? payloadValue : [payloadValue];
  
        return { questionId, payload };
      });
  
      this.surveyProxy.postAnswers(this.survey.surveyId, answers).subscribe(
        () => {
          alert('Thank you for completing the survey!');
        },
        (error) => {
          console.error('Error submitting responses:', error);
          alert('Failed to submit responses. Please try again.');
        }
      );
    }
  }
  
}
