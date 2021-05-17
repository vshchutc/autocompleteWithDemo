import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'autocompleteWithDemo';
  selectionInfo = '';
  objUrl = '';

  onAutocompleteChange = ($event: any) => {
    const {type, selectedOption} = $event;
    const name = type === 'repo' ? selectedOption.name : selectedOption.login;
    this.selectionInfo = `The ${type} ${name} was selected.`;
  }
}
