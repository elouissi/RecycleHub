import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private recyclingBackgrounds = [
    'https://images.unsplash.com/photo-1617358141206-1d675bf8a2a7', // Tri des déchets
    'https://images.unsplash.com/photo-1591193686104-c28cef0d9c4f', // Recyclage de plastique
    'https://images.unsplash.com/photo-1587473472943-c80f4f44c4c0', // Poubelles de recyclage
    'https://images.unsplash.com/photo-1507346580942-3c5bc8de6520'  // Centre de recyclage
  ];

  getRandomRecyclingBackground(): string {
    const randomIndex = Math.floor(Math.random() * this.recyclingBackgrounds.length);
    return this.recyclingBackgrounds[randomIndex];
  }


}
