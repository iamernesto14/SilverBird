import { Component } from '@angular/core';
import { MoviesService } from '../../services/movies/movies.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommended-movie',
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './recommended-movie.component.html',
  styleUrl: './recommended-movie.component.scss'
})
export class RecommendedMovieComponent {
  recommendedMovies: any[] = [];

  constructor(private moviesService: MoviesService, private router: Router) { }

  ngOnInit() {
    this.moviesService.getRecommendations(755898).subscribe({
      next: (data) => {
        this.recommendedMovies = data.results;
      },
      error: (error) => {
        console.error('Error fetching recommended movies:', error);
      }
    });
  }

  goToDetails(movieId: number) {
  this.router.navigate(['/movies', movieId]);
}
}
