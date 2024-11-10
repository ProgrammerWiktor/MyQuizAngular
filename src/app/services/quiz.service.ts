import { Injectable } from '@angular/core';
import { Quiz } from '../shared/Quiz.interface';
import { collectionData, Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Question } from '../shared/Question.interface';
import { AuthenticationService } from './authentication.service';
import { UserStatistics } from '../shared/UserStatistics.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  showResults: boolean = false;
  numberOfPoints: number = 0;
  numberOfQuestions: number = 0;
  userAnswers: boolean[][] = [];

  filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('All');

  constructor(
    private firestore: Firestore,
    private authenticationService: AuthenticationService
  ) {}

  addQuiz(quiz: Quiz): Observable<DocumentReference<DocumentData>> {
    const quizzesCollection = collection(this.firestore, 'quizzes');
    return from(addDoc(quizzesCollection, quiz));
  }

  getQuizzes(): Observable<Quiz[]> {
    const quizzesCollection = collection(this.firestore, 'quizzes');
    return collectionData(quizzesCollection, { idField: 'id' }) as Observable<
      Quiz[]
    >;
  }

  getQuizById(id: string): Observable<Quiz> {
    const quizDocRef = doc(this.firestore, `quizzes/${id}`);

    return from(getDoc(quizDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Quiz;
        } else {
          throw new Error('Quiz not found');
        }
      })
    );
  }

  getQuizzesByUser(uid: string): Observable<Quiz[]> {
    const quizzesCollection = collection(this.firestore, 'quizzes');
    const quizzesQuery = query(quizzesCollection, where('author', '==', uid));
    return collectionData(quizzesQuery, { idField: 'id' }) as Observable<
      Quiz[]
    >;
  }

  deleteQuizById(quizId: string): Observable<void> {
    const quizDocRef = doc(this.firestore, `quizzes/${quizId}`);
    return from(deleteDoc(quizDocRef));
  }

  setShowResults(show: boolean): void {
    this.showResults = show;
  }

  reset(): void {
    this.showResults = false;
    this.numberOfPoints = 0;
    this.numberOfQuestions = 0;
    this.userAnswers = [];
  }

  calculateResult(questions: Question[]): void {
    let score = 0;

    questions.forEach((question, questionIndex) => {
      let allCorrect = true;

      question.answers.forEach((answer, answerIndex) => {
        if (this.userAnswers[questionIndex][answerIndex] !== answer.isCorrect) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        score += 1;
      }
    });

    this.numberOfPoints = score;
    this.numberOfQuestions = questions.length;
  }

  setFilter(newFilter: string): void {
    this.filterSubject.next(newFilter);
  }

  getFilter(): Observable<string> {
    return this.filterSubject.asObservable();
  }

  getCurrentUserStatistics(): Observable<UserStatistics> {
    return from(this.authenticationService.getCurrentUserUid()).pipe(
      switchMap((uid) => {
        const userDocRef = doc(this.firestore, `users/${uid}/data/private`);
        return from(getDoc(userDocRef)).pipe(
          map((docSnap) => docSnap.data() as UserStatistics),
          catchError(() => {
            return of({
              numberOfCorrectAnswers: 0,
              numberOfIncorrectAnswers: 0,
              numberOfQuizzesTaken: 0,
            });
          })
        );
      })
    );
  }

  updateUserStatistics(): Observable<void> {
    return from(this.authenticationService.getCurrentUserUid()).pipe(
      switchMap((uid) => {
        const userDocRef = doc(this.firestore, `users/${uid}/data/private`);
        return this.getCurrentUserStatistics().pipe(
          switchMap((currentStats) => {
            const newStats: { [key: string]: number } = {
              numberOfCorrectAnswers:
                (currentStats.numberOfCorrectAnswers || 0) +
                this.numberOfPoints,
              numberOfIncorrectAnswers:
                (currentStats.numberOfIncorrectAnswers || 0) +
                (this.numberOfQuestions - this.numberOfPoints),
              numberOfQuizzesTaken:
                (currentStats.numberOfQuizzesTaken || 0) + 1,
            };

            return from(updateDoc(userDocRef, newStats)).pipe(
              catchError((error) => {
                throw error;
              })
            );
          })
        );
      })
    );
  }
}
