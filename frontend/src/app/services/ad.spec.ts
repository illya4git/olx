import { TestBed } from '@angular/core/testing';

import { Ad } from './ad';

describe('Ad', () => {
  let service: Ad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
