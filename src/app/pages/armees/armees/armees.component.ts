import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils.service';
import { SharedModule } from '../../../shared/shared.module';
import { DonneesService } from '../../../shared/services/donnees.service';
import { PjPipe, StatutsPipe } from '../../../shared/pipes/tris.pipe';
import { NgFor, NgIf } from '@angular/common';
import { ArmeeI, Armee } from 'src/app/shared/modeles/Type';

@Component({
  selector: 'app-armees',
  standalone: true,
  imports: [SharedModule, StatutsPipe, NgFor, NgIf, PjPipe],
  templateUrl: './armees.component.html',
  styleUrl: './armees.component.css'
})
export class ArmeesComponent {

  l:any = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  armee!:ArmeeI;

  constructor(){
    this.initArmee();
  }

  initArmee(){
    this.armee = new Armee();
  }
}
