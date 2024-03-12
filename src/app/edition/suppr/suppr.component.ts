import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
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
    switch(this.l.edit){
      case "unites":
        this.supprUnite();
        break;
      case "compagnies":
          this.supprCompagnie();
          break;
    }
    this.l.close();
  }
  supprUnite() {
    console.log("Détecte unité indexOf", this.d.docs.unites.indexOf(this.l.maj));
    // Suppression de l'unité
    for(let i=0; i < this.d.docs.unites.length; ++i){
      if(this.d.docs.unites[i].id == this.l.maj.id){
        this.d.docs.unites.splice(i, 1);
      }
    }

    // Suppression de l'unité dans la compagnie
    this.d.docs.compagnies.forEach((c: any) => {
      if (c.unites.indexOf(this.l.maj.id) != -1) {
        c.unites.splice(c.unites.indexOf(this.l.maj.id), 1);
      }
    });
  }
  supprCompagnie() {
    console.log("Détecte unité indexOf", this.d.docs.unites.indexOf(this.l.maj));
    // Suppression de l'unité
    for(let i=0; i < this.d.docs.compagnies.length; ++i){
      if(this.d.docs.compagnies[i].id == this.l.maj.id){
        this.d.docs.compagnies.splice(i, 1);
      }
    }

    // Suppression de l'unité dans la compagnie
    this.d.docs.armees.forEach((a: any) => {
      if (a.compagnies.indexOf(this.l.maj.id) != -1) {
        a.compagnies.splice(a.compagnies.indexOf(this.l.maj.id), 1);
      }
    });
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
  // Supprimer d'une liste
  supprListe(liste: Array<any>, id: number) {
    if (liste.length > 0) {
      liste.forEach(
        (l: any, i: number) => {
          // Si c'est une liste avec un ID
          if (l.id && l.id == id) {
            if (l.id == id) {
              liste.splice(i, 1);
            }
          } else if (l == id) {
            // Si c'est une liste sans ID
            liste.splice(i, 1);
          }
        }
      );
    }
  }
}
