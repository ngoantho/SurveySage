import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SurveyproxyService } from '../surveyproxy.service';

@Component({
  selector: 'app-survey',
  templateUrl: './createsurvey.component.html',
  styleUrls: ['./createsurvey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  questionTypes = ['multiple-choice', 'text', 'rating'];
  proxy$ = inject(SurveyproxyService);
  apiUrl = this.proxy$.getAPISurveyRoute() // Replace with your API endpoint
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit() {
    
  }

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

  addQuestion() {
    const questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      options: this.fb.array([])
    });

    this.questions.push(questionForm);
  }

  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
  }

  onSubmit() {
    console.log('Form submitted');
    console.log('Form value:', this.surveyForm.value);
    console.log('Form valid:', this.surveyForm.valid);
  
    if (this.surveyForm.valid) {
      this.http.post(this.apiUrl, this.surveyForm.value).subscribe(
        (response) => {
          console.log('Survey created successfully', response);
          this.surveyForm.reset();
          this.questions.clear();
        },
        (error) => {
          console.error('Error creating survey', error);
        }
      );
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.surveyForm.controls).forEach(key => {
        const control = this.surveyForm.get(key);
        control?.markAsTouched();
      });
    }
  }  
}
