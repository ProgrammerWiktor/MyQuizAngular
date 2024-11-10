import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAddAnswerComponent } from './question-add-answer.component';

describe('QuestionAddAnswerComponent', () => {
  let component: QuestionAddAnswerComponent;
  let fixture: ComponentFixture<QuestionAddAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionAddAnswerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionAddAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
