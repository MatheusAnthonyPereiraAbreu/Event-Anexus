import { Injectable } from '@angular/core';
import { UserDto } from '../dto/user.dto';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(
    private httpService: HttpClient,
    private platformService: PlatformService
  ) {
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.platformService.getSessionStorage(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    this.platformService.setSessionStorage(this.TOKEN_KEY, token);
  }

  clearToken(): void {
    this.platformService.removeSessionStorage(this.TOKEN_KEY);
  }

  getCurrentUser(): UserDto | null {
    const user = this.platformService.getSessionStorage(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: UserDto): void {
    this.platformService.setSessionStorage(this.USER_KEY, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    this.platformService.removeSessionStorage(this.USER_KEY);
  }

  login(credentials: LoginDto): Observable<LoginResponseDto> {
    return this.httpService.post<LoginResponseDto>('auth/login', credentials).pipe(
      tap(response => {
        // Armazena o token automaticamente após login bem-sucedido
        this.setToken(response.token);
        this.setCurrentUser(response.user);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.clearCurrentUser();
  }

  createUser(userData: UserDto): Observable<any> {
    return this.httpService.post('users/', userData);
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.httpService.post<{ message: string }>('auth/reset-password', { email });
  }

  verifyResetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.httpService.post<{ message: string }>('auth/verify-reset-password', {
      token,
      new_password: newPassword
    });
  }
}
