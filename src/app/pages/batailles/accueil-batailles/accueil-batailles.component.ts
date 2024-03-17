import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { MaterialModule } from 'src/app/shared/material.module';
@Component({
  selector: 'app-accueil-batailles',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MaterialModule],
  templateUrl: './accueil-batailles.component.html',
  styleUrl: './accueil-batailles.component.css'
})
export class AccueilBataillesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
