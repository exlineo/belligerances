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
import { ArmeI, CompagnieI, OrdreI, PositionI, UniteI } from 'src/app/shared/modeles/Type';
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
  uAts: Array<UniteI> = []; // Unités en attaque
  uDefs: Array<UniteI> = []; // Unités en défense

  action: string = 'ACT_AT'; // Action en cours
  indexAttaquant: number = -1; // Index de la compagnie qui attaque
  el: any; // Element sélectionné

  // Pipes pour les combats
  xpPipe: BonusXpPipe = new BonusXpPipe();
  cmdPipe: BonusCmdPipe = new BonusCmdPipe();
  moralPipe: BonusMoralPipe = new BonusMoralPipe();

  ordre?: OrdreI; // Ordre en cours

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
    if (this.el) this.el.style.zIndex = 1000;
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
  tokenLeave(event: any) {
    if (this.el) {
      this.el.style.zIndex = 1;
      this.el = undefined;
    }
    this.selected = undefined;
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
      this.uAts = [];
    };
    if (id == this.defend?.id) {
      this.defend = undefined;
      this.uDefs = [];
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
  /** Déterminer la compagnie qui va se battre */
  actionBaston(event: Event, c: CompagnieI, l: string = 'ACT_CAC') {
    if (this.attaque && this.attaque.id == c.id) {
      this.attaque = undefined;
      this.uAts = [];
      this.cacheActions();
    } else {
      this.attaque = c;
      this.uAts = this.d.docs.unites.filter((u: UniteI) => this.attaque?.unites.includes(u.id));
      this.tabActions = true;
      this.action = l; // La traduction de l'action, permet de connaître son type
    }
  }
  /** Déterminer la compagnie qui défend */
  actionDefend(c: CompagnieI) {
    if (this.defend && this.defend.id == c.id) {
      this.defend = undefined;
      this.uDefs = [];
      this.cacheActions();
    } else {
      this.defend = c;
      this.uDefs = this.d.docs.unites.filter((u: UniteI) => this.defend?.unites.includes(u.id));
      this.tabActions = true;
    }
  }
  /** Afficher les infos sur la compagnie */
  actionRallie(c: CompagnieI) {
    this.action = 'ACT_RALLIE';
    if (c.moral > 0) {
      this.l.message('ER_MORAL');
    } else if (c.commandant && this.d.docs.unites.find((u: UniteI) => u.id == c.commandant)) {
      const commandant = this.d.docs.unites.find((u: UniteI) => u.id == c.commandant);
      const jet = this.jetAttaque(commandant.cmd);
      console.log(jet);
      if (jet >= 12) c.moral = 2; // Moral remonte de 2
    }
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
    let ml = this.moralPipe.transform(this.attaque!.moral); // Bonus de moral de la compagnie
    // let cmd = this.cmdPipe.transform(this.d.docs.unite.filter((u:UniteI) => u.id == this.attaque?.commandant).xp); // Bonus du commandant

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

    this.uAts.forEach((u: UniteI, i: number) => {
      console.log("Unité", u);
      // L'attaquant peuplé des données utiles
      let uAt = this.d.setUnite(u);
      let bonusAt = ml + uAt.xp + this.getBonusOrdre(act);
      let impact = this.getImpact(uAt, act);

      console.log("Bonus At", bonusAt, "Bonus moral", ml, "Attaquant", uAt, "Bonus ordres", this.getBonusOrdre(act));



      // Défenseur choisi au hasard et peuplé des données utiles
      let uDef = this.d.setUnite(this.uDefs[Math.round(Math.random() * (this.uDefs.length - 1))]);

      let def = uDef.race.baseArmure
        + uDef.armure.bonus
        + uDef.bouclier.bonus
        + this.getBonusOrdre('def');

      for (let n = 0; n < impact; ++n) {
        let at = this.jetAttaque(bonusAt); // Calculer le bonus de combat
        if (at > def) {
          let dg = Math.ceil(Math.random() * (uAt[act].degats.max - uAt[act].degats.min)) + uAt[act].degats.min;
          u.xp += dg;
          uDef.pv -= dg;
          console.log("XP unité", u.xp, "Dégats", dg, "Def", uDef, "Pv def", uDef.pv);
        } else {
          console.log("Attaque ratée");
        }
        console.log("Attaque", at, "Défense", def);
      }
    });

    this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
  }
  /** Jet de moral : malus = 1 / 5% des pertes*/
  jetMoral(malus: number): boolean {
    let result = malus + Math.ceil(Math.random() * 20);
    return result >= 15
  }
  /** Jet d'attaque : */
  jetAttaque(bonus: number) {
    return bonus + Math.ceil(Math.random() * 20);
  }
  /** Dégats calculés en fonction de l'arme */
  jetDegats(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min)) + min;
  }
  /**  */
  getBonusOrdre(condition: string) {
    return this.ordre && this.ordre.effets.type == condition ? this.ordre.effets.bonus : 0;
  }
  /** OBSOLETE Calculer un malus de sané */
  getBonusSante(pvMax: number, pv: number): number {
    const pct = pv * 100 / pvMax;
    console.log(pct);
    return 0;
  }
  /** Calculer le nombre d'attaques à effectuer */
  getImpact(plein: any, attaque: string = 'cac') {
    let impact = 0;
    if (plein.impact) impact += impact;
    if (plein.monture?.impact) impact += plein.monture.impact;
    if (attaque == 'cac' && plein.cac?.impact) impact += plein.arme.impact;
    if (attaque == 'jet' && plein.jet?.impact) impact += plein.jet.impact;
    if (attaque == 'sort' && plein.sort?.impact) impact += plein.sort.impact;

    return impact;
  }
}
