import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { BlessurePipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-unites',
  standalone: true,
  imports: [MaterialModule, BlessurePipe],
  templateUrl: './unites-edit.component.html',
  styleUrl: './unites-edit.component.css'
})
export class EditUnitesComponent {

  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);
  blessurePipe:BlessurePipe = new BlessurePipe();

  constructor(){
    console.log("Edition ouverte");
  }

  updateUnite() {
    this.l.maj.etat = this.blessurePipe.transform(this.l.maj); // Changer l'état de l'unité

    for(let i=0; i<this.d.docs.unites.length; ++i){
      if(this.d.docs.unites[i].id == this.l.maj.id){
        this.d.docs.unites[i] = {...this.l.maj};
      }
    }
    this.l.close();
    this.d.etatSave = true;
  }
}
