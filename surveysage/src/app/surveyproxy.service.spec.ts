import { TestBed } from '@angular/core/testing';

import { SurveyproxyService } from './surveyproxy.service';

describe('SurveyproxyService', () => {
  let service: SurveyproxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyproxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
