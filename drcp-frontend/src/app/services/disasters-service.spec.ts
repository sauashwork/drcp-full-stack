import { TestBed } from '@angular/core/testing';

import { DisastersService } from './disasters-service';

describe('DisastersService', () => {
  let service: DisastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
