import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-accueil-armees',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './accueil-armees.component.html',
  styleUrl: './accueil-armees.component.css'
})
export class AccueilArmeesComponent {

}
