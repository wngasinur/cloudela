import { TestBed, inject } from '@angular/core/testing';

import { MasterReferenceService } from './master-reference.service';

describe('MasterReferenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterReferenceService]
    });
  });

  it('should be created', inject([MasterReferenceService], (service: MasterReferenceService) => {
    expect(service).toBeTruthy();
  }));
});
