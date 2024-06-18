import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { ArmeeI, UniteI } from 'src/app/shared/modeles/Type';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-suppr',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './suppr.component.html',
  styleUrl: './suppr.component.css'
})
export class SupprComponent implements OnInit {
  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

  liste!: Array<any>;

  ngOnInit(): void {
    this.liste = this.d.docs[this.l.edit];
  }
  suppr() {
    switch (this.l.edit) {
      case "armees":
        this.supprArmee();
        break;
      case "unites":
        this.supprUnite();
        break;
      case "compagnies":
        this.supprCompagnie();
        break;
      case "campagne":
        this.supprCampagne();
        break;
      default:
        this.supprListe();
        break;
    }
    this.l.close();
  }
  /** Supprimer une unité */
  supprUnite() {
    console.log("Détecte unité indexOf", this.d.docs.unites.indexOf(this.l.maj.id), this.l.maj);
    // Suppression de l'unité
    for (let i = 0; i < this.d.docs.unites.length; ++i) {
      if (this.d.docs.unites[i].id == this.l.maj.id) {
        this.d.docs.unites.splice(i, 1);
      }
    }

    // Suppression de l'unité dans la compagnie
    this.d.docs.compagnies.forEach((c: any) => {
      if (c.unites.indexOf(this.l.maj.id) != -1) {
        c.unites.splice(c.unites.indexOf(this.l.maj.id), 1);
      }
    });

    this.d.etatSave = true;
  }
  /** Supprimer une compagnie */
  supprCompagnie() {
    // Suppression de l'unité
    for (let i = 0; i < this.d.docs.compagnies.length; ++i) {
      if (this.d.docs.compagnies[i].id == this.l.maj.id) {
        this.d.docs.compagnies.splice(i, 1);
      }
    }

    // Suppression de la compagnie dans les armees
    this.d.docs.armees.forEach((a: any) => {
      if (a.compagnies.indexOf(this.l.maj.id) != -1) {
        a.compagnies.splice(a.compagnies.indexOf(this.l.maj.id), 1);
      }
    });

    // Supprimer les unités de la compagnie
    this.supprUnites(this.l.maj.unites);

    this.d.etatSave = true;
  }
  /** Supprimer une compagnie */
  supprArmee() {
    // Suppression de l'unité
    for (let i = 0; i < this.d.docs.armees.length; ++i) {
      if (this.d.docs.armees[i].id == this.l.maj.id) {
        this.d.docs.armees.splice(i, 1);
      }
    }

    // Suppression de l'armée dans la campagne
    this.d.campagnes.forEach((camp: any, i: number) => {
      camp.docs.armees.forEach((ar: ArmeeI, index: number) => {
        if (ar.id == this.l.maj.id) camp.docs.armees.splice(index, 1);
      });
    });
    console.log("Armée supprimée");
    this.d.etatSave = true;
  }
  /** Supprimer une arme */
  supprListe() {
    // Suppression de l'unité
    for (let i = 0; i < this.d.docs[this.l.edit].length; ++i) {
      if (this.d.docs[this.l.edit][i].id == this.l.maj.id) {
        this.d.docs[this.l.edit].splice(i, 1);
      }
    }
    const id = this.getListeId();
    // Suppression de l'unité dans la compagnie
    this.d.docs.unites.forEach((u: any) => {
      if (u[id] == this.l.maj.id) {
        u[id] = -1;
      }
    });
    this.d.etatSave = true;
  }
  /** Détruire une campagne */
  supprCampagne() {
    if (this.d.campagne) {
      const index = this.d.campagnes.indexOf(this.d.campagne);
      this.d.campagnes.splice(index, 1);
      this.d.campagne = null;
      this.d.etatSave = true;
    }
  }
  /** Détruire les unités d'une compagnie lorsqu'elle est détruite */
  supprUnites(unites:Array<number>){
    // unites.forEach((id) => {
      this.d.docs.unites.forEach( (u:UniteI, index:number) => {
        if (unites.indexOf(u.id) != -1 && (!u.archetype && !u.pj)) {
          this.d.docs.unites.splice(index, 1);
          // console.log(index, u);
        };
      });
    // })
  }
  /** Récupérer l'identifiant d'une arme ou une créature pour son édition */
  getListeId() {
    switch (this.l.edit) {
      case 'armures':
        return 'armure';
      case 'boucliers':
        return 'bouclier'
      case 'sorts':
        return 'sort'
      case 'races':
        return 'race'
      case 'montures':
        return 'monture'
      default:
        return this.l.edit;
    }
  }
  // Identifier les listes connexes
  getListe() {
    switch (this.l.edit) {
      case 'compagnies':
        return this.d.docs.armees;
      case 'unites':
        return this.d.docs.compagnies;
      case 'cac':
      case 'jet':
      case 'armures':
      case 'boucliers':
      case 'montures':
        return this.d.docs.unites;
      default:
        return [];
    }
  }
}
