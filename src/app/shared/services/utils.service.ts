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

      this.sendFiles("Coucou");
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
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
    // window['ipcRend'].on('doctor', (event:IpcRendererEvent, arg:any) => {
    //   console.log(arg);
    // });
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
    }
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
    console.log("Maj obj", obj);
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
