import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDisplayComponent } from './components/main-display/main-display.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MainDisplayComponent],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class DisplayModule { }
