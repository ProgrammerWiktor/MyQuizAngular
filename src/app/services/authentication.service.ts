import { Injectable } from '@angular/core';
import { SignIn } from '../shared/SignIn.interface';
import { from, map, Observable, switchMap, throwError } from 'rxjs';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { UserCredential } from '@firebase/auth';
import { SignUp } from '../shared/SignUp.interface';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Quiz } from '../shared/Quiz.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }

  getCurrentUserUid(): Observable<string> {
    return this.getCurrentUser().pipe(map((user) => user?.uid || ''));
  }

  isCurrentUserAuthor(quiz: Quiz): Observable<boolean> {
    return this.getCurrentUserUid().pipe(map((uid) => uid === quiz.author));
  }

  getUsername(uid: string): Observable<string> {
    const userDocRef = doc(this.firestore, `users/${uid}`);

    return from(getDoc(userDocRef)).pipe(
      map((docSnapShot) => {
        const data = docSnapShot.data();
        return data ? data['username'] : 'Konto autora zostało usunięte';
      })
    );
  }

  signIn(credentials: SignIn): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      )
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  recoverPasswordWithEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username));

    return from(getDocs(q)).pipe(map((querySnapshot) => querySnapshot.empty));
  }

  createPrivateData(userCredential: UserCredential): void {
    const userDataRef = doc(
      this.firestore,
      `users/${userCredential.user.uid}/data/private`
    );
    setDoc(userDataRef, {
      numberOfQuizzesTaken: 0,
      numberOfCorrectAnswers: 0,
      numberOfIncorrectAnswers: 0,
    });
  }

  signUp(credentials: SignUp): Observable<UserCredential> {
    return this.isUsernameAvailable(credentials.username).pipe(
      switchMap((isAvailable) => {
        if (!isAvailable) {
          return throwError(() => new Error('Username is already taken'));
        }

        return from(
          createUserWithEmailAndPassword(
            this.auth,
            credentials.email,
            credentials.password
          ).then((userCredential) => {
            const userRef = doc(
              this.firestore,
              `users/${userCredential.user.uid}`
            );
            setDoc(userRef, { username: credentials.username }).then(() => {
              this.createPrivateData(userCredential);
            });
            return userCredential;
          })
        );
      })
    );
  }
}
