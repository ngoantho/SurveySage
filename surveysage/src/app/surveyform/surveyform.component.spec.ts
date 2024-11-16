import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyformComponent } from './surveyform.component';

describe('SurveyformComponent', () => {
  let component: SurveyformComponent;
  let fixture: ComponentFixture<SurveyformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
