import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextTodosComponent } from './next-todos.component';

describe('NextTodosComponent', () => {
  let component: NextTodosComponent;
  let fixture: ComponentFixture<NextTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextTodosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
