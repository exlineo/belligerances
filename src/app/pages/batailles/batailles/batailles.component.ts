import { Component, inject } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MaterialModule } from 'src/app/shared/material.module';
import { CompagnieI, PositionI } from 'src/app/shared/modeles/Type';

@Component({
  selector: 'app-batailles',
  standalone: true,
  imports: [MaterialModule, CdkDrag, CdkDropList, CdkDropListGroup],
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
    trigger('tabOuvre', [
      state('ferme', style({ right: 350 })),
      state('ouvre', style({right: 0 })),
      transition('ouvre => ferme', [
        animate('.3s ease')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease')
      ]),
    ])
  ]
})
export class BataillesComponent {
  l:UtilsService = inject(UtilsService); // Service de traduction
  d:DonneesService = inject(DonneesService); // Service de données

  ligneHex:Array<any> = Array(15); // Nombre d'éléments par ligne
  lignesHex:Array<any> = Array(12); // Nombre de lignes à afficher

  tabArmees:boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  tabActions:boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre

  hexActu:string ='';
  opacite:number = 0.25;

  listeArmees:Array<any> = []; // Armées sur le champ de bataille
  listeCompagnies:Array<CompagnieI> = []; // Compagnies sur le champ de bataille

  tokenPosition:PositionI = {x:0, y:0};

  selectHex(id:string){
    this.hexActu = id;
  }
  initHex(){
    this.hexActu = '';
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  /** Evénements sur le drop  */
  tokenDrop(event:any, compagnie:CompagnieI, libre?:boolean){
    compagnie.position = event.source.getFreeDragPosition();
    this.listeCompagnies.push(compagnie);
    console.log(this.listeCompagnies);
    this.tokenPosition = event.source.getFreeDragPosition();
    if(!libre) event.source.reset();
  }
  tokenBouge(event:any){
    console.log(event);
  }
  startDrag(event:any){
    this.tokenPosition = event.source.get
  }
  showCompagnie(event:any){
    console.log(event);
  }
  matSlide(event:any){
    this.opacite = event.target.value/200;
  }
}
