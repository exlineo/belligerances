import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aleas, AleasI, ArmeI, ArmeeI, CampagneI, CompagnieI, CreatureI, MaterielI, MontureI, OrdreI, ParamsI, UniteI } from '../modeles/Type';
import { UtilsService } from './utils.service';

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

  constructor(private http: HttpClient, private l:UtilsService) {
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
      error: e => console.log(e)
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
      error: (err) => console.error(err)
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
      error: (err) => console.error(err)
    });
  };
  // 3
  getOrdres() {
    this.http.get('assets/data/ordres.json').subscribe({
      next: (data: any) => {
        this.ordres = data;
        this.getUnites();
      },
      error: (err) => console.error(err)
    });
  };
  // 4
  getUnites() {
    this.http.get('assets/data/unites.json').subscribe({
      next: (data: any) => {
        this.unites = data;
        this.getCompagnies(); // 3
      },
      error: (err) => console.error(err)
    });
  };

  // 5
  getCompagnies() {
    this.http.get('assets/data/compagnies.json').subscribe({
      next: (data: any) => {
        this.compagnies = data;
        this.getArmees(); // 4
      },
      error: (err) => console.error(err)
    });
  }
  // 6
  getArmees() {
    this.http.get('assets/data/armees.json').subscribe({
      next: (data: any) => {
        this.armees = data;
        this.getCampagnes();
      },
      error: (err) => console.error(err)
    });
  }
  // 7
  getCampagnes() {
    this.http.get('assets/data/campagnes.json').subscribe({
      next: (data: any) => {
        this.campagnes = data;
      },
      error: (err) => console.error(err)
    });
  }
  /**
   * Générer des unités plus ou moins aléatoires pour créer une compagnie
   * @param uniteType L'unité qu'il faut dupliquer
   * @param d Le nombre d'unités à générer
   * @param alea Aléa entre chaque unité
   */
  genereUnites(aleas:AleasI = new Aleas(), unitesTypes:Array<UniteI>):Array<UniteI>{
    const unites:Array<UniteI> = [];
    let j:number = 0;

    for(let i=0; i < aleas.n; ++i){
      const unite = {...unitesTypes[j]};
      if(aleas.race) unite.race = this.randListe(this.races).id;
      if(aleas.cac) unite.cac = this.randListe(this.cac).id;
      if(aleas.jet) unite.jet = this.randListe(this.jet).id;
      if(aleas.armure) unite.armure = this.randListe(this.armures).id;
      if(aleas.bouclier) unite.bouclier = this.randListe(this.boucliers).id;
      if(aleas.monture) unite.monture = this.randListe(this.montures).id;
      unite.pvMax = this.rand(unite.pvMax, aleas.pourcent);
      unite.pv = unite.pvMax;
      unites.push(unite);
      j == unitesTypes.length-1 ? j = 0 : ++j;
    }
    console.log(unitesTypes, unites);
    return unites;
  }
  /**
   *
   * @param init Valeur de départ à partir de laquelle on applique le pourcentage
   * @param p Pourcentage à calculer
   * @returns écart
   */
  rand(init:number, p:number){
    const ecart = init * p/100;
    return init + (Math.round(Math.random() * ecart) - p/2);
  }
  randListe(liste:Array<any>){
    const val = Math.floor(Math.random() * liste.length)
    const str = liste[val];
    return str;
  }

  /**
   * Récupérer une donnée d'un tableau loadé au démarrage
   * @param tab Tableau à traiter (race, armure...)
   * @param id Id à récupérer
   */
  getCompagniesUnites(liste: string, id: number): any | null {
    return this.getListe(liste)[id] ? this.getListe(liste)[id] : '';
  }
  /** RENVOYER UNE LISTE DE DONNEES POUR L'AJOUT OU l'EDITION */
  getListe(liste:string){
    switch(liste){
      case 'armees':
        return this.armees;
      case 'compagnies':
        return this.compagnies;
      case 'unites':
        return this.unites;
      case 'armures':
        return this.armures;
      case 'boucliers':
        return this.boucliers;
      case 'cac':
        return this.cac;
      case 'jet':
        return this.jet;
      case 'montures':
        return this.montures;
      case 'munitions':
        return this.munitions;
      case 'monstres':
        return this.monstres;
      case 'races':
        return this.races;
      case 'sorts':
        return this.sorts;
      default:
        return [];
    }
  }
  /** EDITION DES DONNEES */
  edit(liste:string, id:number, obj:any){
    const listeObj = this.getListe(liste);
    listeObj[id] = obj;
    this.setCache(liste, listeObj);
    this.l.message('MAJ');
  }
}
