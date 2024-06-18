import { Injectable, inject } from '@angular/core';
import { ArmeI, CompagnieI, OrdreI, UniteI } from '../modeles/Type';
import { UtilsService } from './utils.service';
import { BlessurePipe, BonusCmdPipe, BonusMoralPipe, BonusXpPipe, EtatsUnitesPipe, MalusJetPipe } from '../pipes/tris.pipe';
import { DonneesService } from './donnees.service';

@Injectable({
  providedIn: 'root'
})
export class CombatsService {

  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);

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
  blessures: { at: number, def: number } = { at: 0, def: 0 }; // Blessures des officiers

  officierAt: UniteI | undefined; // Officier attaquant
  officierDef: UniteI | undefined; // Officier défenseur

  ordre?: OrdreI; // Ordre en cours

  // Pipes pour les combats
  xpPipe: BonusXpPipe = new BonusXpPipe();
  cmdPipe: BonusCmdPipe = new BonusCmdPipe();
  moralPipe: BonusMoralPipe = new BonusMoralPipe();
  jetPipe: MalusJetPipe = new MalusJetPipe();
  blessurePipe: BlessurePipe = new BlessurePipe();
  etatsUnitesPipe: EtatsUnitesPipe = new EtatsUnitesPipe();

  bg: string = ''; // Arrière plan de la bataille

  constructor() { }

  /** Combat de compagnies */
  combatCompagnies() {
    if (this.attaque && this.attaque.moral <= 0) {
      this.l.message('MSG_DEMORAL');
    } else if (this.attaque!.statut == -3) {
      this.l.message('MSG_MORAL_NUL');
    } else if (this.defend!.etats.morts! >= this.defend!.unites.length) { // Ajouter alités
      this.l.message('MSG_MORTS');
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
        if ((this.action == 'ACT_JET' || this.action == 'ACT_SORT') && this.attaque!.munitions!.q <= 0) {
          this.l.message('MUNS_NULL');
        } else {
          // L'attaquant peuplé des données utiles
          let uAt = this.d.setUnite(u);
          // let bonusAt = ml + uAt.xp + this.getBonusOrdre(this.attaque!, act); // Bonus de l'attaquant
          let bonusAt = this.setBonusAt(ml, uAt.xp, u.etat, this.attaque!, act); // Calcul du bonus d'attaque
          let impact = this.getImpact(uAt, act); // Calcul du nombre d'attaques
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
              if (this.attaque?.ordre && this.attaque?.ordre.effets && this.attaque.ordre.effets.type == 'degats') dg += this.attaque.ordre.effets.bonus;
              // Si c'est un jet ou un sort, on calcul les dégats relativement à la distance
              if (act == 'jet' || act == 'sort') {
                dg = Math.round(dg * this.jetPipe.transform(uAt[act].portee.min, uAt[act].portee.max, this.distance));
                --this.attaque!.munitions!.q; // Diminuer le nombre de munitions de la compagnie à chaque tir
              }
              u.xp += dg; // L'attaquant gagne de l'expérience
              uDef.unite.pv - dg < 0 ? uDef.unite.pv = 0 : uDef.unite.pv -= dg; // Appliquer les dégâts à l'unité qui défend
            }
          }
        }
      });

      // Calculer l'état des unites
      const tmp = this.etatsUnitesPipe.transform(this.defend!.unites);
      this.defend!.pv = tmp.pv;
      this.defend!.etats = tmp.etats;
      // Calculer les morts et les blessés de la compagnie
      this.jetMoral();
      // Vérifier si la compagnie est démoralisée
      this.setDesorganise(this.defend!.commandant);
      this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
    }
  }
  /** Les chefs se bagarrent */
  combatChefs() {
    let atAt = 0;
    let atDef = 0;
    const at = this.d.setUnite(this.officierAt!); // Commandant attaquant
    const def = this.d.setUnite(this.officierDef!) // Commandant défendant
    const atImpact = this.getImpact(at); // Impact attaquant
    const defImpact = this.getImpact(def); // Impact défenseur
    let dg = 0;
    this.attaque = this.defend = undefined;
    // Vérifier d'abord si les officiers peuvent bien participer
    if (!this.officierAt || !this.officierAt!.cmd) {
      this.l.message('MSG_CMD_AT');
    } else if (!this.officierDef || !this.officierDef!.cmd) {
      this.l.message('MSG_CMD_DEF');
    } else if(this.officierDef!.pv <= 0 || this.officierAt!.pv <= 0){
      this.l.message('MSG_CMD_MORT');
    } else {
      // Gérer les attaques
      for (let i = 0; i < 4; ++i) {
        // Attaque chacun son tour en fonction de l'impact de chacun
        if (i % 2 == 0) {
          if (this.officierAt.pv > 0) {
            for (let m = 0; m < atImpact; ++m) { // Boucle dans la valeur d'impact, une attaque par point
              atAt = this.jetAttaque(this.officierAt!.cmd!);
              atDef = this.jetAttaque(this.officierDef!.cmd);
              if (atAt > atDef) {
                dg = this.dgCac(at.cac);
                this.officierDef.pv - dg < 0 ? this.officierDef.pv = 0 : this.officierDef.pv -= dg;
                this.officierAt.xp += dg;
                this.blessures.def += dg; // On utilise la valeur de 'morts' pour calculer les dégats que subit l'officier
                this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
              }
            }
          } else {
            this.l.message('MSG_OFF_MORT');
          }
        } else {
          if (this.officierDef.pv > 0) {
            for (let n = 0; n < defImpact; ++n) {
              atAt = this.jetAttaque(this.officierAt!.cmd!);
              atDef = this.jetAttaque(this.officierDef!.cmd);
              if (atDef > atAt) {
                dg = this.dgCac(def.cac);
                this.officierAt.pv - dg < 0 ? this.officierAt.pv = 0 : this.officierAt.pv -= dg;
                this.officierDef.xp += dg;
                this.blessures.at += dg; // On utilise la valeur de 'blesses' pour calculer les dégats que subit l'officier
                this.d.etatSave = true; // Afficher la sauvegarde pour acter le combat et l'état des troupes
              }
            }
          } else {
            this.l.message('MSG_OFF_MORT');
          }
        }

        // Vérifier si la compagnie est démoralisée
        this.setDesorganise(this.officierDef.id);
      }
    }
  }
  /** Calculer les dégats en fonction de l'arme de corps à corps */
  dgCac(arme: ArmeI) {
    return Math.round(Math.random() * (arme.degats!.max - arme.degats!.min)) + arme.degats!.min;
  }
  /** Jet de moral : malus = 1 / 5% des pertes*/
  jetMoral() {
    if (this.defend!.moral > 0) {
      if (this.defend!.etats.morts > this.defend!.unites.length / 20) {
        let malus = Math.ceil(20 * this.defend!.etats.morts / this.defend!.unites.length); // N fois 5% de morts
        let armee = this.d.docs.armees.find((ar: ArmeI) => ar.id == this.defend!.armee);

        let general = this.d.getCompagniesUnites('unites', armee.commandant);
        if (general.pv <= 0) malus += 5;

        let commandant = this.d.getCompagniesUnites('unites', this.defend!.commandant);
        if (commandant.pv <= 0) malus += 3;

        let result = Math.ceil(Math.random() * 20);
        if (result >= 12 - malus) {
          this.defend!.moral -= 1; // Diminution du moral lorsque ça va plus
          this.l.message('MSG_MORAL_LOOSE');
        } else {
          this.l.message('MSG_MORAL_OK')
        }
      }
    } else {
      this.l.message('MSG_MORAL_NUL');
    }
  }
  /** Jet d'attaque : */
  jetAttaque(bonus: number) {
    return bonus + Math.ceil(Math.random() * 20);
  }
  /**  */
  getBonusOrdre(comp: CompagnieI, condition: string) {
    return comp.ordre && comp.ordre.effets && comp.ordre.effets.type == condition ? comp.ordre.effets.bonus : 0;
  }
  /** Calculer le nombre d'attaques à effectuer
   * @param plein unité avec toutes ses valeurs
  */
  getImpact(plein: any, attaque: string = 'cac') {
    let impact = 1;
    if (plein.impact) impact += impact;
    if (plein.monture?.impact) impact += plein.monture.impact;
    if (attaque == 'cac' && plein.cac?.impact) impact += plein.arme.impact;
    if (attaque == 'jet' && plein.jet?.impact) impact += plein.jet.impact;
    if (attaque == 'sort' && plein.sort?.impact) impact += plein.sort.impact;

    return impact > 0 ? impact : 0;
  }
  /** Donner un bonus à une attaque en fonction des critères */
  setBonusAt(moral: number, xp: number, etat: number, c: CompagnieI, action: string) {
    let bonus = moral + xp + this.getBonusOrdre(c, action);
    if (etat == 1) --bonus
    else if (etat == 0) bonus -= 2;

    return bonus;
  }
  /** Statut désorganisé
   * @param uId Identifiant de l'officier concerné par l'attaque
   * @param comp Compagnie s'il y a lieu
  */
  setDesorganise(uId:number) {
      let officier = this.d.docs.unites.find((u: UniteI) => u.id == uId);
      let comp = this.d.docs.compagnies.find((c:CompagnieI) => c.commandant == uId);

      if (officier.pv <= 0) {
        comp.statut = -3;
        comp.ordre = this.d.ordres.find((o: OrdreI) => o.ordre = "Sans officier");
        this.l.message('MSG_DESOR');
      } else if (officier.pv <= officier.pvMax * 0.2 || comp.moral <= 0) {
        comp.statut = -3;
        this.l.message('MSG_DESOR');
      }

  }
}
