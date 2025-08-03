export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  overview?: string;
  genre_ids?: number[];
  bookmarked?: boolean;
  category?: string;
  rating?: string;
  views?: string;
}