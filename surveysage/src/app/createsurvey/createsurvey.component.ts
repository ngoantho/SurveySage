import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './createsurvey.component.html',
  styleUrls: ['./createsurvey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  questionTypes = ['multiple-choice', 'text-response', 'single-choice']; // Updated to match respondent types
  proxy$ = inject(SurveyproxyService);
  apiUrl = this.proxy$.getAPISurveyRoute(); // Replace with your API endpoint
  isSubmitting = false;
  submitError: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize the form with all required fields
    this.surveyForm = this.fb.group({
      name: ['', Validators.required], // Survey name
      description: ['', Validators.required], // Survey description
      owner: ['', Validators.required], // Survey owner
      status: ['', Validators.required], // Survey status (Active/Inactive)
      questions: this.fb.array([]) // Array of questions
    });
  }

  ngOnInit() {}

  // Getter for questions FormArray
  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  // Helper method to get questions controls
  getQuestionsFormArray() {
    return (this.surveyForm.get('questions') as FormArray).controls;
  }

  // Helper method to get options controls
  getOptionsFormArray(questionIndex: number) {
    return ((this.surveyForm.get('questions') as FormArray).at(questionIndex).get('payload') as FormArray).controls;
  }

  // Add a new question to the survey
  addQuestion() {
    const questionForm = this.fb.group({
      questionId: [this.generateQuestionId(), Validators.required], // Unique question ID
      text: ['', Validators.required], // Question text
      type: ['', Validators.required], // Question type (e.g., multiple-choice, text-response, single-choice)
      isRequired: [false], // Whether the question is required
      payload: this.fb.array([]) // Array of options for multiple-choice or single-choice questions
    });

    this.questions.push(questionForm);
  }

  // Add a new option to a specific question
  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('payload') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  // Remove a question from the survey
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Remove an option from a specific question
  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions.at(questionIndex).get('payload') as FormArray;
    options.removeAt(optionIndex);
  }

  // Generate a unique question ID
  generateQuestionId(): number {
    return Date.now() + Math.floor(Math.random() * 1000); // Generate a unique ID based on timestamp
  }

  // Submit the survey form
  onSubmit() {
    console.log('Form submitted');
    console.log('Form value:', this.surveyForm.value);
    console.log('Form valid:', this.surveyForm.valid);

    if (this.surveyForm.valid) {
      this.isSubmitting = true; // Disable the submit button while submitting

      // Step 1: Create the survey without questions
      const surveyData = {
        name: this.surveyForm.value.name,
        description: this.surveyForm.value.description,
        owner: this.surveyForm.value.owner,
        status: this.surveyForm.value.status,
      };

      this.http.post(this.apiUrl, surveyData).subscribe(
        (response: any) => {
          console.log('Survey created successfully', response);

          // Step 2: Add questions to the survey
          const surveyId = response.surveyId; // Assuming the backend returns the surveyId
          const questions = this.surveyForm.value.questions;

          if (questions && questions.length > 0) {
            this.addQuestionsToSurvey(surveyId, questions);
          } else {
            // No questions to add, finish the process
            this.finalizeSurveyCreation();
          }
        },
        (error) => {
          console.error('Error creating survey', error);
          this.submitError = 'Failed to create survey. Please try again.';
          this.isSubmitting = false; // Re-enable the submit button
        }
      );
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.surveyForm.controls).forEach((key) => {
        const control = this.surveyForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Step 2: Add questions to the survey
  addQuestionsToSurvey(surveyId: string, questions: any[]) {
    const questionRequests = questions.map((question) => {
      const questionData = {
        questionId: question.questionId,
        text: question.text,
        type: question.type,
        isRequired: question.isRequired,
        payload: question.payload,
      };

      // Make a POST request for each question
      return this.http.post(`${this.apiUrl}/${surveyId}/questions`, questionData).toPromise();
    });

    // Wait for all question requests to complete
    Promise.all(questionRequests)
      .then((responses) => {
        console.log('All questions added successfully', responses);
        this.finalizeSurveyCreation();
      })
      .catch((error) => {
        console.error('Error adding questions', error);
        this.submitError = 'Failed to add questions to the survey. Please try again.';
        this.isSubmitting = false; // Re-enable the submit button
      });
  }

  // Finalize the survey creation process
  finalizeSurveyCreation() {
    this.surveyForm.reset(); // Reset the form
    this.questions.clear(); // Clear the questions array
    this.isSubmitting = false; // Re-enable the submit button
    this.router.navigate(['/surveylist']); // Navigate to the survey list page
  }

  // Navigate back to the welcome page
  goBack() {
    this.router.navigate(['']);
  }
}
