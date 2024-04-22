import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UtilsService } from '../../../shared/services/utils.service';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MaterialModule } from 'src/app/shared/material.module';
import { CompagnieI, OrdreI, PositionI, UniteI } from 'src/app/shared/modeles/Type';
import { BlessurePipe, BonusCmdPipe, BonusMoralPipe, BonusXpPipe, MalusJetPipe, StatutsPipe } from 'src/app/shared/pipes/tris.pipe';
import { PageEvent } from '@angular/material/paginator';
import { SlicePipe } from '@angular/common';
import { CombatsService } from 'src/app/shared/services/combats.service';

@Component({
  selector: 'app-batailles',
  standalone: true,
  imports: [MaterialModule, CdkDrag, BonusCmdPipe, BonusMoralPipe, BonusXpPipe, MalusJetPipe, BlessurePipe, SlicePipe, StatutsPipe],
  templateUrl: './batailles.component.html',
  styleUrl: './batailles.component.css',
  animations: [
    trigger('tabOuvre', [
      state('ferme', style({ right: 350 })),
      state('ouvre', style({ right: 0 })),
      transition('ouvre => ferme', [animate('.3s ease')]),
      transition('ferme => ouvre', [animate('0.3s ease')]),
    ]),
    trigger('tabLeve', [
      state('leve', style({ top: -250 })),
      state('baisse', style({ top: 0 })),
      transition('leve => baisse', [animate('.3s ease')]),
      transition('baisse => leve', [animate('0.3s ease')]),
    ])
  ]
})
export class BataillesComponent implements AfterViewInit, AfterViewChecked {
  l: UtilsService = inject(UtilsService); // Service de traduction
  d: DonneesService = inject(DonneesService); // Service de données
  c:CombatsService = inject(CombatsService);

  tabArmees: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  tabActions: boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  ordre:boolean = false; // Afficher la liste des ordres disponibles

  hexActu: string = '';
  opacite: number = 0.25;

  el: any; // Element sélectionné

  drag: boolean = false;
  initPos!: PositionI; // Position initiale du champ de bataille
  pagination = { min: 0, max: 10 };

  bg: string = ''; // Arrière plan de la bataille
  @ViewChildren('token') tokensView!: QueryList<ElementRef>;
  @ViewChild('map') mapView!: ElementRef;
  listeTokens!: Array<unknown>;

  @HostListener('contextmenu')
  actions(event: Event, c: CompagnieI, i: number) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.c.selected = c;
    this.c.indexAttaquant = i;
    this.c.infos = false;
    if (this.el) {
      this.el.style.zIndex = 1000;
      this.el = event.target;
    };
    return false;
  }
  /** Gérer la position des tokens lorsqu'ils sont déposés */
  ngAfterViewInit(): void {
    this.tokensView.changes.subscribe(
      t => {
        if (this.c.listeCompagnies.length > 0) {
          const pos = this.c.listeCompagnies[this.c.listeCompagnies.length - 1].position;
          t.last.nativeElement.style.top = pos.y + 'px';
          t.last.nativeElement.style.left = pos.x + 'px';
        }
      }
    )
    this.posTokens(); // Positionner le tokens s'il y en a sur le champ de bataille en arrivant
  }
  ngAfterViewChecked() {
    const map = this.mapView.nativeElement.getBoundingClientRect()
    this.initPos = { x: Math.round(map.left), y: Math.round(map.top) }; // Position intiale du champ de bataille pour calculer la position du token droppé
  }
  /** Positionner les tokens */
  posTokens(){
    if (this.c.listeCompagnies.length > 0) {
      this.tokensView.forEach((t:any, index:number) => {
          const pos = this.c.listeCompagnies[index].position;
          t.nativeElement.style.top = pos.y + 'px';
          t.nativeElement.style.left = pos.x + 'px';
        })
    }
  }
  /** Evénements sur le drop  */
  tokenDrop(event: CdkDragEnd, compagnie: CompagnieI, libre?: boolean) {
    compagnie.position = { x: event.dropPoint.x - this.initPos.x - 40, y: event.dropPoint.y - this.initPos.y - 40 };
    this.c.listeCompagnies.push(compagnie); // Enregistrer les compagnies sur le champ de bataille
    if (!libre) event.source.reset(); // Remettre le token initial à sa place
    this.drag = false; // Fin de l'événement drag
  }
  tokenLeave(event: any) {
    if (this.el) {
      this.el.style.zIndex = 1;
      this.el = undefined;
    }
  }
  // Ajustement en temps réel du slide
  matSlide(event: any) {
    this.opacite = event.target.value / 200;
  }
  matDistance(event: any) {
    this.c.distance = event.target.value;
  }
  // Gérer l'overflow sur le drag au mouvement de la sourie
  setDragOverflow() {
    if (!this.drag) this.drag = true;
  }
  /** Supprimer un token du champ de bataille */
  actionDel(event: Event, index: number, id: number) {
    if (id == this.c.attaque?.id) {
      this.c.attaque = undefined;
      this.c.uAts = [];
    };
    if (id == this.c.defend?.id) {
      this.c.defend = undefined;
      this.c.uDefs = [];
    };
    this.c.listeCompagnies.splice(index, 1);
  }
  /** Afficher les infos sur la compagnie */
  actionInfos(c: CompagnieI) {
    this.c.action = 'ACT_INFOS';
    this.c.infos = true;
  }
  /** Déterminer la compagnie qui va se battre */
  actionBaston(event: Event, c: CompagnieI, l: string = 'ACT_CAC') {
    this.c.officierAt = this.c.officierDef = undefined; // On vire les officiers s'il y a lieu
    if (this.c.attaque && this.c.attaque.id == c.id) {
      this.c.attaque = undefined;
      this.c.uAts = [];
      this.cacheActions();
    } else {
      this.c.attaque = c;
      this.c.uAts = this.d.docs.unites.filter((u: UniteI) => this.c.attaque?.unites.includes(u.id));
      this.tabActions = true;
      this.c.action = l; // La traduction de l'action, permet de connaître son type
    }
  }
  /** Déterminer la compagnie qui défend */
  actionDefend(c: CompagnieI) {
    this.c.officierAt = this.c.officierDef = undefined; // On vire les officiers s'il y a lieu
    if (this.c.defend && this.c.defend.id == c.id) {
      this.c.defend = undefined;
      this.c.uDefs = [];
      this.cacheActions();
    } else {
      this.c.defend = c;
      this.c.uDefs = this.d.docs.unites.filter((u: UniteI) => this.c.defend?.unites.includes(u.id));
      this.tabActions = true;
      // Réunitialiser les états des blessés et des morts
      this.c.blesses = 0;
      this.c.morts = 0;
    }
  }
  /** Afficher les infos sur la compagnie */
  actionRallie(c: CompagnieI) {
    this.c.action = 'ACT_RALLIE';
    if (c.moral > 0) { // Si la compagnie n'est pas désorganisée
      this.l.message('ER_MORAL');
    } else if (c.commandant && this.d.docs.unites.find((u: UniteI) => u.id == c.commandant)) {
      const commandant = this.d.docs.unites.find((u: UniteI) => u.id == c.commandant);
      const jet = this.c.jetAttaque(commandant.cmd); // Prendre en compte les pertes dans la compagnie et l'absence de général ou de commandant comme variable
      console.log(jet);
      if (jet >= 12) {
        c.moral = 2; // Jet réussi, Moral remonte de 2
        this.l.message('MSG_MORAL_GAIN');
      } else {
        this.l.message('MSG_MORAL_NULL');
      }
    }
  }
  /** Choisir un ordre */
  actionOrdre(comp:CompagnieI){
    this.ordre = true;
  }
  /** Défier un adversaire */
  actionDefi(id: number, type: boolean) {
    this.c.action = 'ACT_DEFI';
    // Initialisation des compagniers
    this.c.attaque = this.c.defend = undefined;
    this.c.uAts = this.c.uDefs = [];
    this.c.blesses = this.c.morts = 0;
    // Si type == true, c'est l'attaquant, sinon le défenseur
    const unite = this.d.docs.unites.find((u: UniteI) => u.id == id);
    if (type) {
      this.c.officierAt == unite ? this.c.officierAt = undefined : this.c.officierAt = unite;
    } else {
      this.c.officierDef == unite ? this.c.officierDef = undefined : this.c.officierDef = unite;
    }
    this.cacheActions();
  }
  /** Cacher la fenêtre des actions */
  cacheActions() {
    (!this.c.attaque && !this.c.defend) || (!this.c.officierAt && !this.c.officierDef) ? this.tabActions = false : this.tabActions = true;
    this.c.action = 'ACT';
  }
  /** Agir */
  goCombat() {
    if ((this.c.attaque&& !this.c.defend) || (!this.c.attaque&& this.c.defend) || (this.c.officierAt && !this.c.officierDef) || (!this.c.officierAt && this.c.officierDef)) {
      this.l.message('MSG_BELLI_CHOIX');
    } else if (this.c.attaque&& this.c.defend) {
      this.c.combatCompagnies();
    } else if (this.c.officierAt && this.c.officierDef) {
      this.c.combatChefs();
    } else {
      this.l.message('MSG_BELLI_CHOIX');
    }
  }
  /** Attribuer un ordre à une compagnie */
  setOrdre(ordre:OrdreI){
    console.log(this.c.selected, ordre);
    this.c.selected!.ordre = ordre;
  }
  /** Pagination */
  setPagination(event: PageEvent) {
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = { min, max };
  }
}
