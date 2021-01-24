import { TestBed } from '@angular/core/testing';

import { RingParamService } from './ring-param.service';

describe('RingParamService', () => {
  let service: RingParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RingParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
