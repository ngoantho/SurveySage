import { TestBed } from '@angular/core/testing';

import { AuthproxyService } from './authproxy.service';

describe('AuthproxyService', () => {
  let service: AuthproxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthproxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
