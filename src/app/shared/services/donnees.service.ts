import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArmeeI, CampagneI, CompagnieI, CreatureI, MontureI, OrdreI, ParamsI, UniteI } from '../modeles/Type';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {

  cac: Array<string> = [];
  jet: Array<string> = [];
  sorts: Array<string> = [];
  armures: Array<string> = [];
  boucliers: Array<string> = [];
  montures: Array<MontureI> = [];
  munitions: Array<string> = [];
  monstres: Array<CreatureI> = [];
  races: Array<CreatureI> = [];
  animaux: Array<CreatureI> = [];
  ordres: Array<OrdreI> = [];

  campagnes:Array<CampagneI> = [];
  armees: Array<ArmeeI> = [];
  compagnies: Array<CompagnieI> = [];
  unites: Array<UniteI> = [];

  params!: ParamsI;

  campagne?:CampagneI;

  constructor(private http: HttpClient) {
    this.getArmes();
    this.getParams();
  }
  getParams() {
    this.http.get('assets/data/params.json').subscribe({
      next: p => this.params = p as ParamsI,
      error: e => console.log(e),
      complete: () => console.log("Params chargés")
    })
  };
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
        this.cac = data.cac;
        this.jet = data.jet;
        this.sorts = data.sorts;
        this.armures = data.armures;
        this.boucliers = data.boucliers;
        this.montures = data.montures;
        this.munitions = data.munitions;
        this.getCreatures();
      },
      error: (err) => console.error(err),
      complete: () => console.info("Armurerie chargée")
    });
  };
  // 2
  getCreatures() {
    this.http.get('assets/data/creatures.json').subscribe({
      next: (data: any) => {
        this.monstres = data.monstres;
        this.races = data.races;
        this.animaux = data.animaux;
        this.getOrdres();
      },
      error: (err) => console.error(err),
      complete: () => console.info("Créatures chargées")
    });
  };
  // 3
  getOrdres() {
    this.http.get('assets/data/ordres.json').subscribe({
      next: (data: any) => {
        this.ordres = data;
        this.getUnites();
      },
      error: (err) => console.error(err),
      complete: () => console.info("Ordres chargés")
    });
  };
  // 4
  getUnites() {
    this.http.get('assets/data/unites.json').subscribe({
      next: (data: any) => {
        this.unites = data;
        this.getCompagnies(); // 3
      },
      error: (err) => console.error(err),
      complete: () => console.info("Unités chargées")
    });
  };

  // 5
  getCompagnies() {
    this.http.get('assets/data/compagnies.json').subscribe({
      next: (data: any) => {
        this.compagnies = data;
        this.getArmees(); // 4
      },
      error: (err) => console.error(err),
      complete: () => console.info("Compagnies chargées")
    });
  }
  // 6
  getArmees() {
    this.http.get('assets/data/armees.json').subscribe({
      next: (data: any) => {
        this.armees = data;
        this.getCampagnes();
      },
      error: (err) => console.error(err),
      complete: () => console.info("Armées chargées")
    });
  }
  // 7
  getCampagnes() {
    this.http.get('assets/data/campagnes.json').subscribe({
      next: (data: any) => {
        this.campagnes = data;
      },
      error: (err) => console.error(err),
      complete: () => console.info("Campagnes chargées")
    });
  }
  /**
   * Récupérer une donnée d'un tableau
   * @param tab Tableau à traiter
   * @param id Id à récupérer
   */
  getCompagniesUnites(tab: string, id: number): any | null {
    switch (tab) {
      case "races":
        return this.races[id] ? this.races[id] : '';
      case "arumres":
        return this.armures[id] ? this.armures[id] : '';
      case "cac":
        return this.cac[id] ? this.cac[id] : '';
      case "jet":
        return this.jet[id] ? this.jet[id] : '';
      case "boucliers":
        return this.boucliers[id] ? this.boucliers[id] : '';
      case "montures":
        return this.montures.find(m => m.id == id) ? this.montures.find(m => m.id == id) : '';
      case "munitions":
        return this.munitions[id] ? this.munitions[id] : '';
      case "armures":
        return this.armures[id] ? this.armures[id] : '';
      case "compagnies":
        return this.compagnies.find(c => c.id == id) ? this.compagnies.find(c => c.id == id) : '';
      case "armees":
        return this.armees.find(a => a.id == id) ? this.armees.find(a => a.id == id) : '';
      default:
        return '';
    }

  }
}
