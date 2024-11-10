import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteQuizComponent } from './confirm-delete-quiz.component';

describe('ConfirmDeleteQuizComponent', () => {
  let component: ConfirmDeleteQuizComponent;
  let fixture: ComponentFixture<ConfirmDeleteQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
