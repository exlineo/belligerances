import { Component, OnInit, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/material.module';
import { Aleas, Compagnie, CompagnieI, UniteI } from 'src/app/shared/modeles/Type';
import { ArmesPipe, CompagniesPipe, PjPipe, StatutsPipe, UnitesPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, CompagniesPipe, UnitesPipe, SlicePipe, ArmesPipe],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class CompagniesComponent implements OnInit {
  l: UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  filtre:string = '';
  filtreUnites:string = '';
  filtreRaces:number = -1;

  compagnie!: CompagnieI; // Compagnie sélectionnée ou en cours de création
  compagnieAlea!:CompagnieI; // Compagnie choisie pour générer des unités aléatoirement

  unitesTypes:Array<UniteI> = [];
  unitesGenerees:Array<UniteI> = [];
  n:number = 0; // Nombre de duplications des unités types
  alea:number = 0; // Pourcentage d'aléa pour la création des unités
  aleas = new Aleas(); // Ensemble des aléas

  pagination = {min:0,max:25};

  ngOnInit() { this.initCompagnie(); }

  initCompagnie() { this.compagnie = new Compagnie(); }

  setUnitesAlea(){

  }
  /**
   *
   * @param aleas Liste des aléas à générer
   */
  genereUnites(){
    console.log(this.aleas);
    this.unitesGenerees = this.d.genereUnites(this.aleas, this.unitesTypes)
  }
  setPagination(event:PageEvent){
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = {min, max};
    console.log(this.pagination, event);
   }
   supprUniteCompagnie(){

   }
}
