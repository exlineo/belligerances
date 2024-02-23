import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from '../../../shared/services/donnees.service';
import { ArmeesPipe, PjPipe, StatutsPipe } from '../../../shared/pipes/tris.pipe';
import { ArmeeI, Armee, CompagnieI } from 'src/app/shared/modeles/Type';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
  selector: 'app-armees',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, ArmeesPipe],
  templateUrl: './armees.component.html',
  styleUrl: './armees.component.css'
})
export class ArmeesComponent implements OnInit{

  l:any = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  filtre:string = '';

  armee!:ArmeeI;
  compagnieChoix!:CompagnieI;

  ngOnInit(){ this.initArmee(); }

  initArmee(){ this.armee = new Armee(); }

  dragStart(c:CompagnieI){
    console.log(c);
    this.compagnieChoix = c;
  }
  dragEnd(){

  }
  drop(){
    this.armee.compagnies.push(this.compagnieChoix.id)
  }
}
