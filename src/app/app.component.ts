import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './shared/services/utils.service';
import { DonneesService } from './shared/services/donnees.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'Belligerance';
  l: UtilsService = inject(UtilsService); // Langues et autres infos
  d:DonneesService = inject(DonneesService); // Les données du logiciel

  constructor() {
    this.l.getLangue();
  }
}
