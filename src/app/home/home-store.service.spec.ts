import { TestBed, inject } from '@angular/core/testing';

import { HomeStoreService } from './home-store.service';

describe('HomeStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeStoreService]
    });
  });

  it('should be created', inject([HomeStoreService], (service: HomeStoreService) => {
    expect(service).toBeTruthy();
  }));
});
