import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { SidebarProfileComponent } from './components/sidebar-profile/sidebar-profile.component';
import { TrendingTopicsComponent } from './components/trending-topics/trending-topics.component';
import { LenguajesListComponent } from './components/lenguajes-list/lenguajes-list';

import { BackgroundComponent } from './components/background/background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SidebarProfileComponent, TrendingTopicsComponent, LenguajesListComponent, BackgroundComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'app-devspace';
}
