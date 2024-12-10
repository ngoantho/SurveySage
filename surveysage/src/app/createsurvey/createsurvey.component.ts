import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthproxyService } from '../authproxy.service';
import { SurveyproxyService } from '../surveyproxy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISurvey } from '../interfaces';

@Component({
  selector: 'app-createsurvey',
  templateUrl: './createsurvey.component.html',
  styleUrls: ['./createsurvey.component.css'],
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  questionTypes = ['multiple-choice', 'text-response', 'single-choice'];
  authProxy = inject(AuthproxyService);
  surveyProxy = inject(SurveyproxyService);
  router = inject(Router);
  route = inject(ActivatedRoute);
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

  constructor(private fb: FormBuilder) {
    this.surveyForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.MAX_NAME_LENGTH),
          this.noWhitespaceValidator,
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
          this.noWhitespaceValidator,
        ],
      ],
      questions: this.fb.array([this.questionForm]),
    });

    let id = this.route.snapshot.params['id'];
    if (id) {
      console.log('updating form with survey info', id);
      this.surveyProxy.getSurvey(id).subscribe((survey) => {
        this.surveyForm.patchValue({
          name: survey.name,
          description: survey.description,
        });

        this.surveyProxy.getQuestions(id).subscribe((questions) => {
          // Clear existing form controls in the questions FormArray
          this.questions.clear();

          // Add form controls for each question
          questions.questions.forEach((question) => {
            this.questions.push(
              this.fb.group({
                text: [
                  question.text,
                  [
                    Validators.required,
                    Validators.maxLength(this.MAX_QUESTION_LENGTH),
                    this.noWhitespaceValidator,
                  ],
                ],
                type: [
                  question.type,
                  [
                    Validators.required,
                    Validators.pattern(`^(${this.questionTypes.join('|')})$`),
                  ],
                ],
                isRequired: [question.isRequired ?? true],
                payload: this.fb.array(question.payload || []),
              })
            );
          });
        });
      });
    }
  }

  ngOnInit() {}

  private noWhitespaceValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  private validateEmail(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  get questionForm() {
    return this.fb.group({
      text: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.MAX_QUESTION_LENGTH),
          this.noWhitespaceValidator,
        ],
      ],
      type: [
        '',
        [
          Validators.required,
          Validators.pattern(`^(${this.questionTypes.join('|')})$`),
        ],
      ],
      isRequired: [true],
      payload: this.fb.array([]),
    });
  }

  getOptionsFormArray(questionIndex: number) {
    return (this.surveyForm.get('questions') as FormArray)
      .at(questionIndex)
      .get('payload') as FormArray;
  }

  addQuestion() {
    if (this.questions.length >= this.MAX_QUESTIONS) {
      this.submitError = `Maximum ${this.MAX_QUESTIONS} questions allowed`;
      return;
    }

    this.questions.push(this.questionForm);
  }

  addOption(questionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('payload') as FormArray;

    if (options.length >= this.MAX_OPTIONS) {
      this.submitError = `Maximum ${this.MAX_OPTIONS} options allowed`;
      return;
    }

    options.push(
      this.fb.control('', [
        Validators.required,
        Validators.maxLength(100),
        this.noWhitespaceValidator,
      ])
    );
  }

  removeQuestion(index: number) {
    if (this.questions.length <= 1) {
      this.submitError = 'Survey must have at least one question';
      return;
    }
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('payload') as FormArray;
    if (options.length <= this.MIN_OPTIONS) {
      this.submitError = `Minimum ${this.MIN_OPTIONS} options required`;
      return;
    }
    options.removeAt(optionIndex);
  }

  generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  onSubmit() {
    this.submitError = null;

    if (!this.surveyForm.valid) {
      this.markFormGroupTouched(this.surveyForm);
      return;
    }

    this.isSubmitting = true;

    const survey: ISurvey = {
      name: this.surveyForm.value.name.trim(),
      description: this.surveyForm.value.description.trim(),
      owner: String(this.authProxy.displayName),
      status: 'draft', // default is draft
      userId: Number(this.authProxy.userId),
      surveyId: this.generateId(),
    };

    this.surveyProxy.postSurvey(survey).subscribe({
      next: (surveyId) => {
        this.submitQuestions(surveyId);
      },
      error: (error) => {
        console.error('Error creating survey', error);
        this.submitError = 'Failed to create survey. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  submitQuestions(surveyId: number) {
    this.surveyProxy.postQuestions(surveyId, this.questions.value).subscribe({
      next: () => {
        this.finalizeSurveyCreation();
      },
      error: (error) => {
        console.error('Error adding questions', error);
        this.submitError = 'Failed to add questions. Please try again.';
        this.isSubmitting = false;
      },
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
