import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from '../../../shared/services/donnees.service';
import { ArmeesPipe, CompagniesArrayPipe, PjPipe, StatutsPipe } from '../../../shared/pipes/tris.pipe';
import { ArmeeI, Armee, CompagnieI } from 'src/app/shared/modeles/Type';
import { MaterialModule } from 'src/app/shared/material.module';
import { ColorPickerControl, Color } from '@iplab/ngx-color-picker';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-armees',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, ArmeesPipe, CompagniesArrayPipe],
  templateUrl: './armees.component.html',
  styleUrl: './armees.component.css'
})
export class ArmeesComponent implements AfterViewInit {

  l: any = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

  filtre: string = '';

  armee: ArmeeI = new Armee();
  compagnieChoix!: CompagnieI;
  color!: Color;
  colorControl = new ColorPickerControl();

  @ViewChildren('chekitout') checks!:QueryList<ElementRef>;

  ngAfterViewInit() {
    this.initArmee();
    this.colorControl.valueChanges.subscribe((value) => {
      this.armee.couleur = value.toHexString();
      console.log(this.armee, value);
    });
  }

  initArmee() {
    this.armee = new Armee();
    this.checks.map( (c:any) => c.checked = false);
  }
  // Attribuer une couleur
  setColor(event: MouseEvent) {
    event.stopPropagation();
    this.armee.couleur = this.colorControl.value.toHexString();
    console.log(this.color, this.armee);
  }
  /** Ajouter des compagnies à l'armée en cours */
  addCompagnie(event: MatCheckboxChange, id: number) {
    console.log(event.checked);
    if (this.armee.compagnies.includes(id)) {
      this.armee.compagnies.splice(this.armee.compagnies.indexOf(id), 1);
    } else {
      this.armee.compagnies.push(id);
    }
  }
  /* Créer une armee */
  creeArmee() {
    console.log(this.armee);
    if (this.armee.id == -1) {
      this.armee.id = this.d.docs.armees.length;
      this.d.docs.armees.push(this.armee);
      this.initArmee();
      console.log(this.d.docs.armees);
      this.d.etatSave = true;
      this.l.message('ARMEES_ADD');
    }
  }
}
