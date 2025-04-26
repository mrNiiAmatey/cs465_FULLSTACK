import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from '../services/trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  /** Get token from localStorage */
  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  /** Save token to localStorage */
  private saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  /** Login: returns the raw AuthResponse, but also saves the JWT */
  public login(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService
      .login(user, password)
      .pipe(
        tap((resp: AuthResponse) => this.saveToken(resp.token))
      );
  }

  /** Register: same pattern, assumes TripDataService has a register() overload */
  public register(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService
      .register(user, password)
      .pipe(
        tap((resp: AuthResponse) => this.saveToken(resp.token))
      );
  }

  /** Remove token */
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  /** Returns true if JWT is present and not expired */
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) { return false; }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  }

  /** Return the decoded User object from the JWT */
  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) { return null; }
    const token = this.getToken()!;
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }
}


