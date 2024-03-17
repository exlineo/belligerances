import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
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
    trigger('tabOuvre', [
      state('ferme', style({ right: 350 })),
      state('ouvre', style({ right: 0 })),
      transition('ouvre => ferme', [
        animate('.3s ease')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease')
      ]),
    ]),
    trigger('tabLeve', [
      state('leve', style({ top: -180 })),
      state('baisse', style({ top: 0 })),
      transition('leve => baisse', [
        animate('.3s ease')
      ]),
      transition('baisse => leve', [
        animate('0.3s ease')
      ]),
    ])
  ]
})
export class BataillesComponent implements AfterViewInit, AfterViewChecked {
  l: UtilsService = inject(UtilsService); // Service de traduction
  d: DonneesService = inject(DonneesService); // Service de données

  tabArmees: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  tabActions: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre

  hexActu: string = '';
  opacite: number = 0.25;

  listeArmees: Array<any> = []; // Armées sur le champ de bataille
  listeCompagnies: Array<CompagnieI> = []; // Compagnies sur le champ de bataille
  selected!:CompagnieI | undefined; // Compagnie en cours de traitement
  attaque!: CompagnieI | undefined; // La compagnie qui attaque
  defend!: CompagnieI | undefined; // La compagie qui défend
  indexAttaquant: number = -1; // Index de la compagnie qui attaque

  combat:any = {
    at:{
      type:'',
      dg:0
    },
    def:{
      armure:0
    }
  }

  drag: boolean = false;
  initPos!: PositionI; // Position initiale du champ de bataille

  bg: string = '';

  @ViewChildren('token') tokensView!: QueryList<ElementRef>;
  @ViewChild('map') mapView!: ElementRef;
  listeTokens!: Array<unknown>;

  @HostListener('contextmenu')
  actions(event: Event, c: CompagnieI, i: number) {
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('compagnie', c);
    this.selected = c;
    this.indexAttaquant = i;
    return false;
  }
  /** Gérer la position des tokens lorsqu'ils sont déposés */
  ngAfterViewInit(): void {
    this.tokensView.changes.subscribe(
      t => {
        if (this.listeCompagnies.length > 0) {
          const pos = this.listeCompagnies[this.listeCompagnies.length - 1].position;
          t.last.nativeElement.style.top = pos.y + 'px';
          t.last.nativeElement.style.left = pos.x + 'px';
        }
      }
    )
  }
  ngAfterViewChecked() {
    const map = this.mapView.nativeElement.getBoundingClientRect()
    this.initPos = { x: Math.round(map.left), y: Math.round(map.top) }; // Position intiale du champ de bataille pour calculer la position du token droppé
  }
  /** Evénements sur le drop  */
  tokenDrop(event: CdkDragEnd, compagnie: CompagnieI, libre?: boolean) {
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
  /** Supprimer un token du champ de bataille */
  actionDel(index: number) {
    this.listeCompagnies.splice(index, 1);
  }
  /** Afficher les infos sur la compagnie */
  actionInfos(index:number, c:CompagnieI){

  }
  /** Afficher les infos sur la compagnie */
  actionMoral(index:number, c:CompagnieI){

  }/** Afficher les infos sur la compagnie */
  actionCac(index:number, c:CompagnieI){
    this.attaque = c;
    this.tabActions = true;
  }
  /** Afficher les infos sur la compagnie */
  actionJet(index:number){

  }
  /** Afficher les infos sur la compagnie */
  actionSort(index:number){

  }
  actionDefend(c:CompagnieI){
    console.log(this.defend);
    if(this.defend){
      if(this.defend.id == c.id){
        this.defend = undefined;
      }
    }else{
      this.defend = c;
      this.tabActions = true;
    }
  }
  /** Afficher les infos sur la compagnie */
  actionRallie(index:number){

  }
}
