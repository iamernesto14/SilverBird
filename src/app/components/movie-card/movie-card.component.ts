import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { Movie } from '../../model/movie';
import { Subscription } from 'rxjs';

export type CardVariant = 'trending' | 'recommended' | 'featured' | 'compact';
export type CardSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit, OnDestroy {
  @Input() movie!: Movie;
  @Input() variant: CardVariant = 'recommended';
  @Input() size: CardSize = 'medium';
  @Input() showPlayButton: boolean = true;
  @Input() showBookmark: boolean = true;
  @Input() showRating: boolean = true;
  @Input() showPopularity: boolean = true;
  @Input() showViews: boolean = false;
  @Input() customClass: string = '';
  
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() playClick = new EventEmitter<Movie>();
  @Output() bookmarkClick = new EventEmitter<Movie>();
  @Output() movieSelected = new EventEmitter<number>();

  isBookmarked = false;
  private subscription?: Subscription;

  constructor(private bookmarkService: BookmarkService) { }
  
  ngOnInit() {
    // Initialize bookmark state
    this.isBookmarked = this.bookmarkService.isBookmarked(this.movie.id);
    
    // Listen for bookmark changes to keep UI in sync
    this.subscription = this.bookmarkService.bookmarkedMovies$.subscribe(() => {
      this.isBookmarked = this.bookmarkService.isBookmarked(this.movie.id);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onCardClick() {
    this.movieSelected.emit(this.movie.id);
  }

  get cardClasses(): string {
    const baseClasses = 'relative rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105';
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${this.customClass}`;
  }

  get imageClasses(): string {
    switch (this.variant) {
      case 'trending':
        return 'w-full h-32 object-cover';
      case 'recommended':
        return 'w-full h-72 object-cover';
      case 'featured':
        return 'w-full h-80 object-cover';
      default:
        return 'w-full h-48 object-cover';
    }
  }

  private getVariantClasses(): string {
    switch (this.variant) {
      case 'trending':
        return 'bg-gray-800 text-white max-w-xs';
      case 'recommended':
        return 'bg-gray-900 text-white max-w-xs';
      case 'featured':
        return 'bg-gray-900 text-white max-w-sm';
      default:
        return 'bg-gray-900 text-white max-w-xs';
    }
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'small':
        return 'max-w-48';
      case 'medium':
        return 'max-w-xs';
      case 'large':
        return 'max-w-sm';
      default:
        return 'max-w-xs';
    }
  }

  onMovieClick(): void {
    this.movieClick.emit(this.movie);
  }

  onPlayClick(event: Event): void {
    event.stopPropagation();
    this.playClick.emit(this.movie);
  }

  onBookmarkClick(event: Event): void {
    event.stopPropagation();
    this.bookmarkService.toggleBookmark(this.movie);
    this.bookmarkClick.emit(this.movie);
  }

  getImageUrl(): string {
    if (this.movie.poster_path) {
      return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
    }
    return 'assets/images/placeholder-movie.jpg';
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  formatPopularity(popularity: number): string {
    if (popularity >= 1000) {
      return Math.round(popularity / 1000) + 'K';
    }
    return Math.round(popularity).toString();
  }
}