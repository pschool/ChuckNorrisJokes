import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Joke } from '../../../definitions/dto/joke';

@Injectable({
  providedIn: 'root'
})
export class JokesService {

  /**
   * Default constructor triggered when the class is initialized.
   * @param httpClient - Angular class.
   */
  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Get the users that are allowed to perform the activity.
   */
  public getJokes(
    amount: number,
    success?: (response: Joke[]) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .get<Joke[]>(`http://localhost:3000/jokes/random/${amount}`)
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
          console.error(err);
          if (failure) {
            failure(err);
          }
        }
      );
  }

  /**
   * Obtains a users favorite jokes.
   */
  public getFavorites(
    success?: (response: Joke[]) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .get<Joke[]>(`http://localhost:3000/jokes/favorites`)
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
          console.error(err);
          if (failure) {
            failure(err);
          }
        }
      );
  }

  /**
   * Adds given joke to users favorites.
   * @param joke - Joke to add.
   */
  public addToFavorites(
    joke: Joke,
    success?: (response: Joke[]) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .post<Joke[]>(`http://localhost:3000/jokes/favorites`, { joke })
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
          console.error(err);
          if (failure) {
            failure(err);
          }
        }
      );
  }

  /**
   * Removes given joke from users favorites.
   * @param joke - Joke to remove.
   */
  public removeFromFavorites(
    joke: Joke,
    success?: (response: Joke[]) => void,
    failure?: (error: any) => void,
    final?: () => void
  ): Subscription {
    return this.httpClient
      .delete<Joke[]>(`http://localhost:3000/jokes/favorites/${joke.id}`)
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
          console.error(err);
          if (failure) {
            failure(err);
          }
        }
      );
  }
}
