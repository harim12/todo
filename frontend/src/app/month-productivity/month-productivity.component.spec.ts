import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthProductivityComponent } from './month-productivity.component';

describe('MonthProductivityComponent', () => {
  let component: MonthProductivityComponent;
  let fixture: ComponentFixture<MonthProductivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthProductivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
