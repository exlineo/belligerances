import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { Arme, ArmeI } from 'src/app/shared/modeles/Type';
import { StatutsPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-armurerie',
  standalone: true,
  imports: [MaterialModule, StatutsPipe],
  templateUrl: './armurerie.component.html',
  styleUrl: './armurerie.component.css'
})
export class ArmurerieComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  arme:ArmeI = new Arme(); // Une créature à ajouter
  liste = '';

  initArme(){
    this.arme = new Arme();
    this.liste = '';

    this.d.etatSave = false;
  }
  /** Ajouter la créature nouvellement créée */
  addArme(){
    this.arme.id = this.d.docs[this.liste].length;
    this.d.docs[this.liste].push(this.arme);
    this.initArme();

    this.d.etatSave = true;
  }
}
