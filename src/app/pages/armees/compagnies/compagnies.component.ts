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

  unitesTypes:Array<UniteI> = [];
  unitesGenerees:Array<UniteI> = [];
  n:number = 0; // Nombre de duplications des unités types
  alea:number = 0; // Pourcentage d'aléa pour la création des unités
  aleas = new Aleas(); // Ensemble des aléas

  pagination = {min:0,max:25};

  ngOnInit() { this.initCompagnie(); }

  initCompagnie() {
    this.compagnie = new Compagnie();
    this.unitesGenerees = [];
    this.unitesTypes = [];
    this.n = 0;
    this.alea = 0;
    this.pagination = {min:0,max:25};
  }
  /**
   * Générer des unités plus ou moins aléatoires pour créer une compagnie
   * @param uniteType L'unité qu'il faut dupliquer
   * @param d Le nombre d'unités à générer
   * @param alea Aléa entre chaque unité
   */
  genereUnites() {
    let j: number = 0;

    for (let i = 0; i < this.aleas.n; ++i) {
      const unite = { ...this.unitesTypes[j] };
      unite.id = this.d.docs.unites[this.d.docs.unites.length-1].id + i +1; // Un ID pour l'unité
      this.compagnie.unites.push(unite.id);

      if (this.aleas.race) unite.race = this.d.randListe(this.d.docs.races).id;
      if (this.aleas.cac) unite.cac = this.d.randListe(this.d.docs.cac).id;
      if (this.aleas.jet) unite.jet = this.d.randListe(this.d.docs.jet).id;
      if (this.aleas.armure) unite.armure = this.d.randListe(this.d.docs.armures).id;
      if (this.aleas.bouclier) unite.bouclier = this.d.randListe(this.d.docs.boucliers).id;
      if (this.aleas.monture) unite.monture = this.d.randListe(this.d.docs.montures).id;

      unite.pvMax = this.d.rand(unite.pvMax, this.aleas.pourcent);
      unite.pv = unite.pvMax;
      this.unitesGenerees.push(unite);

      j == this.unitesTypes.length - 1 ? j = 0 : ++j;
    }
  }
  /** Pagination */
  setPagination(event:PageEvent){
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = {min, max};
    console.log(this.pagination, event);
   }
   /** Ajouter une compagnie */
   addCompagnie(){
    this.compagnie.id = this.d.docs.compagnies.length; // Nouvelle ID de la compagnie
    this.d.docs.unites.concat(this.unitesGenerees); // Ajouter les unités créées à la liste des unités disponibles
    this.d.docs.compagnies.push(this.compagnie);

    this.l.message(this.l.t['COMPAGNIE_ADD']);
    this.d.etatSave = false;

    this.initCompagnie();
   }
}
