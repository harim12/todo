import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekProductivityComponent } from './week-productivity.component';

describe('WeekProductivityComponent', () => {
  let component: WeekProductivityComponent;
  let fixture: ComponentFixture<WeekProductivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekProductivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
