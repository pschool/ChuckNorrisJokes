import { Component, OnInit } from '@angular/core';
import { JokesService } from './core/services/api/jokes/jokes.service';
import { Joke } from './core/definitions/dto/joke';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  jokes: Joke[] = [];

  constructor(private jokesService: JokesService) { }

  ngOnInit(): void {
    console.log('getJokes');
    this.jokesService.GetJokes(10, jokes => {
      console.log(jokes);
      this.jokes = jokes;
    });
  }
}
