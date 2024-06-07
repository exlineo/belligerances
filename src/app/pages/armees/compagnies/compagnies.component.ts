import { Component, OnInit, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/material.module';
import { Aleas, ArmeeI, Compagnie, CompagnieI, UniteI } from 'src/app/shared/modeles/Type';
import { ArmesPipe, CompagniesPipe, PjPipe, StatutsPipe, UnitePipe, UnitesArrayPipe, UnitesPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, CompagniesPipe, UnitesPipe, SlicePipe, ArmesPipe, UnitesArrayPipe],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class CompagniesComponent implements OnInit {
  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

  filtre: string = '';
  filtreUnites: string = '';
  filtreRaces: number = -1;

  compagnie!: CompagnieI; // Compagnie sélectionnée ou en cours de création

  unitesTypes: Array<UniteI> = [];
  unitesGenerees: Array<UniteI> = [];
  n: number = 0; // Nombre de duplications des unités types
  alea: number = 0; // Pourcentage d'aléa pour la création des unités
  aleas = new Aleas(); // Ensemble des aléas

  pagination = { min: 0, max: 10 };

  ngOnInit() { this.initCompagnie(); }

  initCompagnie() {
    this.compagnie = new Compagnie();
    this.unitesGenerees = [];
    this.unitesTypes = [];
    this.n = 0;
    this.alea = 0;
    this.pagination = { min: 0, max: 10 };
  }
  /**
   * Générer des unités plus ou moins aléatoires pour créer une compagnie
   * @param uniteType L'unité qu'il faut dupliquer
   * @param d Le nombre d'unités à générer
   * @param alea Aléa entre chaque unité
   */
  genereUnites() {
    console.log("Unités types 1", this.unitesTypes);
    this.unitesGenerees = [];
    if (this.aleas.n > 0) {
      this.unitesTypes.forEach((u: UniteI) => {
        u.xp = 0;
        u.nbCombats = 0;
        u.cmd = 0;
      });

      let j: number = 0; // Itérer dans les unités types

      for (let i = 0; i < this.aleas.n; ++i) {

        let unite = { ...this.unitesTypes[j] };
        unite.pj = unite.archetype = false; // Réinitialiser les statuts pour ne pas avoir 12000 joueurs
        unite.id = this.d.docs.unites[this.d.docs.unites.length - 1].id + i + 1; // Un ID pour l'unité
        this.compagnie.unites.push(unite.id);

        if (this.aleas.race) unite.race = this.randListe(this.d.docs.races).id;
        if (this.aleas.cac) unite.cac = this.randListe(this.d.docs.cac).id;
        if (this.aleas.jet) unite.jet = this.randListe(this.d.docs.jet).id;
        if (this.aleas.armure) unite.armure = this.randListe(this.d.docs.armures).id;
        if (this.aleas.bouclier) unite.bouclier = this.randListe(this.d.docs.boucliers).id;
        if (this.aleas.monture) unite.monture = this.randListe(this.d.docs.montures).id;

        unite.pvMax = unite.pv = this.rand(this.d.docs.races[unite.race].basePv, this.aleas.pourcent);

        !this.compagnie.pv ? this.compagnie.pv = unite.pv : this.compagnie.pv += unite.pv; // Donner des points de vie à la compagnie
        this.compagnie.pvMax = this.compagnie.pv;
        this.unitesGenerees.push(unite);

        // Un peu d'aléatoire dans la gestion des unités
        // if (this.aleas.pourcent > 25) {
        //   j = Math.floor(Math.random() * this.unitesTypes.length); // Tirer au hasard dans le tableau des unites types
        // } else {
        j == this.unitesTypes.length - 1 ? j = 0 : ++j;
        // }
      }
    } else {
      this.l.message('ER_UNITES_NB');
    }
  }
  /**
   * @param init Valeur de départ à partir de laquelle on applique le pourcentage
   * @param p Pourcentage à calculer
   * @returns écart
   */
  rand(init: number, p: number) {
    let ecart = Math.round(init * p / 100); // Ecart à calculter pour tirer au hasard
    let r = Math.round(Math.random() * (ecart * 2));
    let pv = Math.round(init - ecart + r);
    return pv > 1 ? pv : 2;
  }
  /** Tirer une valeur au hasard dans une liste */
  randListe(liste: Array<any>) {
    const val = Math.floor(Math.random() * liste.length);
    const str = liste[val];
    return str;
  }
  /** Supprimer une unité dans les unités générées */
  delUnite(index:number){
    this.unitesGenerees.splice(index, 1);
  }
  /** Pagination */
  setPagination(event: PageEvent) {
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = { min, max };
  }
  /** Ajouter une compagnie */
  addCompagnie() {
    this.compagnie.id = this.d.docs.compagnies.length; // Nouvelle ID de la compagnie

    this.d.docs.unites = this.d.docs.unites.concat(this.unitesGenerees); // Ajouter les unités créées à la liste des unités disponibles
    this.d.docs.compagnies.push(this.compagnie);
    if(this.compagnie.armee) this.d.addCompagnieToArmee(this.compagnie.id, this.compagnie.armee!);

    this.l.message('COMPAGNIE_ADD');
    console.log(this.compagnie);

    this.d.etatSave = true;
    this.initCompagnie();
  }
}
