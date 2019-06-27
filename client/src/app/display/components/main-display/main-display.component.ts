import { Component, OnInit } from '@angular/core';
import { Joke } from '../../../core/definitions/dto/joke';
import { JokesService } from '../../../core/services/api/jokes/jokes.service';
import { AuthService } from '../../../core/services/auth/auth.service';

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
      this.jokes = jokes;
    });

    this.jokesService.getFavorites(jokes => {
      this.favorites = jokes;
    });
  }

  /**
   * Removes the JWT token.
   */
  public logout() {
    this.authService.logout();
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
}
