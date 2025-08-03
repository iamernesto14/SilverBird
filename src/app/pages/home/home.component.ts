import { Component } from '@angular/core';
import { TrendingMovieComponent } from "../../components/trending-movie/trending-movie.component";
import { RecommendedMovieComponent } from '../../components/recommended-movie/recommended-movie.component';



@Component({
  selector: 'app-home',
  imports: [TrendingMovieComponent, RecommendedMovieComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
