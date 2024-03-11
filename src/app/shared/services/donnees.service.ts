import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aleas, AleasI, Campagne, CampagneI, OrdreI, Params, ParamsI, UniteI } from '../modeles/Type';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {

  docs: any = {
    cac: [],
    jet: [],
    sorts: [],
    armures: [],
    boucliers: [],
    montures: [],
    munitions: [],
    monstres: [],
    races: [],
    animaux: [],
    ordres: [],
    armees: [],
    compagnies: [],
    unites: []
  }
  params: ParamsI = new Params();
  ordres!: Array<OrdreI>;
  campagne!: CampagneI | null;
  campagnes: Array<CampagneI> = [];
  cache: { date: number, updates: Array<string> } = { date: 0, updates: [] };

  constructor(private http: HttpClient, private l: UtilsService) {
    if (sessionStorage.getItem('campagne')) {
      this.campagne = JSON.parse(sessionStorage.getItem('campagne')!);
      this.docs = { ...this.campagne!.docs };
      console.log(this.campagne, this.docs);
    }
    // Récupérer les données
    this.getCampagnes();
    this.getParams();
  }
  getUpdatedCache() {
    this.cache = localStorage.getItem('cache') ? JSON.parse(localStorage.getItem('cache')!) : { date: 0, updates: [] };
  }
  /** DONNEES LOCALES */
  getCache(id: string): any {
    if (localStorage.getItem(id)) {
      let obj = localStorage.getItem(id);
      obj = JSON.parse(obj!);
      return obj;
    };
    return null
  }
  setCache(listeId: string, listeData: any) {
    // Noter la mise à jour du cache dans la date et la liste des éléments
    this.cache.date = Date.now(); // Nouveau timestamp
    if (!this.cache.updates.includes(listeId)) this.cache.updates.push(listeId); // Liste des éléments qui ont été modifiés (mise à jour lorsque les fichiers sont enregistrés)

    localStorage.setItem(listeId, JSON.stringify(listeData));
    localStorage.setItem('cache', JSON.stringify(this.cache));
  }
  /** Comparer les dates de cache des données locales et du cache */
  compareCacheLocal() {

  }

  // 3
  getOrdres() {

    if (localStorage.getItem('ordres')) {
      this.ordres = JSON.parse(localStorage.getItem('ordres')!);
    } else {
      this.http.get('assets/data/ordres.json').subscribe({
        next: (data: any) => {
          this.ordres = data;
          this.setCache('ordres', data);
        },
        error: (err) => console.error(err)
      });
    }
  };
  getParams() {
    this.http.get('assets/data/params.json').subscribe({
      next: (data: any) => {
        this.params = data;
        this.getOrdres();
      },
      error: (err) => console.error(err)
    });
  }
  // 1
  getCampagnes() {
    if (localStorage.getItem('campagnes')) {
      this.campagnes = JSON.parse(localStorage.getItem('campagnes')!);
    } else {
      this.http.get('assets/data/campagnes.json').subscribe({
        next: (data: any) => {
          this.setCache('campagnes', data);
          this.campagnes = data;
        },
        error: (err) => console.error(err)
      });
    }
  }
  /** Sélectionner une campagne */
  setCampagne(index: number) {
    this.campagne = this.campagnes[index];
    this.docs = { ...this.campagne.docs };
    sessionStorage.setItem('campagne', JSON.stringify(this.campagne));
    console.log(this.campagne, this.docs);
  }
  /** Créer une campagne et télécharger les docs de démarrage */
  getDocs() {
    this.http.get('assets/data/docs.json').subscribe({
      next: (data: any) => {
        this.docs = data;
        this.campagne = new Campagne();
        this.campagne.docs = this.docs;
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
  genereUnites(aleas: AleasI = new Aleas(), unitesTypes: Array<UniteI>): Array<UniteI> {
    const unites: Array<UniteI> = [];
    let j: number = 0;

    for (let i = 0; i < aleas.n; ++i) {
      const unite = { ...unitesTypes[j] };
      if (aleas.race) unite.race = this.randListe(this.docs.races).id;
      if (aleas.cac) unite.cac = this.randListe(this.docs.cac).id;
      if (aleas.jet) unite.jet = this.randListe(this.docs.jet).id;
      if (aleas.armure) unite.armure = this.randListe(this.docs.armures).id;
      if (aleas.bouclier) unite.bouclier = this.randListe(this.docs.boucliers).id;
      if (aleas.monture) unite.monture = this.randListe(this.docs.montures).id;
      unite.pvMax = this.rand(unite.pvMax, aleas.pourcent);
      unite.pv = unite.pvMax;
      unites.push(unite);
      j == unitesTypes.length - 1 ? j = 0 : ++j;
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
  rand(init: number, p: number) {
    const ecart = init * p / 100;
    return init + (Math.round(Math.random() * ecart) - p / 2);
  }
  randListe(liste: Array<any>) {
    const val = Math.floor(Math.random() * liste.length)
    const str = liste[val];
    return str;
  }
  /**
   * Récupérer une donnée d'un tableau loadé au démarrage
   * @param tab Tableau à traiter (race, armure...)
   * @param id Id à récupérer
   */
  getCompagniesUnites(liste: string, id: number): any {
    return this.docs[liste].find((l:any) => l.id == id) ?? '';
  }
  /** EDITION DES DONNEES */
  edit(liste: string, id: number, obj: any) {
    const listeObj = this.docs[liste];
    listeObj[id] = obj;
    this.setCache(liste, this.docs[liste]);
    this.l.message('MAJ');
  }
}
