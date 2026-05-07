import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_breeder: boolean;
  city: string;
  photo: string | null;
  date_joined: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  is_breeder: boolean;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      this.loadCurrentUser().subscribe();
    }
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/api/register/`, data);
  }

  login(username: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API_URL}/api/login/`, { username, password }).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refresh = this.getRefreshToken();
    return this.http.post<AuthTokens>(`${this.API_URL}/api/token/refresh/`, { refresh }).pipe(
      tap(tokens => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
        if (tokens.refresh) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
        }
      })
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/api/user/me/`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
  }
}
