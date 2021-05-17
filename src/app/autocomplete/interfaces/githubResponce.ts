import { IGithubRepository } from './githubRepository';
import { IGithubUser } from './githubUser';

interface IGitHubResponse {
    incomplete_results: boolean;
    total_count: number;
}

export interface IGitHubResponseUsers extends IGitHubResponse {
    items:IGithubUser[];
}

export interface IGitHubResponseRepository extends IGitHubResponse {
    items:IGithubRepository[];
}