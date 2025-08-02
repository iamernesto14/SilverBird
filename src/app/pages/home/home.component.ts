import { Component } from '@angular/core';
<<<<<<< HEAD

@Component({
  selector: 'app-home',
  imports: [],
=======
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SearchComponent } from "../../shared/components/search/search.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [SidebarComponent, SearchComponent, RouterOutlet],
>>>>>>> c9f8da05c4f5a2c17a7a8eeb764213ef65b46bea
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
