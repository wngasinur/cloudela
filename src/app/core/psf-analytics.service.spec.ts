import { TestBed, inject } from '@angular/core/testing';

import { PsfAnalyticsService } from './psf-analytics.service';

describe('PsfAnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsfAnalyticsService]
    });
  });

  it('should be created', inject([PsfAnalyticsService], (service: PsfAnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
