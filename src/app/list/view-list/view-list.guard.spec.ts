import { TestBed } from '@angular/core/testing';

import { ViewListGuard } from './view-list.guard';


// TODO FIXME test
xdescribe('ViewListGuard', () => {
  let guard: ViewListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ViewListGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
