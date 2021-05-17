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
  private optionsMap: any = {};

  constructor(private http: HttpClient ) { }

  getFilteredOptions = (query: string): Observable<IAutocompleteOption[]> => {
    return zip(this.getUsers(query), this.getRepositories(query)).pipe(
      map(
        (value) => this.processUsersAndRepoData(value)
      )
    );
  }

  getOptionDataById = (objId: string) => {
    const dataById = this.optionsMap[objId];

    if (dataById) {
      return dataById;
    } else {
      throw new Error('Error. Try to select another option');
    }
  }

  private getUsers = (query: string): Observable<IGithubUser[]> => {
    return this.http.get<IGitHubResponseUsers>(`https://api.github.com/search/users?q=${query}&per_page=50`)
      .pipe(map( (usersData): IGithubUser[] => usersData.items));
  }

  private getRepositories = (query: string): Observable<IGithubRepository[]> => {
    return this.http.get<IGitHubResponseRepository>(`https://api.github.com/search/repositories?q=${query}&per_page=50`)
    .pipe(map((repositoriesData): IGithubRepository[] => repositoriesData.items));
  }

  private processUsersAndRepoData = (data: any[]): IAutocompleteOption[] => {
    const [users, repositories] = data;
    const userOptions = users.map(this.convertUserResponseObjToOptionAndSaveToMap);
    const repositoryOptions = repositories.map(this.convertRepoObjToOptionAndSaveToMap);
    const options: IAutocompleteOption[] = userOptions.concat(repositoryOptions);

    return options.sort(this.optionsComparator);
  }


  private convertUserResponseObjToOptionAndSaveToMap = (userResponceObject: IGithubUser): IAutocompleteOption => {
    const id = `user-${userResponceObject.id}`;
    const label =  `User: ${userResponceObject.login}`;
    const option = {id, label};

    this.optionsMap[id] = {
      option,
      fullData: userResponceObject
    };

    return option;
  }

  private convertRepoObjToOptionAndSaveToMap = (repositoryResponceObject: IGithubRepository): IAutocompleteOption => {
    const id = `repo-${repositoryResponceObject.id}`;
    const label = `Repository: ${repositoryResponceObject.name}`;
    const option = {id, label};

    this.optionsMap[id] = {
      option,
      fullData: repositoryResponceObject
    };

    return option;
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
