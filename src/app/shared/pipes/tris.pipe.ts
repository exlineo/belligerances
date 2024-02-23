import { Pipe, PipeTransform } from '@angular/core';
import { ArmeeI, CompagnieI, UniteI } from '../modeles/Type';
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'pj',
  standalone: true
})
export class PjPipe implements PipeTransform {

  transform(unites:Array<UniteI>): Array<UniteI> {
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
    if(xp <= 30){
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
    if(cmd <= 5){
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
  name: 'armees',
  standalone: true
})
export class ArmeesPipe implements PipeTransform {

  transform(armees:Array<ArmeeI>, libre:string): Array<ArmeeI> {
    return armees.filter(a => a.nom.indexOf(libre) != -1);
  }
}
/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'triCompagnies',
  standalone: true
})
export class CompagniesPipe implements PipeTransform {

  transform(compagnies:Array<CompagnieI>, libre:string): Array<CompagnieI> {
    return compagnies.filter(c => c.nom.indexOf(libre) != -1);
  }
}

/** Filtrer les unites pour avoir la liste des PJ */
@Pipe({
  name: 'triUnites',
  standalone: true
})
export class UnitesPipe implements PipeTransform {

  transform(unites:Array<UniteI>, libre:string, race:number): Array<UniteI> {
    return unites.filter(u => u.nom.indexOf(libre) != -1 || u.race == race);
  }
}