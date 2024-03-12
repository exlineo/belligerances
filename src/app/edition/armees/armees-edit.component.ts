import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { PjPipe, StatutsPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ColorPickerControl, Color } from '@iplab/ngx-color-picker';

@Component({
  selector: 'app-edit-armees',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe],
  templateUrl: './armees-edit.component.html',
  styleUrl: './armees-edit.component.css'
})
export class EditArmeesComponent implements AfterViewInit {
  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

  colorControl = new ColorPickerControl();
  color!: Color;
  @ViewChildren('checkitout') checks!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.checks.map( (c:any) => c.checked = false);

    this.colorControl.valueChanges.subscribe((value) => {
      this.l.maj.couleur = value.toHexString();
    });
  }
  /** Mise à jour de l'armée */
  updateArmee() {
    console.log(this.l.maj, this.d.docs.armees);
    for(let i=0; i < this.d.docs.armees.length; ++i){
      if(this.d.docs.armees[i].id == this.l.maj.id){
        this.d.docs.armees[i] = {...this.l.maj};
      }
    }
    console.log(this.d.docs.armees);
    this.d.etatSave = true;
    this.l.close();
  }
  // Attribuer une couleur
  setColor(event: MouseEvent) {
    event.stopPropagation();
    this.l.maj.couleur = this.colorControl.value.toHexString();
    this.d.etatSave = true;
    console.log(this.color, this.l.maj);
  }
  /** Ajouter des compagnies à l'armée en cours */
  addCompagnie(event: MatCheckboxChange, id: number) {
    console.log(event.checked);
    if (this.l.maj.compagnies.includes(id)) {
      this.l.maj.compagnies.splice(this.l.maj.compagnies.indexOf(id), 1);
    } else {
      this.l.maj.compagnies.push(id);
    }
    this.d.etatSave = true;
  }
}
