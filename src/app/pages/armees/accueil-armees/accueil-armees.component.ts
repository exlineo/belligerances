import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UtilsService } from '../../../shared/services/utils.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';

@Component({
  selector: 'app-accueil-armees',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './accueil-armees.component.html',
  styleUrl: './accueil-armees.component.css'
})
export class AccueilArmeesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
