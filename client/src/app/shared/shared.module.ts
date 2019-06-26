import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JokeListComponent } from './components/joke-list/joke-list.component';

@NgModule({
  declarations: [
    JokeListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JokeListComponent
  ]
})
export class SharedModule { }
