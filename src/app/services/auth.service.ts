import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

import { API_BASE_URL, AUTH_STORAGE_KEY } from '../config/api.config';
import {
  AuthApiResponse,
  AuthSession,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly token = signal<string | null>(localStorage.getItem(AUTH_STORAGE_KEY));
  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.token() !== null);

  private readonly http = inject(HttpClient);

  register(payload: RegisterRequest) {
    return this.http
      .post<AuthApiResponse>(`${API_BASE_URL}/auth/register`, payload)
      .pipe(map((response) => this.toSession(response, payload)));
  }

  login(payload: LoginRequest) {
    return this.http
      .post<AuthApiResponse>(`${API_BASE_URL}/auth/login`, payload)
      .pipe(
        map((response) => this.toSession(response, payload)),
        tap((session) => this.persistSession(session))
      );
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.token.set(null);
    this.user.set(null);
  }

  private persistSession(session: AuthSession): void {
    if (session.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, session.token);
      this.token.set(session.token);
    }

    this.user.set(session.user);
  }

  private toSession(
    response: AuthApiResponse | null | undefined,
    payload: LoginRequest | RegisterRequest
  ): AuthSession {
    const token = response?.token ?? response?.accessToken ?? response?.jwt ?? null;
    const user: AuthUser = {
      id: response?.user?.id,
      name:
        response?.user?.name ??
        response?.name ??
        ('name' in payload ? payload.name : payload.email.split('@')[0]),
      email: response?.user?.email ?? response?.email ?? payload.email,
    };

    return { token, user };
  }
}
