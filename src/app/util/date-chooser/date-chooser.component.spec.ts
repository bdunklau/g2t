import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChooserComponent } from './date-chooser.component';


// TODO FIXME test
xdescribe('DateChooserComponent', () => {
  let component: DateChooserComponent;
  let fixture: ComponentFixture<DateChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
