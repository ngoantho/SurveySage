import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSurveyComponent } from './createsurvey.component';

describe('CreatesurveyComponent', () => {
  let component: CreateSurveyComponent;
  let fixture: ComponentFixture<CreateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});