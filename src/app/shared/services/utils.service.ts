import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';
// import { fs } from 'file-system';
import * as fs from 'fs';

import {
  MatSnackBar
} from '@angular/material/snack-bar';

declare global {
  interface Window {
    ipcRend: IpcRenderer;
  }
}
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  t: any;
  langue: string = 'fr';

  ipc!: IpcRenderer;
  fs!: typeof fs;

  edit: any; // Variable indiquant quel élément éditer
  maj: any; // Objet à éditer
  suppr: boolean = false; // Suppression d'une ressource
  save: boolean = false; // Indiquer s'il faut sauvegarder les données

  localPath: string = '';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.getLangue();
    if (this.isElectron) {
      this.ipc = (window as any).require('electron').ipcRenderer;
      this.fs = (window as any).require('fs');

      this.sendFiles("Fichier transmis");
      this.ipc.on('ecoute', (event: IpcRendererEvent, arg: any) => {
        console.log(arg);
      });
      this.ipc.on('ecoute', (event: IpcRendererEvent, arg: any) => {
        console.log(arg);
      });

      this.ipc.on('start', (event: IpcRendererEvent, arg: any) => {
        console.log('Application électron démarrée', arg);
        this.localPath = arg;
      });
    }
    // window['ipcRend'].on('doctor', (event:IpcRendererEvent, arg:any) => {
    //   console.log(arg);
    // });
  }
  getLangue() {
    this.http.get(`assets/data/${this.langue}/lang.json`).subscribe({
      next: data => {
        this.t = data;
        localStorage.setItem('lang', JSON.stringify(data));
      },
      error: () => this.message('ER_LANG'),
      complete: () => console.log('Langue chargée')
    }
    )
  }
  /** Informer l'utilisateur */
  message(msg: string) {
    this._snackBar.open(this.t[msg], 'OK', { duration: 3000 });
  }
  /**
   * Identifier ce qui est à éditer
   * @param edit Le type d'objet dont il s'agit > pour afficher le bon formulaire
   * @param obj L'objet à éditer (n'importe quel type, c'est le composant d'édition qui s'en occupe)
   * @param suppr S'agit-il d'une suppression ?
   */
  setEdit(edit: string, obj: any, suppr: boolean = false) {
    this.edit = edit;
    console.log("Maj obj", obj, edit);
    this.maj = { ...obj };
    this.suppr = suppr;
  }
  /** Indiquer les données à éditer */
  close() {
    this.edit = undefined;
    this.maj = undefined;
    this.suppr = false;
  }
  /** Ecrire les fichiers JSON */
  sendFiles(data: any) {
    // this.ipc.send('save', data);
    if (this.isElectron) {
      this.fs.mkdir(this.localPath + '/Joueur', { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          throw err;
        } else {
          this.fs.writeFile(this.localPath + '/Joueur/campagnes.json', JSON.stringify(data), (err: any) => {
            if (err) {
              console.error(err);
              throw err;
            } else {
              this.message('MSG_SAVE');
            }
          });
        };
      });
    }
  }
  /** Identifier le cadre d'exécution */
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
