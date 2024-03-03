import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aleas, AleasI, ArmeI, ArmeeI, CampagneI, CompagnieI, CreatureI, MaterielI, MontureI, OrdreI, ParamsI, Unite, UniteI } from '../modeles/Type';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {

  cac: Array<ArmeI> = [];
  jet: Array<ArmeI> = [];
  sorts: Array<ArmeI> = [];
  armures: Array<MaterielI> = [];
  boucliers: Array<MaterielI> = [];
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
  
  /** DONNEES LOCALES */
  getCache(id: string):any {
    if (localStorage.getItem(id)) {
      let obj = localStorage.getItem(id);
      obj = JSON.parse(obj!);
      return obj;
    };
    return null
  }
  setCache(id: string, obj: any) {
    // Noter la mise à jour du cache dans la date et la liste des éléments
    const cache = localStorage.getItem('cache') ? JSON.parse(localStorage.getItem('cache')!) : {date:0,update:[]};
    cache.date = Date.now(); // Nouveau timestamp
    if(!cache.update.includes(id)) cache.update.push(id); // Liste des éléments qui ont été modifiés (mise à jour lorsque les fichiers sont enregistrés)
    
    localStorage.setItem(id, JSON.stringify(obj));
    localStorage.setItem('cache', JSON.stringify(cache))
  }
  /** Comparer les dates de cache des données locales et du cache */
  compareCacheLocal(){

  }
  /** Téléchargement des paramètres */
  getParams() {
    this.http.get('assets/data/params.json').subscribe({
      next: p => this.params = p as ParamsI,
      error: e => console.log(e),
      complete: () => console.log("Params chargés")
    })
  };
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
   * Récupérer une donnée d'un tableau loadé au démarrage
   * @param tab Tableau à traiter (race, armure...)
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
  /**
   * Générer des unités plus ou moins aléatoires pour créer une compagnie
   * @param uniteType L'unité qu'il faut dupliquer
   * @param d Le nombre d'unités à générer
   * @param alea Aléa entre chaque unité 
   */
  genereUnites(aleas:AleasI = new Aleas(), uniteType:UniteI):Array<UniteI>{
    const unites:Array<UniteI> = [];
    for(let i=0; i < aleas.n; ++i){
      const unite = uniteType;
      if(aleas.race) unite.race = this.randListe(this.races).id;
      if(aleas.cac) unite.cac = this.randListe(this.cac).id;
      if(aleas.jet) unite.cac = this.randListe(this.jet).id;
      if(aleas.armure) unite.cac = this.randListe(this.armures).id;
      if(aleas.bouclier) unite.cac = this.randListe(this.boucliers).id;
      if(aleas.monture) unite.cac = this.randListe(this.montures).id;
      console.log(unite.race);
      unite.pvMax = unite.pv = this.rand(this.races[unite.race].basePv, aleas.pourcent);
      unites.push(unite);
    }
    return unites;
  }
  rand(init:number, p:number){
    const ecart = init * p/100;
    return init + Math.round(Math.random() * ecart);
  }
  randListe(liste:Array<any>){
    return liste[Math.floor(Math.random() * liste.length)];
  }
}
