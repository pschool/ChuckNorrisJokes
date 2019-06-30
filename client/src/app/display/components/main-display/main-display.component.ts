import { Component, OnInit } from '@angular/core';
import { Joke } from '../../../core/definitions/dto/joke';
import { JokesService } from '../../../core/services/api/jokes/jokes.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit {
  localStorageKey = 'favorite-jokes';
  jokes: Joke[] = [];
  favorites: Joke[] = [];

  constructor(
    private jokesService: JokesService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.jokesService.getJokes(10, jokes => {
      if (jokes) {
        this.jokes = jokes;
      }
    });

    this.jokesService.getFavorites(jokes => {
      if (jokes) {
        this.favorites = jokes;
      }
    });
  }

  /**
   * Removes the JWT token.
   */
  public logout() {
    this.authService.logout();
  }

  public userMail() {
    return this.authService.getTokenData().email;
  }

  /**
   * Adds joke to users favorites.
   * @param joke - Joke to add.
   */
  public addJokeToFavorites(joke: Joke): void {
    if (this.favorites.length >= 10) {
      return;
    }

    if (this.favorites.indexOf(joke) < 0) {
      this.jokesService.addToFavorites(joke, responseJokes => {
        this.favorites = responseJokes;
      });
    }
  }

  /**
   * Removes joke from users favorites.
   * @param joke - Joke to remove.
   */
  public removeJokeFromFavorites(joke: Joke): void {
    if (this.favorites.indexOf(joke) >= 0) {
      this.jokesService.removeFromFavorites(joke, responseJokes => {
        this.favorites = responseJokes;
      });
    }
  }

  /**
   * Adds one random joke every 5 seconds.
   * Limits at 10 favorite jokes.
   */
  public async startFillingFavorites(): Promise<void> {
    for (let i: number = this.favorites.length; i < 10; i++) {
      await this.delay(5000);
      this.jokesService.getJokes(1, jokes => {
        this.jokesService.addToFavorites(jokes[0], responseJokes => {
          this.favorites = responseJokes;
        });
      });
    }
  }

  /**
   * Forces code to wait.
   * @param ms - Amount of milliseconds to wait.
   */
  public delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
