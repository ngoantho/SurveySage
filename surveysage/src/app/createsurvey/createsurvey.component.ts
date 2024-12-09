import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
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

  // Validation constants
// Change from private to public
public readonly MAX_NAME_LENGTH = 100;
public readonly MAX_DESCRIPTION_LENGTH = 500;
public readonly MAX_QUESTION_LENGTH = 200;
public readonly MAX_OPTIONS = 10;
public readonly MIN_OPTIONS = 2;
public readonly MAX_QUESTIONS = 50;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.surveyForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(this.MAX_NAME_LENGTH),
        this.noWhitespaceValidator
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
        this.noWhitespaceValidator
      ]],
      questions: this.fb.array([])
    });

    this.addQuestion();
  }

  ngOnInit() { }

  private noWhitespaceValidator(control: AbstractControl): {[key: string]: any} | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { 'whitespace': true } : null;
  }

  private validateEmail(control: AbstractControl): {[key: string]: any} | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { 'invalidEmail': true };
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  getQuestionsFormArray() {
    return (this.surveyForm.get('questions') as FormArray).controls;
  }

  getOptionsFormArray(questionIndex: number) {
    return (
      (this.surveyForm.get('questions') as FormArray)
        .at(questionIndex)
        .get('payload') as FormArray
    );
  }

  addQuestion() {
    if (this.questions.length >= this.MAX_QUESTIONS) {
      this.submitError = `Maximum ${this.MAX_QUESTIONS} questions allowed`;
      return;
    }

    const questionForm = this.fb.group({
      text: ['', [
        Validators.required,
        Validators.maxLength(this.MAX_QUESTION_LENGTH),
        this.noWhitespaceValidator
      ]],
      type: ['', [
        Validators.required,
        Validators.pattern(`^(${this.questionTypes.join('|')})$`)
      ]],
      isRequired: [true],
      payload: this.fb.array([])
    });

    this.questions.push(questionForm);
  }

  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('payload') as FormArray;
    
    if (options.length >= this.MAX_OPTIONS) {
      this.submitError = `Maximum ${this.MAX_OPTIONS} options allowed`;
      return;
    }

    options.push(this.fb.control('', [
      Validators.required,
      Validators.maxLength(100),
      this.noWhitespaceValidator
    ]));
  }

  removeQuestion(index: number) {
    if (this.questions.length <= 1) {
      this.submitError = 'Survey must have at least one question';
      return;
    }
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions.at(questionIndex).get('payload') as FormArray;
    if (options.length <= this.MIN_OPTIONS) {
      this.submitError = `Minimum ${this.MIN_OPTIONS} options required`;
      return;
    }
    options.removeAt(optionIndex);
  }

  generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  async onSubmit() {
    this.submitError = null;
    
    if (!this.surveyForm.valid) {
      this.markFormGroupTouched(this.surveyForm);
      return;
    }

    this.isSubmitting = true;

    const survey: ISurvey = {
      name: this.surveyForm.value.name.trim(),
      description: this.surveyForm.value.description.trim(),
      owner: String(await this.proxy$.getUserEmail()),
      status: 'draft',
      userId: Number(await this.proxy$.getUserId()),
      surveyId: this.generateId(),
    };

    this.proxy$.postSurvey(survey).subscribe({
      next: (surveyId) => {
        this.submitQuestions(surveyId);
      },
      error: (error) => {
        console.error('Error creating survey', error);
        this.submitError = 'Failed to create survey. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  submitQuestions(surveyId: number) {
    this.proxy$.postQuestions(surveyId, this.questions.value).subscribe({
      next: () => {
        this.finalizeSurveyCreation();
      },
      error: (error) => {
        console.error('Error adding questions', error);
        this.submitError = 'Failed to add questions. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  finalizeSurveyCreation() {
    this.surveyForm.reset();
    this.questions.clear();
    this.isSubmitting = false;
    this.router.navigate(['/surveylist']);
  }

  goBack() {
    this.router.navigate(['']);
  }
}