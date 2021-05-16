import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
