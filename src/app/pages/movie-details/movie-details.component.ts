import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService } from '../../services/movies/movies.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.component.html'
})
export class MovieDetailsComponent implements OnInit {
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.moviesService.getMovieDetails(id).subscribe((data) => {
      this.movie = data;
    });
  }

  goBack(): void {
    window.history.back();
  }
  
}
