import { TestBed } from '@angular/core/testing';

import { MinimalAccountInfoGuard } from './minimal-account-info.guard';


// TODO FIXME test
xdescribe('MinimalAccountInfoGuard', () => {
  let guard: MinimalAccountInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MinimalAccountInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
