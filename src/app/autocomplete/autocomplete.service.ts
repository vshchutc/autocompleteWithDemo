import { IGithubRepository } from './interfaces/githubRepository';
import { IAutocompleteOption } from './interfaces/autocompleteOption';
import { IGithubUser } from './interfaces/githubUser';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGitHubResponseUsers, IGitHubResponseRepository } from './interfaces/githubResponce';
@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private usersMap = {};
  private repositoryMap = {};

  constructor(private http: HttpClient ) { }

  getFilteredOptions = (query: string): Observable<IAutocompleteOption[]> => {
    return zip(this.getUsers(query), this.getRepositories(query)).pipe(
      map(
        (value) => this.convertUsersAndRepositoriesToFilterOptions(value)
      )
    )
  }

  private getUsers = (query: string): Observable<IGithubUser[]> => {
    return this.http.get<IGitHubResponseUsers>(`https://api.github.com/search/users?q=${query}&per_page=50`)
      .pipe(map( (usersData) : IGithubUser[] => usersData.items));
  }

  private getRepositories = (query: string): Observable<IGithubRepository[]> => {
    return this.http.get<IGitHubResponseRepository>(`https://api.github.com/search/repositories?q=${query}&per_page=50`)
    .pipe(map((repositoriesData) : IGithubRepository[] => repositoriesData.items));
  }

  private convertUsersAndRepositoriesToFilterOptions = (data: any[]) : IAutocompleteOption[] => {
    let i = 0;
    let j = 0;
    const [users, repositories] = data;
    const userOptions = users.map(this.convertUserResponseObjToUserOption);
    const repositoryOptions = repositories.map(this.convertRepoResponseObjToRepoOption);
    const options: IAutocompleteOption[] = userOptions.concat(repositoryOptions);

    return options.sort(this.optionsComparator);
  }

  private convertUserResponseObjToUserOption = (userResponceObject: IGithubUser) : IAutocompleteOption => {
    return {
      value: userResponceObject.id.toString(),
      type: 'user',
      label: userResponceObject.login
    };
  }

  private convertRepoResponseObjToRepoOption = (repositoryResponceObject: IGithubRepository): IAutocompleteOption => {
    return {
      value: repositoryResponceObject.id.toString(),
      type: 'repository',
      label: repositoryResponceObject.name
    };
  }

  private optionsComparator = (option1: IAutocompleteOption, option2: IAutocompleteOption): number  => {
    if (option1.label < option2.label) {
      return -1;
    }
    if (option2.label < option1.label) {
      return 1;
    }
  
    return 0;
  }
}
