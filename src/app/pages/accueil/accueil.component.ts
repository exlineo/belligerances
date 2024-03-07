import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';

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
  index!:number;

  creeCampagne(){
    this.d.campagne!.dates = {creation:Date.now(), update:0};
    this.d.campagne!.id = this.d.campagnes.length;
    this.d.campagnes.push(this.d.campagne!);
  }
}
