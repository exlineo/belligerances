import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tris',
  standalone: true
})
export class TrisPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
@Pipe({
  name: 'statuts',
  standalone: true
})
export class StatutsPipe implements PipeTransform {

  transform(statut: number): string {
    let img = 'assets/images/pictos/';
    if (statut == 1)
      img += "statut-actif.png";
    else if (statut == 0)
      img += "statut-attente.png";
    else if (statut == -1)
      img += "statut-inactif.png";
    return img;
  }

}
