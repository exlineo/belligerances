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

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.getLangue();
  }
  getLangue() {
    this.http.get(`assets/data/${this.langue}/lang.json`).subscribe({
      next: data => {
        this.t = data;
        this.message('MSG_LANG');
      },
      error: () => this.message('ER_LANG'),
      complete: () => console.log('Langue chargée')
    }
    )
  }
  message(msg:string){
    this._snackBar.open(this.t[msg], 'OK', {duration: 3000});
    console.log(this.t[msg]);
  }
}
