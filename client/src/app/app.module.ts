import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { DisplayModule } from './display/display.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    CoreModule,
    DisplayModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
