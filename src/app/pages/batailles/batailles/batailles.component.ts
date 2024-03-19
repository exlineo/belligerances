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
import { ArmeI, CompagnieI, PositionI, UniteI } from 'src/app/shared/modeles/Type';
import { DomChangedDirective } from 'src/app/shared/dom-directive';
import { BonusCmdPipe, BonusMoralPipe, BonusXpPipe } from 'src/app/shared/pipes/tris.pipe';

@Component({
  selector: 'app-batailles',
  standalone: true,
  imports: [MaterialModule, CdkDrag, DomChangedDirective, BonusCmdPipe, BonusMoralPipe, BonusXpPipe],
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

  selected!: CompagnieI | undefined; // Compagnie en cours de traitement
  attaque!: CompagnieI | undefined; // La compagnie qui attaque
  defend!: CompagnieI | undefined; // La compagie qui défend
  uAt: Array<UniteI> = []; // Unités en attaque
  uDef: Array<UniteI> = []; // Unités en défense

  action: string = 'ACT_AT'; // Action en cours
  indexAttaquant: number = -1; // Index de la compagnie qui attaque
  el: unknown; // Element sélectionné

  // Pipes pour les combats
  xpPipe:BonusXpPipe = new BonusXpPipe();
  cmdPipe:BonusCmdPipe = new BonusCmdPipe();
  moralPipe:BonusMoralPipe = new BonusMoralPipe();

  combat: any = {
    at: {
      type: '',
      dg: 0
    },
    def: {
      armure: 0
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
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selected = c;
    this.indexAttaquant = i;
    this.el = event.target;
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
  actionDel(event: Event, index: number, id: number) {
    if (id == this.attaque?.id) {
      this.attaque = undefined;
      this.uAt = [];
    };
    if (id == this.defend?.id) {
      this.defend = undefined;
      this.uDef = [];
    };
    this.listeCompagnies.splice(index, 1);
  }
  /** Afficher les infos sur la compagnie */
  actionInfos(c: CompagnieI) {
    this.action = 'ACT_INFOS';
  }
  /** Afficher les infos sur la compagnie */
  actionMoral(c: CompagnieI) {
    this.action = 'ACT_MORAL';
  }
  /** Afficher les infos sur la compagnie */
  actionBaston(event: Event, c: CompagnieI, l: string = 'ACT_CAC') {
    if (this.attaque && this.attaque.id == c.id) {
      this.attaque = undefined;
      this.uAt = [];
      this.cacheActions();
    } else {
      this.attaque = c;
      this.uAt = this.d.docs.unites.filter((u: UniteI) => this.attaque?.unites.includes(u.id));
      this.tabActions = true;
      this.action = l; // La traduction de l'action, permet de connaître son type
    }
  }
  actionDefend(c: CompagnieI) {
    console.log(this.defend);
    if (this.defend && this.defend.id == c.id) {
      this.defend = undefined;
      this.uDef = [];
      this.cacheActions();
    } else {
      this.defend = c;
      this.uDef = this.d.docs.unites.filter((u: UniteI) => this.defend?.unites.includes(u.id));
      this.tabActions = true;
    }
  }
  /** Afficher les infos sur la compagnie */
  actionRallie(index: number) {
    this.action = 'ACT_RALLIE';
  }
  /** Cacher la fenêtre des actions */
  cacheActions() {
    !this.attaque && !this.defend ? this.tabActions = false : this.tabActions = true;
    this.action = 'ACT';
  }
  /** Agir */
  go() {
    console.log("Ca agit");
  }
  goCombat() {
    let def: UniteI;
    let xp = 0; // Bonus d'expérience d'une unité
    let ml = this.moralPipe.transform(this.attaque!.moral); // Bonus de moral de la compagnie
    let cmd = this.moralPipe.transform(this.d.docs.unite.filter((u:UniteI) => u.id == this.attaque?.commandant).xp); // Bonus du commandant
    let arme = {};
    let act: string = 'cac';
    switch (this.action) {
      case 'ACT_CAC':
        act = 'cac';
        break;
      case 'ACT_JET':
        act = 'jet';
        break;
      case 'ACT_SORT':
        act = 'sort';
        break;
    };

    this.uAt.forEach((u: any, i: number) => {
      xp = this.xpPipe.transform(u.xp); // Bonus d'xp de l'attaquant
      arme = this.d.docs.armes.find((a:ArmeI) => a.id == u['act'].id); // Arme de l'attaquant

      // Le defenseur subissant une attaque, choisi au hasard
      def = this.uDef[Math.round(Math.random() * (this.uDef.length - 1))];
      let defB = this.d.docs.armures.find((ar:ArmeI) => ar.id == def.armure);

    });
  }
  /** Jet d'attaque aléatoire */
  atAlea() {
    return Math.ceil(Math.random() * 20);
  }
  /* Calcul du score de combat */

  /** Dégats calculés en fonction de l'arme */
  atDeg(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min)) + min;
  }
}
