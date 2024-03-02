import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { CampagneI } from 'src/app/shared/modeles/Type';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  creeCampagne(){

  }
}
