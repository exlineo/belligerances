import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { Creature, CreatureI } from 'src/app/shared/modeles/Type';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-creatures',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './creatures.component.html',
  styleUrl: './creatures.component.css'
})
export class CreaturesComponent {
  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

  liste:string = ''; // Type de créature à ajouter

  creature:CreatureI = new Creature(); // Une créature à ajouter

  initCreature(){
    this.creature = new Creature();
    this.liste = '';
  }
  /** Ajouter la créature nouvellement créée */
  addCreature(){
    this.creature.id = this.d.docs[this.liste].length;
    this.d.docs[this.liste].push(this.creature);
    this.initCreature();
  }
}
