import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { SharedModule } from 'primeng/api';
import { UtilsService } from '../../../shared/services/utils.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-batailles',
  standalone: true,
  imports: [SharedModule, NgFor, NgIf, TooltipModule],
  templateUrl: './batailles.component.html',
  styleUrl: './batailles.component.css',
  animations: [
    trigger('apparait', [
      state('invisible', style({ opacity: 0 })),
      state('visible', style({opacity: 1 })),
      transition('* => visible', [
        animate('.3s ease-out')
      ]),
      transition('visible => invisible', [
        animate('.3s ease-in')
      ]),
    ]),
    trigger('ouvre', [
      state('ferme', style({ right: 0 })),
      state('ouvre', style({right: 250 })),
      transition('ouvre => ferme', [
        animate('.3s ease-out')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease-in')
      ]),
    ]),
  ],
})
export class BataillesComponent {
  l:UtilsService = inject(UtilsService); // Service de traduction

  ligneHex:Array<any> = Array(15); // Nombre d'éléments par ligne
  lignesHex:Array<any> = Array(12); // Nombre de lignes à afficher

  hexActu:string ='';

  selectHex(id:string){
    this.hexActu = id;
  }
  initHex(){
    this.hexActu = '';
  }
}
