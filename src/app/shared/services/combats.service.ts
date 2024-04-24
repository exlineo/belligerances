import { Injectable, inject } from '@angular/core';
import { ArmeI, CompagnieI, OrdreI, UniteI } from '../modeles/Type';
import { UtilsService } from './utils.service';
import { BlessurePipe, BonusCmdPipe, BonusMoralPipe, BonusXpPipe, MalusJetPipe } from '../pipes/tris.pipe';
import { DonneesService } from './donnees.service';

@Injectable({
  providedIn: 'root'
})
export class CombatsService {

  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

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

  officierAt: UniteI | undefined; // Officier attaquant
  officierDef: UniteI | undefined; // Officier défenseur

  ordre?: OrdreI; // Ordre en cours

  // Pipes pour les combats
  xpPipe: BonusXpPipe = new BonusXpPipe();
  cmdPipe: BonusCmdPipe = new BonusCmdPipe();
  moralPipe: BonusMoralPipe = new BonusMoralPipe();
  jetPipe: MalusJetPipe = new MalusJetPipe();
  blessurePipe: BlessurePipe = new BlessurePipe();

  bg: string = ''; // Arrière plan de la bataille

  constructor() { }

  /** Combat de compagnies */
  combatCompagnies() {
    if (this.attaque&& this.attaque.moral <= 0) {
      this.l.message('MSG_DEMORAL');
    } else {
      let ml = this.moralPipe.transform(this.attaque!.moral); // Bonus de moral de la compagnie
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
        // L'attaquant peuplé des données utiles
        let uAt = this.d.setUnite(u);
        let bonusAt = ml + uAt.xp + this.getBonusOrdre(this.attaque!, act); // Bonus de l'attaquant
        let impact = this.getImpact(uAt, act);
        // Défenseur choisi au hasard et peuplé des données utiles
        let uDef = this.d.setUnite(this.uDefs[Math.round(Math.random() * (this.uDefs.length - 1))]);

        let def = uDef.race.baseArmure
          + uDef.armure.bonus
          + uDef.bouclier.bonus
          + this.getBonusOrdre(this.defend!, 'def');

        for (let n = 0; n < impact; ++n) {
          let at = this.jetAttaque(bonusAt); // Calculer le bonus de combat
          if (at >= def) {
            let dg = this.dgCac(uAt[act]);
            // Ajouter le bonus d'ordre si utile
            if(this.attaque?.ordre && this.attaque?.ordre.effets && this.attaque.ordre.effets.type == 'degats') dg += this.attaque.ordre.effets.bonus;
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
      this.jetMoral();
      this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
    }
  }
  /** Les chefs se bagarrent */
  combatChefs() {
    let atAt = 0;
    let atDef = 0;
    const at = this.d.setUnite(this.officierAt!);
    const def = this.d.setUnite(this.officierDef!)
    const atImpact = this.getImpact(at);
    const defImpact = this.getImpact(def);
    let dg = 0;
    this.attaque= this.defend = undefined;
    console.log("Combat des chefs", this.officierAt, this.officierDef, atImpact, defImpact);
    console.log(!this.officierAt || !this.officierAt!.cmd, !this.officierDef || !this.officierDef!.cmd);
    // Vérifier d'abord si les officiers peuvent bien participer
    if (!this.officierAt || !this.officierAt!.cmd) {
      this.l.message('MSG_CMD_AT');
      return;
    }else if (!this.officierDef || !this.officierDef!.cmd) {
      this.l.message('MSG_CMD_DEF');
      return
    };
    // Gérer les attaques
    for (let i = 0; i < 4; ++i) {
      // Attaque chacun son tour en fonction de l'impact de chacun
      if (i % 2 == 0) {
        for (let m = 0; m < atImpact; ++m) {
          if (atAt >= atDef) {
            dg = this.dgCac(at.cac);
            this.officierDef.pv -= dg;
            this.officierAt.xp += dg;
            this.morts += dg;
            console.log("At", atAt,"Def", atDef, "Dégats attaquant", dg);
          }
        }
      } else {
        for (let n = 0; n < defImpact; ++n) {
          atAt = this.jetAttaque(this.officierAt!.cmd!);
          atDef = this.jetAttaque(this.officierDef!.cmd);
          if (atDef >= atAt) {
            dg = this.dgCac(def.cac);
            this.officierAt.pv -= dg;
            this.officierDef.xp += dg;
            this.blesses += dg;
            console.log("At", atAt,"Def", atDef, "Dégats défenseur", dg);
          }
        }
      }
    }
  }
  /** Calculer les dégats en fonction de l'arme de corps à corps */
  dgCac(arme: ArmeI) {
    return Math.round(Math.random() * (arme.degats!.max - arme.degats!.min)) + arme.degats!.min;
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

      const result = Math.ceil(Math.random() * 20);
      if (result >= 12 + malus) {
        this.defend!.moral -= 1;
        this.l.message('MSG_MORAL_LOOSE');
      } else {
        this.l.message('MSG_MORAL_OK')
      }
    }
  }
  /** Jet d'attaque : */
  jetAttaque(bonus: number) {
    return bonus + Math.ceil(Math.random() * 20);
  }
  /**  */
  getBonusOrdre(comp:CompagnieI, condition: string) {
    console.log("Obtenir un bonus d'ordre", comp);
    return comp.ordre && comp.ordre.effets && comp.ordre.effets.type == condition ? comp.ordre.effets.bonus : 0;
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
}
