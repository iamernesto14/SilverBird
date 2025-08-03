import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { Movie } from '../../model/movie';
import { Subscription } from 'rxjs';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmarked',
  templateUrl: './bookmarked.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent
  ]
})
export class BookmarkedComponent implements OnInit, OnDestroy {
  bookmarkedMovies: Movie[] = [];
  private subscription!: Subscription;

  constructor(
    private bookmarkService: BookmarkService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Reactively listen for changes to the bookmark list
    this.subscription = this.bookmarkService.bookmarkedMovies$.subscribe(
      (movies) => {
        this.bookmarkedMovies = movies;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // This method is no longer needed since the bookmark state is managed
  // reactively through the service, but keeping it for template compatibility
  removeBookmark(movie: Movie): void {
    // The actual removal is handled by the movie card component
    // This method can be used for additional logic if needed
  }

  goToDetails(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }
}