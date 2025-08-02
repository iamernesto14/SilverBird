import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SearchComponent } from "../../shared/components/search/search.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [SidebarComponent, SearchComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
