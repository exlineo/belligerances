import { TestBed } from '@angular/core/testing';

import { CombatsService } from './combats.service';

describe('CombatsService', () => {
  let service: CombatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
