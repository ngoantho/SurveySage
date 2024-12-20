import { Component, OnInit, inject } from '@angular/core';
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
import { IQuestion, ISurvey } from '../interfaces';

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
      questions: this.fb.array([]),
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
          if (questions) {
            questions.questions.forEach((question) => {
              this.questions.push(this.getQuestionForm(question));
            });
          } else {
            console.log('survey was created with no questions, posting...');
            this.surveyProxy.postQuestions(this.surveyId, []).subscribe(() => {
              console.log('created missing questions!')
            })
          }
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

  get editing() {
    return this.route.snapshot.params['id'] ? true : false;
  }

  get surveyId() {
    return this.route.snapshot.params['id'] || null;
  }

  getQuestionForm(question: IQuestion | null) {
    return this.fb.group({
      text: [
        question?.text || '',
        [
          Validators.required,
          Validators.maxLength(this.MAX_QUESTION_LENGTH),
          this.noWhitespaceValidator,
        ],
      ],
      type: [
        question?.type || '',
        [
          Validators.required,
          Validators.pattern(`^(${this.questionTypes.join('|')})$`),
        ],
      ],
      isRequired: [question?.isRequired ?? true],
      payload: this.fb.array(question?.payload || []),
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

    this.questions.push(this.getQuestionForm(null));
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
      surveyId: this.surveyId, // present if editing, generated on post
    };

    if (this.editing) {
      this.surveyProxy.replaceSurvey(this.surveyId, survey).subscribe({
        next: () => {
          this.replaceQuestions();
        },
        error: (error) => {
          console.error('Error editing survey', error);
          this.submitError = 'Failed to edit survey. Please try again.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.surveyProxy.postSurvey(survey).subscribe({
        next: (surveyId) => {
          this.postQuestions(surveyId);
        },
        error: (error) => {
          console.error('Error creating survey', error);
          this.submitError = 'Failed to create survey. Please try again.';
          this.isSubmitting = false;
        },
      });
    }
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

  postQuestions(surveyId: number) {
    this.surveyProxy.postQuestions(surveyId, this.questions.value).subscribe({
      next: () => {
        this.finalizeSurveyCreation();
      },
      error: (error) => {
        console.error('Error posting questions', error);
        this.submitError = 'Failed to post questions. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  replaceQuestions() {
    this.surveyProxy
      .replaceQuestions(this.surveyId, this.questions.value)
      .subscribe({
        next: () => {
          this.finalizeSurveyCreation();
        },
        error: (error) => {
          console.error('Error replacing questions', error);
          this.submitError = 'Failed to replace questions. Please try again.';
          this.isSubmitting = false;
        },
      });
  }

  finalizeSurveyCreation() {
    this.surveyForm.reset();
    this.questions.clear();
    this.isSubmitting = false;
    sessionStorage.setItem('previousTab', 'Draft');
    this.router.navigate(['/surveylist']);
  }

  goBack() {
    this.router.navigate(['']);
  }
}
