import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [AutocompleteComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule
  ],
  exports: [AutocompleteComponent]
})
export class AutocompleteModule { }
