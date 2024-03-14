import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { Creature, CreatureI } from 'src/app/shared/modeles/Type';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-creatures',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './creatures-edit.component.html',
  styleUrl: './creatures-edit.component.css'
})
export class EditCreaturesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  /** Mettre à jour l'arme */
  updateCreature() {
    for(let i=0; i<this.d.docs[this.l.edit].length; ++i){
      if(this.d.docs[this.l.edit][i].id == this.l.maj.id){
        this.d.docs[this.l.edit][i] = {...this.l.maj};
      }
    }
    this.l.close();
    this.d.etatSave = true;
  }
}
