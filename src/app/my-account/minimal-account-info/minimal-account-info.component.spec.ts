import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalAccountInfoComponent } from './minimal-account-info.component';


// TODO FIXME test
xdescribe('MinimalAccountInfoComponent', () => {
  let component: MinimalAccountInfoComponent;
  let fixture: ComponentFixture<MinimalAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimalAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimalAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
