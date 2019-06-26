import { Component, OnInit } from '@angular/core';
import { JokesService } from './core/services/api/jokes/jokes.service';
import { Joke } from './core/definitions/dto/joke';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  localStorageKey = 'favorite-jokes';
  jokes: Joke[] = [];
  favorites: Joke[] = [];

  constructor(private jokesService: JokesService) { }

  ngOnInit(): void {
    this.jokesService.GetJokes(10, jokes => {
      this.jokes = jokes;
    });

    const tmpJokes: Joke[] = JSON.parse(localStorage.getItem(this.localStorageKey));
    if (tmpJokes) {
      this.favorites = tmpJokes;
    }
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
