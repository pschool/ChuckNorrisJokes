import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Joke } from '../../../core/definitions/dto/joke';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss']
})
export class JokeListComponent {

  @Input() jokes: Joke[];
  @Input() actionButtonText: string;
  @Output() selectedJoke: EventEmitter<Joke> = new EventEmitter();

  private activeJoke: Joke = null;

  /**
   * Enables marking joke as selected.
   * @param joke - The selected joke.
   */
  public selectJoke(joke: Joke): void {
    if (this.activeJoke === joke) {
      this.activeJoke = null;
      return;
    }
    this.activeJoke = joke;
  }

  /**
   * Passes the selected joke to the parent.
   */
  public action(): void {
    if (this.activeJoke === null) {
      return;
    }

    this.selectedJoke.emit(this.activeJoke);
    this.activeJoke = null;
  }

  /**
   * Replaces the '&quot;' with actual quotes to display.
   * @param joke - Joke to display.
   */
  public displayJoke(joke: Joke): string {
    return joke.joke.replace(/&quot;/g, '"');
  }

  /**
   * Determines if the given joke is selected.
   * @param joke - Joke to check.
   */
  public isActive(joke: Joke): boolean {
    return joke === this.activeJoke;
  }

}
