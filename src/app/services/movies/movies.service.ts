import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = `${environment.tmdb.baseUrl}`;
  constructor(private http: HttpClient) { }

  getTrendingMovies(): Observable<any> {
    const headers = {
      Authorization: environment.tmdb.token,
      'Content-Type': 'application/json'
    };
    return this.http.get(`${this.apiUrl}/trending/movie/day?language=en-US`, {
      headers
    });
  }

  getRecommendations(movieId: number): Observable<any> {
    const headers = {
      Authorization: environment.tmdb.token,
      'Content-Type': 'application/json'
    };
    return this.http.get(`${this.apiUrl}/movie/${movieId}/recommendations?language=en-US&page=1`, {
      headers
    });
  }

  getMovieDetails(movieId: number): Observable<any> {
    const headers = {
      Authorization: environment.tmdb.token,
      'Content-Type': 'application/json'
    };
    return this.http.get(`${this.apiUrl}/movie/${movieId}?language=en-US`, {
      headers
    });
  }
}
