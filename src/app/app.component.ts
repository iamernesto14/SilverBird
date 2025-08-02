import { Component } from '@angular/core';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { SearchComponent } from './shared/components/search/search.component';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [ SidebarComponent, SearchComponent, RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'silver-bird';
}
