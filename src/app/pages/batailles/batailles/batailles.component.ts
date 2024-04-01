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
      transition('ouvre => ferme', [
        animate('.3s ease')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease')
      ]),
    ]),
    trigger('tabLeve', [
      state('leve', style({ top: -250 })),
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
  distance: number = 0;
  infos: boolean = false;
  indexAttaquant: number = -1; // Index de la compagnie qui attaque
  el: any; // Element sélectionné
  blesses: number = 0;
  morts: number = 0;
  moral: number = 0;

  // Pipes pour les combats
  xpPipe: BonusXpPipe = new BonusXpPipe();
  cmdPipe: BonusCmdPipe = new BonusCmdPipe();
  moralPipe: BonusMoralPipe = new BonusMoralPipe();
  jetPipe: MalusJetPipe = new MalusJetPipe();
  blessurePipe: BlessurePipe = new BlessurePipe();

  ordre?: OrdreI; // Ordre en cours

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
    this.selected = c;
    this.indexAttaquant = i;
    this.infos = false;
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
  matDistance(event: any) {
    this.distance = event.target.value;
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
    this.infos = true;
    console.log(this.infos, this.selected, c);
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
      // Réunitialiser les états des blessés et des morts
      this.blesses = 0;
      this.morts = 0;
    }
  }
  /** Afficher les infos sur la compagnie */
  actionRallie(c: CompagnieI) {
    this.action = 'ACT_RALLIE';
    if (c.moral > 0) {
      this.l.message('ER_MORAL');
    } else if (c.commandant && this.d.docs.unites.find((u: UniteI) => u.id == c.commandant)) {
      const commandant = this.d.docs.unites.find((u: UniteI) => u.id == c.commandant);
      const jet = this.jetAttaque(commandant.cmd); // Prendre en compte les pertes dans la compagnie et l'absence de général ou de commandant comme variable
      console.log(jet);
      if (jet >= 12) {
        c.moral = 2;
        this.l.message('MSG_MORAL_GAIN');
      } else {
        this.l.message('MSG_MORAL_NULL');
      } // Moral remonte de 2
    }
  }
  /** Cacher la fenêtre des actions */
  cacheActions() {
    !this.attaque && !this.defend ? this.tabActions = false : this.tabActions = true;
    this.action = 'ACT';
  }
  /** Agir */
  goCombat() {
    if (this.attaque && this.attaque.moral <= 0) {
      this.l.message('MSG_DEMORAL');
    } else {
      this.blesses = 0;
      this.morts = 0;
      let ml = this.moralPipe.transform(this.attaque!.moral); // Bonus de moral de la compagnie
      // let cmd = this.cmdPipe.transform(this.d.docs.unite.filter((u:UniteI) => u.id == this.attaque?.commandant).xp); // Bonus du commandant
      let act: string = 'cac';
      console.log("Act", this.action.slice(4, this.action.length).toLocaleLowerCase());
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
        // L'attaquant peuplé des données utiles
        let uAt = this.d.setUnite(u);
        let bonusAt = ml + uAt.xp + this.getBonusOrdre(act); // Bonus de l'attaquant
        let impact = this.getImpact(uAt, act);
        // Défenseur choisi au hasard et peuplé des données utiles
        let uDef = this.d.setUnite(this.uDefs[Math.round(Math.random() * (this.uDefs.length - 1))]);

        let def = uDef.race.baseArmure
          + uDef.armure.bonus
          + uDef.bouclier.bonus
          + this.getBonusOrdre('def');

        for (let n = 0; n < impact; ++n) {
          let at = this.jetAttaque(bonusAt); // Calculer le bonus de combat
          if (at >= def) {
            let dg = Math.round(Math.random() * (uAt[act].degats.max - uAt[act].degats.min)) + uAt[act].degats.min;
            // Si c'est un jet ou un sort, on calcul les dégats relativement à la distance
            if (act == 'jet' || act == 'sort') {
              dg = Math.round(dg * this.jetPipe.transform(uAt[act].portee.min, uAt[act].portee.max, this.distance));
            }
            u.xp += dg; // L'attaquant gagne de l'expérience
            uDef.unite.pv - dg < 0 ? uDef.unite.pv = 0 : uDef.unite.pv -= dg; // Appliquer les dégâts à l'unité qui défend
          }
          ++this.blesses; // Marquer le nouveau blessé
          if (uDef.pv <= 0) ++this.morts;
        }
      });
      // Calculer les morts et les blessés de la compagnie
      this.calculeBlesses();
      this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
    }
  }
  /** Calculer le nombre de morts et de blessés dans une compagnie */
  calculeBlesses() {
    this.defend!.blesses = this.defend!.morts = 0;
    let pv = 0; // Calculer les points de vie globaux de la compagnie
    this.uDefs.forEach((u: any) => {
      if (u.pv && u.pv <= 0) {
        ++this.defend!.morts!;
      } else if (u.pvMax > u.pv && u.pv >= 0) {
        ++this.defend!.blesses!;
      };
      pv += u.pv;
      // Etablir l'état de l'unité en fonction de ses blessures
      u.etat = this.blessurePipe.transform(u);
    });
    this.defend!.pv = pv;
    console.log("Calcul des blessés", this.defend, this.uDefs);
  }
  /** Jet de moral : malus = 1 / 5% des pertes*/
  jetMoral() {
    if ((this.blesses > 0 || this.morts > 0) && this.defend?.morts! > this.defend!.unites.length / 20) {
      let malus = Math.ceil(20 * this.defend?.morts! / this.defend!.unites.length); // Ne fois 5% de morts
      const armee = this.d.docs.armees.find(this.defend!.armee);

      const general = this.d.getCompagniesUnites('unites', armee.commandant);
      if (general.pv <= 0) malus += 5;

      const commandant = this.d.getCompagniesUnites('unites', this.defend!.commandant);
      if (commandant.pv <= 0) malus += 3;

      const result = malus + Math.ceil(Math.random() * 20);
      if (result >= 12) {
        this.defend!.moral -= 1;
        this.l.message('MSG_MORAL_LOOSE');
      }else{
        this.l.message('MSG_MORAL_OK')
      }
    }
  }
  /** Jet d'attaque : */
  jetAttaque(bonus: number) {
    return bonus + Math.ceil(Math.random() * 20);
  }
  /**  */
  getBonusOrdre(condition: string) {
    return this.ordre && this.ordre.effets.type == condition ? this.ordre.effets.bonus : 0;
  }
  /** Calculer le nombre d'attaques à effectuer
   * @param plein unité avec toutes ses valeurs
  */
  getImpact(plein: any, attaque: string = 'cac') {
    let impact = 0;
    if (plein.impact) impact += impact;
    if (plein.monture?.impact) impact += plein.monture.impact;
    if (attaque == 'cac' && plein.cac?.impact) impact += plein.arme.impact;
    if (attaque == 'jet' && plein.jet?.impact) impact += plein.jet.impact;
    if (attaque == 'sort' && plein.sort?.impact) impact += plein.sort.impact;

    return impact;
  }
  /** Pagination */
  setPagination(event: PageEvent) {
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = { min, max };
  }
}
