import { TestBed } from '@angular/core/testing';

import { RingdataService } from './ringdata.service';

describe('RingdataService', () => {
  let service: RingdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RingdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
