import { AfterViewChecked, AfterViewInit, Component, Directive, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { CdkDragDrop, CdkDrag, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MaterialModule } from 'src/app/shared/material.module';
import { CompagnieI, PositionI } from 'src/app/shared/modeles/Type';
import { DomChangedDirective } from 'src/app/shared/dom-directive';

@Component({
  selector: 'app-batailles',
  standalone: true,
  imports: [MaterialModule, CdkDrag, DomChangedDirective],
  templateUrl: './batailles.component.html',
  styleUrl: './batailles.component.css',
  animations: [
    trigger('apparait', [
      state('invisible', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('* => visible', [
        animate('.3s ease-out')
      ]),
      transition('visible => invisible', [
        animate('.3s ease-in')
      ]),
    ]),
    trigger('ouvre', [
      state('ferme', style({ right: 0 })),
      state('ouvre', style({ right: 250 })),
      transition('ouvre => ferme', [
        animate('.3s ease-out')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease-in')
      ]),
    ]),
    trigger('tabOuvre', [
      state('ferme', style({ right: 350 })),
      state('ouvre', style({ right: 0 })),
      transition('ouvre => ferme', [
        animate('.3s ease')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease')
      ]),
    ])
  ]
})
export class BataillesComponent implements AfterViewInit, AfterViewChecked {
  l: UtilsService = inject(UtilsService); // Service de traduction
  d: DonneesService = inject(DonneesService); // Service de données

  // ligneHex:Array<any> = Array(15); // Nombre d'éléments par ligne
  // lignesHex:Array<any> = Array(12); // Nombre de lignes à afficher

  tabArmees: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  tabActions: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre

  hexActu: string = '';
  opacite: number = 0.25;

  listeArmees: Array<any> = []; // Armées sur le champ de bataille
  listeCompagnies: Array<CompagnieI> = []; // Compagnies sur le champ de bataille
  fight!: CompagnieI | undefined; // La compagnie qui attaque
  defend!: CompagnieI | undefined; // La compagie qui défend
  indexFight:number = -1; // Index de la compagnie qui attaque

  drag: boolean = false;
  initPos!: PositionI; // Position initiale du champ de bataille

  bg: string = '';

  @ViewChildren('token') tokensView!: QueryList<ElementRef>;
  @ViewChild('map') mapView!: ElementRef;
  listeTokens!: Array<unknown>;

  @HostListener('contextmenu')
  actions(event:Event, c: CompagnieI, i:number) {
    event.preventDefault();
    event.stopPropagation();
    console.log('compagnie', c);
    this.fight = c;
    this.indexFight = i;
    return false;
  }

  ngAfterViewInit(): void {
    this.tokensView.changes.subscribe(
      t => {
        const pos = this.listeCompagnies[this.listeCompagnies.length - 1].position;
        t.last.nativeElement.style.top = pos.y + 'px';
        t.last.nativeElement.style.left = pos.x + 'px';
      }
    )
  }
  ngAfterViewChecked() {
    const map = this.mapView.nativeElement.getBoundingClientRect()
    this.initPos = { x: Math.round(map.left), y: Math.round(map.top) }; // Position intiale du champ de bataille pour calculer la position du token droppé
  }

  // Déterminer l'hexagone sélectionné (déprécié)
  selectHex(id: string) {
    this.hexActu = id;
  }
  initHex() {
    this.hexActu = '';
  }
  // Evénement sur le drop (déprécié)
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
  tokenDrop(event: CdkDragEnd, compagnie: CompagnieI, libre?: boolean) {
    console.log("event pos", event.dropPoint, "init pos", this.initPos);
    compagnie.position = { x: event.dropPoint.x - this.initPos.x - 40, y: event.dropPoint.y - this.initPos.y - 40 };
    this.listeCompagnies.push(compagnie); // Enregistrer les compagnies sur le champ de bataille
    if (!libre) event.source.reset(); // Remettre le token initial à sa place
    this.drag = false; // Fin de l'événement drag
  }
  tokenBouge(event: any) {
    console.log(event);
  }
  // Ajustement en temps réel du slide
  matSlide(event: any) {
    this.opacite = event.target.value / 200;
  }
  // Gérer l'overflow sur le drag au mouvement de la sourie
  setDragOverflow() {
    if (!this.drag) this.drag = true;
  }
  /** Actions sur le clic droit */
  // actions(c:CompagnieI){
  //   console.log(c);
  // }
}
