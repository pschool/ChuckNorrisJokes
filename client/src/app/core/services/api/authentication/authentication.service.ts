/* tslint:disable:max-line-length */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface IAuthenticationLoginResponse {
  Username?: string;
  FirstName?: string;
  LastName?: string;
  Photo?: string;
  SessionTimeout?: number;
}

/**
 * Service used to communicate with the Authentication endpoint on the backend.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  /**
   * Default constructor triggered when the class is initialized.
   * @param httpClient - Angular class.
   * @param errorHandler - Global instance of the class that implements the {@link IErrorHandler} interface.
   */
  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Registers a new user.
   */
  public Register(
    email: string,
    password: string,
    success?: (response: any) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .post<any>('http://localhost:3000/authentication/register', { email, password })
      .pipe(finalize(() => {
        if (final) {
          final();
        }
      }))
      .subscribe(
        (response) => {
          if (success) {
            success(response);
          }
        },
        (err: HttpErrorResponse) => {
          console.error(`Unable to perform "Register" call. Error code: ${err.status}`);
        }
      );
  }

  /**
   * Logs the given user in.
   */
  public Login(
    email: string,
    password: string,
    success?: (response: any) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .post<any>('http://localhost:3000/authentication/login', { email, password })
      .pipe(finalize(() => {
        if (final) {
          final();
        }
      }))
      .subscribe(
        (response) => {
          if (success) {
            success(response);
          }
        },
        (err: HttpErrorResponse) => {
          console.error(`Unable to perform "Login" call. Error code: ${err.status}`);
        }
      );
  }
}
