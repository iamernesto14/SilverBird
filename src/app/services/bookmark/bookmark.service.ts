import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../../model/movie';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private bookmarkedMovies = new BehaviorSubject<Movie[]>([]);
  bookmarkedMovies$ = this.bookmarkedMovies.asObservable();

  constructor() { 
    const storedBookmarks = localStorage.getItem('bookmarkedMovies');
    if (storedBookmarks) {
      try {
        this.bookmarkedMovies.next(JSON.parse(storedBookmarks));
      } catch (error) {
        console.error('Error parsing stored bookmarks:', error);
        localStorage.removeItem('bookmarkedMovies');
      }
    }
  }
  
  getBookmarks(): Movie[] { 
    return this.bookmarkedMovies.getValue();
  }

  isBookmarked(movieId: number): boolean {
    return this.getBookmarks().some(movie => movie.id === movieId);
  }

  toggleBookmark(movie: Movie): void {
    const current = this.getBookmarks();
    const isBookmarked = this.isBookmarked(movie.id);
    
    let updatedBookmarks: Movie[];
    if (isBookmarked) {
      updatedBookmarks = current.filter(m => m.id !== movie.id);
    } else {
      // Create a clean copy without the bookmarked property to avoid state duplication
      const { bookmarked, ...cleanMovie } = movie;
      updatedBookmarks = [...current, cleanMovie as Movie];
    }
    
    this.bookmarkedMovies.next(updatedBookmarks);
    this.saveToStorage(updatedBookmarks);
  }

  private saveToStorage(bookmarks: Movie[]): void {
    try {
      localStorage.setItem('bookmarkedMovies', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }
}