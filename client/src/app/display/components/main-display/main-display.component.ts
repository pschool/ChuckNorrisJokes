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
    this.jokesService.GetJokes(10, jokes => {
      this.jokes = jokes;
    });

    const tmpJokes: Joke[] = JSON.parse(localStorage.getItem(this.localStorageKey));
    if (tmpJokes) {
      this.favorites = tmpJokes;
    }
  }

  public logout() {
    this.authService.logout();
  }

  public addJokeToFavorites(joke: Joke): void {
    if (this.favorites.length >= 10) {
      return;
    }

    if (this.favorites.indexOf(joke) < 0) {
      this.favorites.push(joke);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.favorites));
    }
  }

  public removeJokeFromFavorites(joke: Joke): void {
    if (this.favorites.indexOf(joke) >= 0) {
      this.favorites.splice(this.favorites.indexOf(joke), 1);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.favorites));
    }
  }
}
