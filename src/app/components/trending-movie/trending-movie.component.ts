import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MoviesService } from '../../services/movies/movies.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-movie',
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './trending-movie.component.html',
  styleUrl: './trending-movie.component.scss'
})
export class TrendingMovieComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  trendingMovies: any[] = [];
  isLoading: boolean = true;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  scrollDots: number[] = [];
  currentDot: number = 0;
  cardWidth: number = 256; 
  
  // Auto-scroll properties
  private autoScrollInterval?: ReturnType<typeof setInterval>;
  private autoScrollDelay: number = 4000; 
  private isUserInteracting: boolean = false;
  private userInteractionTimeout?: ReturnType<typeof setTimeout>;
  public isPaused: boolean = false;
  
  private scrollAmount: number = 272; 
  private cardsPerView: number = 4; 
  private touchStartX: number = 0;
  private touchStartY: number = 0; 
  private resizeListener?: () => void; 

  constructor(
    private moviesService: MoviesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void { 
    this.loadTrendingMovies();
  }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.calculateResponsiveDimensions();
      this.updateScrollDots();
      this.checkScrollButtons();
      this.startAutoScroll(); // Start auto-scroll after initial setup
      this.cdr.detectChanges(); // Trigger change detection after initial setup
    }, 0);

    // Create resize listener
    this.resizeListener = () => {
      this.calculateResponsiveDimensions();
      this.updateScrollDots();
      this.checkScrollButtons();
      this.cdr.detectChanges(); // Trigger change detection after resize
    };

    // Listen for window resize
    window.addEventListener('resize', this.resizeListener);

    // Add visibility change listener to pause/resume auto-scroll when tab is not visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up event listeners and intervals
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    
    this.stopAutoScroll();
    
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private loadTrendingMovies(): void {
    this.isLoading = true;
    this.moviesService.getTrendingMovies().subscribe({
      next: (data) => {
        this.trendingMovies = data.results;
        this.isLoading = false;
        
        // Use setTimeout to ensure DOM updates before calculations
        setTimeout(() => {
          this.calculateResponsiveDimensions();
          this.updateScrollDots();
          this.checkScrollButtons();
          this.startAutoScroll(); // Start auto-scroll after movies are loaded
          this.cdr.detectChanges(); // Ensure change detection runs
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching trending movies:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private calculateResponsiveDimensions(): void {
    if (this.scrollContainer) {
      const containerWidth = this.scrollContainer.nativeElement.offsetWidth;
      const paddingHorizontal = 48; // 24px padding on each side
      const gap = 16; // gap between cards
      const availableWidth = containerWidth - paddingHorizontal;
      
      // Calculate responsive card width and cards per view
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1024) { // lg and above
        // For large screens, calculate optimal card width
        const idealCardsPerView = Math.floor(availableWidth / (200 + gap)); // minimum 200px per card
        this.cardsPerView = Math.max(3, Math.min(6, idealCardsPerView)); // Between 3-6 cards
        this.cardWidth = Math.floor((availableWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView);
      } else if (screenWidth >= 768) { // md
        this.cardsPerView = Math.floor(availableWidth / (220 + gap));
        this.cardsPerView = Math.max(2, Math.min(4, this.cardsPerView));
        this.cardWidth = 200;
      } else if (screenWidth >= 640) { // sm
        this.cardsPerView = Math.floor(availableWidth / (200 + gap));
        this.cardsPerView = Math.max(2, Math.min(3, this.cardsPerView));
        this.cardWidth = 180;
      } else { // xs
        this.cardsPerView = Math.floor(availableWidth / (180 + gap));
        this.cardsPerView = Math.max(1, Math.min(2, this.cardsPerView));
        this.cardWidth = 160;
      }
      
      // Update scroll amount based on actual card width
      this.scrollAmount = this.cardWidth + gap;
    }
  }

  private updateScrollDots(): void {
    if (this.trendingMovies.length > 0) {
      const totalPages = Math.ceil(this.trendingMovies.length / this.cardsPerView);
      this.scrollDots = Array(totalPages).fill(0).map((_, i) => i);
    }
  }

  // Auto-scroll methods
  private startAutoScroll(): void {
    if (this.trendingMovies.length <= this.cardsPerView) {
      return; // Don't auto-scroll if all movies fit in view
    }

    this.stopAutoScroll(); // Clear any existing interval
    
    this.autoScrollInterval = setInterval(() => {
      if (!this.isUserInteracting && !this.isPaused && !document.hidden) {
        this.autoScrollNext();
      }
    }, this.autoScrollDelay);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  }

  private autoScrollNext(): void {
    if (!this.scrollContainer) return;

    const container = this.scrollContainer.nativeElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= maxScrollLeft - 1) {
      // If at the end, scroll back to beginning
      container.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to next page
      container.scrollBy({
        left: this.scrollAmount * this.cardsPerView,
        behavior: 'smooth'
      });
    }
  }

  private handleUserInteraction(): void {
    this.isUserInteracting = true;
    
    // Clear existing timeout
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }
    
    // Resume auto-scroll after 8 seconds of no interaction
    this.userInteractionTimeout = setTimeout(() => {
      this.isUserInteracting = false;
    }, 8000);
  }

  private handleVisibilityChange(): void {
    this.isPaused = document.hidden;
  }

  // Enhanced scroll methods with user interaction handling
  scrollLeft(): void {
    this.handleUserInteraction();
    if (this.scrollContainer && this.canScrollLeft) {
      const container = this.scrollContainer.nativeElement;
      container.scrollBy({
        left: -this.scrollAmount * this.cardsPerView,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    this.handleUserInteraction();
    if (this.scrollContainer && this.canScrollRight) {
      const container = this.scrollContainer.nativeElement;
      container.scrollBy({
        left: this.scrollAmount * this.cardsPerView,
        behavior: 'smooth'
      });
    }
  }

  scrollToPage(pageIndex: number): void {
    this.handleUserInteraction();
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      const scrollPosition = pageIndex * this.scrollAmount * this.cardsPerView;
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  onScroll(event?: Event): void {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }
    
    // Use setTimeout to defer the state updates
    setTimeout(() => {
      this.checkScrollButtons();
      this.updateCurrentDot();
      this.cdr.detectChanges();
    }, 0);
  }

  onWheel(event: WheelEvent): void {
    this.handleUserInteraction();
    
    // Only handle horizontal scroll within the container
    const container = this.scrollContainer.nativeElement;
    
    // Check if we're scrolling horizontally or if we can scroll horizontally
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || 
        (event.deltaY !== 0 && (this.canScrollLeft || this.canScrollRight))) {
      
      event.preventDefault();
      event.stopPropagation();
      
      // Convert vertical scroll to horizontal scroll
      const scrollAmount = event.deltaY !== 0 ? event.deltaY : event.deltaX;
      container.scrollLeft += scrollAmount;
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.handleUserInteraction();
    
    // Store initial touch position for touch scrolling
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.touchStartX || !this.touchStartY) return;
    
    const touch = event.touches[0];
    const deltaX = this.touchStartX - touch.clientX;
    const deltaY = this.touchStartY - touch.clientY;
    
    // If primarily horizontal movement, prevent page scroll
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private checkScrollButtons(): void {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      const newCanScrollLeft = scrollLeft > 0;
      const newCanScrollRight = scrollLeft < maxScrollLeft - 1; // -1 for rounding errors

      // Only update if values actually changed
      if (this.canScrollLeft !== newCanScrollLeft || this.canScrollRight !== newCanScrollRight) {
        this.canScrollLeft = newCanScrollLeft;
        this.canScrollRight = newCanScrollRight;
      }
    }
  }

  private updateCurrentDot(): void {
    if (this.scrollContainer && this.scrollDots.length > 0) {
      const container = this.scrollContainer.nativeElement;
      const scrollLeft = container.scrollLeft;
      const pageWidth = this.scrollAmount * this.cardsPerView;
      const newCurrentDot = Math.round(scrollLeft / pageWidth);
      const constrainedDot = Math.max(0, Math.min(newCurrentDot, this.scrollDots.length - 1));
      
      // Only update if value actually changed
      if (this.currentDot !== constrainedDot) {
        this.currentDot = constrainedDot;
      }
    }
  }

  trackByMovieId(index: number, movie: any): number {
    return movie.id || index;
  }

  // Enhanced keyboard navigation with user interaction handling
  onKeyDown(event: KeyboardEvent): void {
    this.handleUserInteraction();
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.scrollLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.scrollRight();
        break;
      case ' ': // Spacebar to pause/resume auto-scroll
        event.preventDefault();
        this.toggleAutoScroll();
        break;
    }
  }

  // Method to toggle auto-scroll (can be used for pause/play button)
  toggleAutoScroll(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused && this.autoScrollInterval) {
      // Resume auto-scroll immediately if not paused
      this.isUserInteracting = false;
    }
  }

  goToDetails(movieId: number) {
    this.handleUserInteraction();
    this.router.navigate(['/movies', movieId]);
  }

  // Mouse enter/leave handlers for container hover
  onMouseEnter(): void {
    this.handleUserInteraction();
  }

  onMouseLeave(): void {
    // Don't immediately resume, let the timeout handle it
  }
}