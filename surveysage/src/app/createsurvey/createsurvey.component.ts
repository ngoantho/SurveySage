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
  questionTypes = ['multiple-choice', 'text', 'rating'];
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
      name: ['', Validators.required],  // Survey title
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
    return ((this.surveyForm.get('questions') as FormArray).at(questionIndex).get('options') as FormArray).controls;
  }

  // Add a new question to the survey
  addQuestion() {
    const questionForm = this.fb.group({
      text: ['', Validators.required], // Question text
      type: ['', Validators.required], // Question type (e.g., multiple-choice, text, rating)
      options: this.fb.array([]) // Array of options for multiple-choice questions
    });

    this.questions.push(questionForm);
  }

  // Add a new option to a specific question
  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  // Remove a question from the survey
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Remove an option from a specific question
  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
  }

  // Submit the survey form
  onSubmit() {
    console.log('Form submitted');
    console.log('Form value:', this.surveyForm.value);
    console.log('Form valid:', this.surveyForm.valid);

    if (this.surveyForm.valid) {
      this.isSubmitting = true; // Disable the submit button while submitting
      this.http.post(this.apiUrl, this.surveyForm.value).subscribe(
        (response) => {
          console.log('Survey created successfully', response);
          this.surveyForm.reset(); // Reset the form
          this.questions.clear(); // Clear the questions array
          this.isSubmitting = false; // Re-enable the submit button
          this.router.navigate(['/surveylist']); // Navigate to the survey list page
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

  // Navigate back to the welcome page
  goBack() {
    this.router.navigate(['']);
  }
}