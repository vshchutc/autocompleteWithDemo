import { IGithubUser } from './../interfaces/githubUser';
import { AutocompleteService } from './../autocomplete.service';
import { Component, Input, OnDestroy, OnInit, Output, Query, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAutocompleteOption } from '../interfaces/autocompleteOption';
import { Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IGithubRepository } from '../interfaces/githubRepository';
import { EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Output() autocompleteSelect = new EventEmitter<{selectedOption: IGithubUser | IGithubRepository, type: string}>();
  @ViewChild('searchInput') searchInput: any;

  filteredOptions: IAutocompleteOption[] = [];
  searchControl = new FormControl();
  query = '';
  placeholder = 'Enter 3 characters to search';
  isLoading = false;
  messageOption = '';
  searchSubscription: Subscription = new Subscription();
  selectedOption: IAutocompleteOption | undefined;


  constructor(private autocompleteService: AutocompleteService) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchControl.valueChanges.pipe(debounceTime(400), ).subscribe(
      this.getFilteredOptions
    );
  }

  onOptionSelected = (event: MatAutocompleteSelectedEvent) => {
    const optionId = event.option.value;

    if (optionId){
      const selectedOption = this.autocompleteService.getOptionDataById(optionId);
      const type = optionId.split('-')[0];
      this.autocompleteSelect.emit({selectedOption: selectedOption.fullData, type});
      this.selectedOption = selectedOption.option;
    }
  }

  getOptionLabel = (optionId: string) => {
    const selectedOption = optionId && this.autocompleteService.getOptionDataById(optionId);
    if (selectedOption){
      return selectedOption.option.label;
    } else {
      return '';
    }
  }

  private getFilteredOptions = (value: string) => {
    if (value === this.selectedOption?.id) {
      return ;
    }

    if (value && value.length >= 3) {
      this.updateOptions(value);
      this.query = value;
    } else {
      this.messageOption = 'Minimum query length is equal to 3 symbols.';
    }
  }

  private updateOptions = (value: string) => {
    this.filteredOptions = [];
    this.isLoading = true;
    this.messageOption = 'Loading...';
    this.searchControl.disable({emitEvent: false});
    this.autocompleteService.getFilteredOptions(value).subscribe(this.onFilterOptionsGotten, this.onFilterOptionsGetError);
  }

  private onFilterOptionsGotten = (options: IAutocompleteOption[]) => {
    this.isLoading = false;
    this.searchControl.enable({emitEvent: false});

    if (!options.length){
      this.messageOption = 'No options found.';
    } else {
      this.messageOption = '';
      this.filteredOptions = options;
      this.searchInput.nativeElement.focus();
    }
  }

  private onFilterOptionsGetError = () => {
    this.messageOption = 'Error occured. Please, try again later.';
    this.isLoading = false;
    this.searchControl.enable({emitEvent: false});
  }


  ngOnDestroy = () => {
    this.searchSubscription.unsubscribe();
  }

}
