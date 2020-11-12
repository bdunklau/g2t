import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoListNoAccountComponent } from './no-list-no-account.component';


// TODO FIXME test
xdescribe('NoListNoAccountComponent', () => {
  let component: NoListNoAccountComponent;
  let fixture: ComponentFixture<NoListNoAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoListNoAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoListNoAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
