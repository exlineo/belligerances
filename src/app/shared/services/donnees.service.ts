import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {

  armes: Array<{ cac: Array<string>, distance: Array<string> }> = [];
  armures: Array<string> = [];
  creatures: Array<string> = [];
  races: Array<string> = [];
  betes: Array<string> = [];


  armees: Array<any> = [];
  compagnies: Array<any> = [];
  unites: Array<string> = [];

  constructor(private http: HttpClient) {
    this.getArmes();
  }
  /** DONNEES LOCALES */
  getLocal(id: string) {
    if (localStorage.getItem(id)) {
      let obj = localStorage.getItem(id);
      obj = JSON.parse(obj!);
    };
  }
  setLocal(id: string, obj: any) {
    obj.creeLe = Date.now();
    localStorage.setItem(id, JSON.stringify(obj));
  }
  /** CHARGEMENT DES DONNEES */
  // 1
  getArmes() {
    this.http.get('assets/data/armurerie.json').subscribe({
      next: (data: any) => {
        this.armes = data.armes;
        this.armures = data.armures;
        this.getUnites();
      },
      error: (err) => console.log(err),
      complete: () => console.log("Armurerie chargée")
    });
  };
  // 5
  getCreatures() {
    this.http.get('assets/data/armurerie.json').subscribe({
      next: (data: any) => {
        this.creatures = data;
      },
      error: (err) => console.log(err),
      complete: () => console.log("Armurerie chargée")
    });
  };
  // 4
  getArmees() {
    this.http.get('assets/data/armees.json').subscribe({
      next: (data: any) => {
        this.armees = data;
        this.getCreatures();
      },
      error: (err) => console.log(err),
      complete: () => console.log("Armées chargées")
    });
  }
  // 3
  getCompagnies() {
    this.http.get('assets/data/compagnies.json').subscribe({
      next: (data: any) => {
        this.compagnies = data;
        this.getArmees(); // 4
      },
      error: (err) => console.log(err),
      complete: () => console.log("Compagnies chargées")
    });
  }
  // 2
  getUnites() {
    this.http.get('assets/data/unites.json').subscribe({
      next: (data: any) => {
        this.unites = data;
        this.getCompagnies(); // 3
      },
      error: (err) => console.log(err),
      complete: () => console.log("Unités chargées")
    });
  };
}
