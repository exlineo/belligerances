import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './shared/services/utils.service';
import { PrimeNGConfig, FilterMatchMode } from 'primeng/api';
import { DonneesService } from './shared/services/donnees.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'Belligerance';
  l: UtilsService = inject(UtilsService); // Langues et autres infos
  d:DonneesService = inject(DonneesService); // Les données du logiciel

  constructor(private primeConfig: PrimeNGConfig) {
    this.l.getLangue();
    console.log(this.l.t);
  }
  // Configurations et chargement de données
  ngOnInit(): void {
    this.primeConfig.ripple = true;
    this.primeConfig.filterMatchModeOptions = {
      text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
      numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
      date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
    };
  }
}
