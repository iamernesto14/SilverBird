import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home',
    },
    {
        path: 'bookmarked',
        loadComponent: () => import('./pages/bookmarked/bookmarked.component').then(m => m.BookmarkedComponent),
        title: 'Bookmarked',
    },
    {
        path: 'movies',
        loadComponent: () => import('./pages/movies/movies.component').then(m => m.MoviesComponent),
        title: 'Movies',
    },
    {
        path: 'movies/:id',
        loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent),
        title: 'Movie Detail',
    },
    {
        path: 'tv-series',
        loadComponent: () => import('./pages/tv-series/tv-series.component').then(m => m.TvSeriesComponent),
        title: 'TV Series',
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];
