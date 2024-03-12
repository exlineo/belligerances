import { Pipe, PipeTransform } from '@angular/core';
import { ArmeeI, CompagnieI, UniteI, ArmeI, Arme } from '../modeles/Type';
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'pj',
  standalone: true
})
export class PjPipe implements PipeTransform {

  transform(unites:Array<UniteI>): Array<UniteI> {
    if(!unites) return [];
    return unites.filter(u => u.pj == true);
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
    if (statut == 1 || statut == 2)
      img += "statut-actif.png";
    else if (statut == 0)
      img += "statut-attente.png";
    else if (statut == -1)
      img += "statut-inactif.png";
    return img;
  }
}

/** Bonus en fonction des points d'expérience */
@Pipe({
  name: 'bonusXP',
  standalone: true
})
export class BonusXpPipe implements PipeTransform {
  transform(xp: number): number {
    if(!xp || xp <= 30){
      return 0;
    }else if(xp <= 75){
      return 2;
    }else if(xp <= 120){
      return 3;
    }else if(xp <= 165){
      return 4;
    }else if(xp <= 210){
      return 5;
    }else{
      return 6;
    }
  }
}
/** Bonus d'expérience du commandement */
@Pipe({
  name: 'bonusCMD',
  standalone: true
})
export class BonusCmdPipe implements PipeTransform {
  transform(cmd: number): number {
    if(!cmd || cmd <= 5){
      return 0;
    }else if(cmd <= 10){
      return 2;
    }else if(cmd <= 15){
      return 3;
    }else if(cmd <= 20){
      return 4;
    }else if(cmd <= 25){
      return 5;
    }else{
      return 6;
    }
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'triArmees',
  standalone: true
})
export class ArmeesPipe implements PipeTransform {

  transform(armees:Array<ArmeeI>, libre:string): Array<ArmeeI> {
    if(!armees) return [];
    if(!libre || libre.length < 2) return armees;
    return armees.filter(a => a.nom.toLocaleLowerCase().indexOf(libre.toLocaleLowerCase()) != -1);
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'triCompagnies',
  standalone: true
})
export class CompagniesPipe implements PipeTransform {

  transform(compagnies:Array<CompagnieI>, libre:string): Array<CompagnieI> {
    if(!compagnies) return [];
    if(!libre || libre.length < 2) return compagnies;
    return compagnies.filter(c => c.nom.toLocaleLowerCase().indexOf(libre.toLowerCase()) != -1);
  }
}

/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'triUnites',
  standalone: true
})
export class UnitesPipe implements PipeTransform {

  transform(unites:Array<UniteI>, libre:string, race?:number, t?:boolean): Array<UniteI> {
    if(!unites) return [];
    if((!libre || libre.length < 2)) {return unites} else {libre = libre.toLowerCase()};
    return unites.filter(u => u.nom.indexOf(libre) != -1 || u.race == race);
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'tailleUnites',
  standalone: true
})
export class UnitesTaillePipe implements PipeTransform {

  transform(unites:Array<UniteI>, libre:string, race?:number, t?:boolean): number {
    if(!unites) return 0;
    if((!libre || libre.length < 2)) {return unites.length} else {libre = libre.toLowerCase()};
    return unites.filter(u => u.nom.indexOf(libre) != -1 || u.race == race).length;
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'unitesArray',
  standalone: true
})
export class UnitesArrayPipe implements PipeTransform {

  transform(unitesIds:Array<number>, unites:Array<UniteI>): Array<UniteI> {
    if(!unites) return [];
    if(!unitesIds) return unites;
    return unites.filter( (u:UniteI) => unitesIds.includes(u.id));
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'armes',
  standalone: true
})
export class ArmesPipe implements PipeTransform {

  transform(arme:{type:number, q:number} | undefined, armes:Array<ArmeI>): string {
    if(!arme) return '';
    if(!armes) return '';
    const mun = armes.find( (m:ArmeI) => m.id == arme.type)
    return mun ? mun.nom : '';
  }
}
