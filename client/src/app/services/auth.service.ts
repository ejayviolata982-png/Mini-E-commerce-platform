import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase.config';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  currentUser$ = this.userSubject.asObservable();
  private firebaseUser: User | null = null;
  private authStateResolved = false;
  private authStateReady!: () => void;
  private authStatePromise: Promise<void>;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.authStatePromise = new Promise((resolve) => {
      this.authStateReady = resolve;
    });

    onAuthStateChanged(firebaseAuth, async (user) => {
      this.firebaseUser = user;

      if (!this.authStateResolved) {
        this.authStateResolved = true;
        this.authStateReady();
      }

      this.ngZone.run(() => {
        if (user) {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          this.userSubject.next(userData);
        } else {
          this.userSubject.next(null);
        }
      });
    });
  }

  private async waitForFirebaseAuth(timeout = 5000): Promise<void> {
    if (this.authStateResolved) return;
    await Promise.race([
      this.authStatePromise,
      new Promise<void>((resolve) => setTimeout(resolve, timeout))
    ]);
  }

  async login(email: string, password: string): Promise<any> {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const token = await cred.user.getIdToken();
    const res: any = await this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).toPromise();
    localStorage.setItem('user', JSON.stringify(res));
    this.userSubject.next(res);
    return res;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  async getToken(): Promise<string | null> {
    await this.waitForFirebaseAuth();
    if (!this.firebaseUser) return null;
    return this.firebaseUser.getIdToken().catch(() => null);
  }

  async isLoggedIn(): Promise<boolean> {
    await this.waitForFirebaseAuth();
    return !!this.firebaseUser;
  }

  async isAdmin(): Promise<boolean> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'admin';
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}