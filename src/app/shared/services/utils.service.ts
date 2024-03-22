import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  t: any;
  langue: string = 'fr';

  edit:any; // Variable indiquant quel élément éditer
  maj:any; // Objet à éditer
  suppr:boolean = false; // Suppression d'une ressource
  save:boolean = false; // Indiquer s'il faut sauvegarder les données

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.getLangue();
  }
  getLangue() {
    if (localStorage.getItem('lang')) {
      this.t = JSON.parse(localStorage.getItem('lang')!);
    } else {
    this.http.get(`assets/data/${this.langue}/lang.json`).subscribe({
      next: data => {
        this.t = data;
        localStorage.setItem('lang', JSON.stringify(data));
      },
      error: () => this.message('ER_LANG'),
      complete: () => console.log('Langue chargée')
    }
    )
  }}
  /** Informer l'utilisateur */
  message(msg:string){
    this._snackBar.open(this.t[msg], 'OK', {duration: 3000});
  }
  /**
   * Identifier ce qui est à éditer
   * @param edit Le type d'objet dont il s'agit > pour afficher le bon formulaire
   * @param obj L'objet à éditer (n'importe quel type, c'est le composant d'édition qui s'en occupe)
   * @param suppr S'agit-il d'une suppression ?
   */
  setEdit(edit:string, obj:any, suppr:boolean = false){
    this.edit = edit;
    this.maj = {...obj};
    this.suppr = suppr;
  }
  /** Indiquer les données à éditer */
  close(){
    this.edit = undefined;
    this.maj = undefined;
    this.suppr = false;
  }
}
