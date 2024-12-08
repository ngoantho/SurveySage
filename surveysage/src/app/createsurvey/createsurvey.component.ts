import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';
import { ISurvey } from '../interfaces';

@Component({
  selector: 'app-survey',
  templateUrl: './createsurvey.component.html',
  styleUrls: ['./createsurvey.component.css'],
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  questionTypes = ['multiple-choice', 'text-response', 'single-choice'];
  optionTypes = ['option1', 'option2', 'option3'];
  proxy$ = inject(SurveyproxyService);
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
      questions: this.fb.array([
        this.fb.group({
          text: ['', Validators.required],
          type: [this.questionTypes, Validators.required],
          payload: this.fb.array([])
        })
      ]),
    });
  }

  ngOnInit() { }

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
    return (
      (this.surveyForm.get('questions') as FormArray)
        .at(questionIndex)
        .get('payload') as FormArray
    );
  }

  // Add a new question to the survey
  addQuestion() {
    const questionForm = this.fb.group({
      text: ['', Validators.required], // Question text
      type: ['', Validators.required], // Question type (e.g., multiple-choice, text-response, single-choice)
      isRequired: true, // Whether the question is required
      payload: this.fb.array([]), // Array of options for multiple-choice or single-choice questions
    });

    this.questions.push(questionForm);
  }

  // Add a new option to a specific question
  addOption(questionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('payload') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  // Remove a question from the survey
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Remove an option from a specific question
  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('payload') as FormArray;
    options.removeAt(optionIndex);
  }

  // Generate a random ID
  generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000); // Generate a unique ID based on timestamp
  }

  // Submit the survey form
  onSubmit() {
    console.log('Form value', this.surveyForm.value);
    console.log('Form valid', this.surveyForm.valid);

    if (this.surveyForm.valid) {
      this.isSubmitting = true; // Disable the submit button while submitting

      // Step 1: Create the survey without questions
      const survey: ISurvey = {
        name: this.surveyForm.value.name,
        description: this.surveyForm.value.description,
        owner: this.surveyForm.value.owner,
        status: 'draft', // default is draft
        surveyId: this.generateId(),
      };

      this.proxy$.postSurvey(survey).subscribe(
        (surveyId) => { // on success
          console.log('Created survey', surveyId);
          this.submitQuestions(surveyId);
        },
        (error) => { // on error
          console.error('Error creating survey', error);
          this.submitError = 'Failed to create survey. Please try again.';
          this.isSubmitting = false; // Re-enable the submit button
        },
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
  submitQuestions(surveyId: number) {
    this.proxy$.postQuestions(surveyId, this.questions.value).subscribe(
      () => {
        console.log('Submitted questions')
        this.finalizeSurveyCreation()
      },
      (error) => {
        console.error('Error adding questions', error);
        this.submitError = 'Failed to add questions to the survey. Please try again.';
        this.isSubmitting = false; // Re-enable the submit button
      }
    )
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

  logQuestions() {
    console.log(this.questions.value)
  }
}