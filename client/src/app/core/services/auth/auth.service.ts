import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api/authentication/authentication.service';

export interface IUser {
  email?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
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
    success?: (user: IUser) => void,
    failure?: (error: any) => void,
    final?: () => void): void {

    this.authenticationService.Register(
      email,
      password,
      response => {
        const user: IUser = {
          email
        };
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
    success?: (user: IUser) => void,
    failure?: (error: any) => void,
    final?: () => void): void {

    this.authenticationService.Login(
      email,
      password,
      response => {
        const user: IUser = {
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
  public getToken(): IUser {
    return JSON.parse(localStorage.getItem(AuthService.tokenStorageKey));
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
}
