import { Pipe, PipeTransform, inject } from '@angular/core';
import { ArmeeI, CompagnieI, UniteI, ArmeI } from '../modeles/Type';
import { DonneesService } from '../services/donnees.service';

/** Récupérer les PJ ou les archétypes (type = true) */
@Pipe({
  name: 'pj',
  standalone: true
})
export class PjPipe implements PipeTransform {
  /**
   * Filtrer les unités pour lister les PJ ou les archétypes
   * @param unites La liste des unités
   * @param type pj ou archétype ?
   * @returns
   */
  transform(unites: Array<UniteI>, type: boolean = false): Array<UniteI> {
    if (!unites) return [];
    return !type ? unites.filter(u => u.pj == true) : unites.filter(u => u.archetype == true);
  }
}
/** Afficher le statut des unités et compagnies avec des images */
@Pipe({
  name: 'statuts',
  standalone: true
})
export class StatutsPipe implements PipeTransform {

  transform(statut: number): string {
    let img = 'assets/images/pictos/';
    if (statut >= 1)
      img += "statut-actif.png";
    else if (statut == 0)
      img += "statut-attente.png";
    else if (statut == -1)
      img += "statut-alite.png";
    else if (statut == -2)
      img += "statut-inactif.png";
    return img;
  }
}
/** Bonus en fonction des points d'expérience */
@Pipe({
  name: 'xp',
  standalone: true
})
export class BonusXpPipe implements PipeTransform {
  transform(xp: number): number {
    if (!xp || xp <= 30) {
      return 0;
    } else if (xp <= 75) {
      return 2;
    } else if (xp <= 120) {
      return 3;
    } else if (xp <= 165) {
      return 4;
    } else if (xp <= 210) {
      return 5;
    } else {
      return 6;
    }
  }
}
/** Bonus d'expérience du commandement */
@Pipe({
  name: 'cmd',
  standalone: true
})
export class BonusCmdPipe implements PipeTransform {
  transform(cmd: number): number {
    if (!cmd || cmd <= 5) {
      return 0;
    } else if (cmd <= 10) {
      return 2;
    } else if (cmd <= 15) {
      return 3;
    } else if (cmd <= 20) {
      return 4;
    } else if (cmd <= 25) {
      return 5;
    } else {
      return 6;
    }
  }
}
/** Bonus d'expérience du commandement */
@Pipe({
  name: 'moral',
  standalone: true
})
export class BonusMoralPipe implements PipeTransform {
  transform(moral: number): number {
    if (!moral || moral == 6) {
      return 0;
    } else if (moral == 5 || moral == 4) {
      return -1;
    } else if (moral == 3 || moral == 2) {
      return -2;
    } else {
      return -3;
    }
  }
}
/** Malus de distance */
@Pipe({
  name: 'jet',
  standalone: true
})
export class MalusJetPipe implements PipeTransform {
  transform(min: number, max: number, dist: number): number {
    if (dist <= min) {
      return 1;
    } else if (dist <= max) {
      return 1 - (dist / (max - min));
    } else {
      return 0;
    }

  }
}

/** Malus de blessure en fonction du nombre de points de vie de l'unité */
@Pipe({
  name: 'blessure',
  standalone: true
})
export class BlessurePipe implements PipeTransform {
  transform(unite: UniteI): number {
    if (unite.pv <= 0) {
      return -2; // Mort
    } else if (unite.pv <= unite.pvMax * 0.2) {
      return -1; // Alité
    } else if (unite.pv <= unite.pvMax * 0.5) {
      return 0; // Blessure grave
    } else if (unite.pv <= unite.pvMax * 0.8) {
      return 1; // Blessure légère
    } else {
      return 2; // En forme
    }
  }
}
/** Déterminer l'état des unités après chaque combat */
@Pipe({
  name: 'etats',
  standalone: true
})
export class EtatsUnitesPipe implements PipeTransform {

  d: DonneesService = inject(DonneesService);

  transform(unites: Array<number>): {pv:number, etats:{ combattants: number, legers: number, graves: number, alites: number, morts: number }}{
    let etats = { combattants: 0, legers: 0, graves: 0, alites: 0, morts: 0 };
    let pv = 0; // Cumul des points de vie
    let u: UniteI;

    for (let i of unites) {
      u = this.d.docs.unites.find((unite: UniteI) => unite.id == i);

      if (u.pv <= 0) {
        u.etat = -2; // Mort
        ++etats.morts;
      } else if (u.pv <= u.pvMax * 0.2) {
        u.etat = -1; // Alité
        ++etats.alites;
      } else if (u.pv <= u.pvMax * 0.5) {
        u.etat = 0; // Bléssé grave
        ++etats.graves;
      } else if (u.pv <= u.pvMax * 0.8) {
        u.etat = 1; // Blessé léger
        ++etats.legers;
      } else {
        u.etat = 2;
      }
      pv += u.pv;
    };

    etats.combattants = unites.length - etats.alites - etats.morts;
    return {pv, etats};
  }
}
/** Filter es armées */
@Pipe({
  name: 'unite',
  standalone: true
})
export class UnitePipe implements PipeTransform {

  private d: DonneesService = inject(DonneesService);

  transform(id: number): UniteI {
    return this.d.docs.unites.find((u: UniteI) => u.id == id);
  }
}
/** Filter es armées */
@Pipe({
  name: 'triArmees',
  standalone: true
})
export class ArmeesPipe implements PipeTransform {

  transform(armees: Array<ArmeeI>, libre: string): Array<ArmeeI> {
    if (!armees) return [];
    if (!libre || libre.length < 2) return armees;
    return armees.filter(a => a.nom.toLocaleLowerCase().indexOf(libre.toLocaleLowerCase()) != -1);
  }
}
/** Filtrer les compagnies */
@Pipe({
  name: 'triCompagnies',
  standalone: true
})
export class CompagniesPipe implements PipeTransform {

  transform(compagnies: Array<CompagnieI>, libre: string): Array<CompagnieI> {
    if (!compagnies) return [];
    if (!libre || libre.length < 2) return compagnies;
    return compagnies.filter(c => c.nom.toLocaleLowerCase().indexOf(libre.toLowerCase()) != -1);
  }
}

/** FIltrer les unites */
@Pipe({
  name: 'triUnites',
  standalone: true
})
export class UnitesPipe implements PipeTransform {

  transform(unites: Array<UniteI>, libre: string, pj: any = 'null', archetype: any = 'null', etat: any = 'null'): Array<UniteI> {
    if (!unites) return [];
    if ((libre.length < 3 && isNaN(parseInt(libre))) && (pj == 'null' && archetype == 'null' && etat == 'null')) return unites;

    return unites.filter(u =>
      ((libre.length > 2 && JSON.stringify(u).toLowerCase().indexOf(libre.toLowerCase()) != -1))
      || parseInt(libre) == u.id
      || (pj != 'null' && u.pj == JSON.parse(pj))
      || (archetype != 'null' && u.archetype == JSON.parse(archetype))
      || (etat != 'null' && u.etat == parseInt(etat)));
  }
}
/** Récupérer une liste d'unités à partir de leurs ids */
@Pipe({
  name: 'unitesArray',
  standalone: true
})
export class UnitesArrayPipe implements PipeTransform {

  transform(unitesIds: Array<number>, unites: Array<UniteI>): Array<UniteI> {
    if (!unites) return [];
    if (!unitesIds) return unites;
    return unites.filter((u: UniteI) => unitesIds.includes(u.id));
  }
}
/** Récupérer une liste de compagnies à partir des ids */
@Pipe({
  name: 'compagniesArray',
  standalone: true
})
export class CompagniesArrayPipe implements PipeTransform {

  transform(cIds: Array<number>, comps: Array<CompagnieI>): Array<CompagnieI> {
    if (!comps) return [];
    if (!cIds) return comps;
    return comps.filter((c: CompagnieI) => cIds.includes(c.id));
  }
}
/** Filtrer les armes et autres matériels */
@Pipe({
  name: 'armes',
  standalone: true
})
export class ArmesPipe implements PipeTransform {

  transform(arme: { type: number, q: number } | undefined, armes: Array<ArmeI>): string {
    if (!arme) return '';
    if (!armes) return '';
    const mun = armes.find((m: ArmeI) => m.id == arme.type)
    return mun ? mun.nom : '';
  }
}
/** Parser une valeur en booléen */
@Pipe({
  name: 'bool',
  standalone: true
})
export class BoolPipe implements PipeTransform {
  transform(val: any): string {
    return JSON.parse(val);
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'int',
  standalone: true
})
export class IntPipe implements PipeTransform {
  transform(val: any): number {
    return parseInt(val);
  }
}
