import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api/authentication/authentication.service';

export interface ITokenData {
  email: string;
  id: string;
  timestamp: number;
}

/**
 * The AuthService is responsible for most functionality related to authentication and authorization.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Key for the local storage where the user information is saved. */
  static tokenStorageKey = 'tokenStorageKey';

  /**
   * Default constructor triggered when the class is initialized.
   * @param errorHandler - Global instance of the class that implements the {@link IErrorHandler} interface.
   * @param authenticationService - Service used to communicate with the back-end to the authentication endpoint.
   * @param router - Angular Router class.
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Registers a new user.
   * @param username - The username to register.
   * @param password - The password to register.
   * @param success - Callback function returning the user.
   */
  public register(
    email: string,
    password: string,
    success?: () => void,
    failure?: (error: any) => void,
    final?: () => void): void {

    this.authenticationService.Register(
      email,
      password,
      response => {
        if (success) {
          success();
        }
      },
      failure,
      () => {
        if (final) {
          final();
        }
      }
    );
  }

  /**
   * Log into a new session with a specific username and password.
   * @param username - The username to log in with.
   * @param password - The password to log in with.
   * @param success - Callback function returning the user.
   */
  public login(
    email: string,
    password: string,
    success?: (user: any) => void,
    failure?: (error: any) => void,
    final?: () => void): void {

    this.authenticationService.Login(
      email,
      password,
      response => {
        const user = {
          email
        };
        // TODO: use token
        localStorage.setItem(AuthService.tokenStorageKey, response.token);
        if (success) {
          success(user);
        }
      },
      failure,
      () => {
        if (final) {
          final();
        }
      }
    );
  }

  /**
   * Obtains the JWT.
   * Returns 'null' if not logged in.
   */
  public getTokenData(): ITokenData {
    return this.decodeToken(this.getToken());
  }

  /**
   * Obtains the JWT.
   * Returns 'null' if not logged in.
   */
  public getToken(): string {
    if (!localStorage.getItem(AuthService.tokenStorageKey)) {
      return null;
    }

    const currentTimestamp: number = new Date().getTime();
    const tokenTimestamp: number = this.decodeToken(localStorage.getItem(AuthService.tokenStorageKey)).timestamp;
    const timeDiff = currentTimestamp - tokenTimestamp;

    // Destroy token if it is to old.
    if (timeDiff > 86400000) {
      this.logout();
      return null;
    } else {
      return localStorage.getItem(AuthService.tokenStorageKey);
    }
  }

  /**
   * Returns a boolean indicating if the user is currently logged in.
   */
  public isLoggedIn(): boolean {
    return this.getToken() ? true : false;
  }

  /**
   * Ends the session.
   */
  public logout(): void {
    localStorage.removeItem(AuthService.tokenStorageKey);
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
  }

  private decodeToken(token: string = ''): ITokenData {
    if (token === null || token === '') { return; }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT is not complete');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode token');
    }
    return JSON.parse(decoded);
  }

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Incorrect base64 string');
    }
    return decodeURIComponent((window as any).escape(window.atob(output)));
  }
}
