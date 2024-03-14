import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-armes',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './armes-edit.component.html',
  styleUrl: './armes-edit.component.css'
})
export class EditArmesComponent {

  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  /** Mettre à jour l'arme */
  updateArme() {
    for(let i=0; i<this.d.docs[this.l.edit].length; ++i){
      if(this.d.docs[this.l.edit][i].id == this.l.maj.id){
        this.d.docs[this.l.edit][i] = {...this.l.maj};
      }
    }
    this.l.close();
    this.d.etatSave = true;
  }
}
