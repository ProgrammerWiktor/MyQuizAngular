import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizEndComponent } from './quiz-end.component';

describe('QuizEndComponent', () => {
  let component: QuizEndComponent;
  let fixture: ComponentFixture<QuizEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizEndComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
