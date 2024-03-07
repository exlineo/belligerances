import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aleas, AleasI, ArmeI, ArmeeI, CampagneI, CompagnieI, CreatureI, DocumentsI, MaterielI, MontureI, OrdreI, Params, ParamsI, UniteI } from '../modeles/Type';
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
    unites: [],
    params: new Params()
  }

  campagne?: CampagneI;
  campagnes: Array<CampagneI> = [];
  cache: { date: number, updates: Array<string> } = { date: 0, updates: [] };

  constructor(private http: HttpClient, private l: UtilsService) {
    this.getArmes();
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
    this.docs[listeId] = listeData;
    // Noter la mise à jour du cache dans la date et la liste des éléments
    this.cache.date = Date.now(); // Nouveau timestamp
    if (!this.cache.updates.includes(listeId)) this.cache.updates.push(listeId); // Liste des éléments qui ont été modifiés (mise à jour lorsque les fichiers sont enregistrés)

    localStorage.setItem(listeId, JSON.stringify(listeData));
    localStorage.setItem('cache', JSON.stringify(this.cache));
  }
  /** Comparer les dates de cache des données locales et du cache */
  compareCacheLocal() {

  }
  /** Téléchargement des paramètres */
  getParams() {
    this.http.get('assets/data/params.json').subscribe({
      next: p => {
        // this.docs.params = p as ParamsI;
        this.setCache('params', p as ParamsI);
      },
      error: e => console.log(e)
    })
  };
  /** CHARGEMENT DES DONNEES */
  // 1
  getArmes() {
    this.http.get('assets/data/armurerie.json').subscribe({
      next: (data: any) => {
        this.setCache('cac', data.cac);
        this.setCache('jet', data.jet);
        this.setCache('sorts', data.sorts);
        this.setCache('armures', data.armures);
        this.setCache('boucliers', data.boucliers);
        this.setCache('montures', data.montures);
        this.setCache('munitions', data.munitions);

        this.getCreatures();
      },
      error: (err) => console.error(err)
    });
  };
  // 2
  getCreatures() {
    this.http.get('assets/data/creatures.json').subscribe({
      next: (data: any) => {
        this.setCache('monstres', data.monstres);
        this.setCache('races', data.races);
        this.setCache('animaux', data.animaux);

        this.getOrdres();
      },
      error: (err) => console.error(err)
    });
  };
  // 3
  getOrdres() {
    this.http.get('assets/data/ordres.json').subscribe({
      next: (data: any) => {
        this.setCache('ordre', data);
        this.getUnites();
      },
      error: (err) => console.error(err)
    });
  };
  // 4
  getUnites() {
    this.http.get('assets/data/unites.json').subscribe({
      next: (data: any) => {
        this.docs.unites = data;

        this.setCache('unites', data);

        this.getCompagnies(); // 3
      },
      error: (err) => console.error(err)
    });
  };
  // 5
  getCompagnies() {
    this.http.get('assets/data/compagnies.json').subscribe({
      next: (data: any) => {
        this.setCache('compagnies', data);
        this.getArmees(); // 4
      },
      error: (err) => console.error(err)
    });
  }
  // 6
  getArmees() {
    this.http.get('assets/data/armees.json').subscribe({
      next: (data: any) => {
        this.setCache('armees', data);
        this.getParams();
      },
      error: (err) => console.error(err)
    });
  }
  // 7
  getCampagnes() {
    this.http.get('assets/data/campagnes.json').subscribe({
      next: (data: any) => {
        this.setCache('campagnes', data);
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
  getCompagniesUnites(liste: string, id: number): any | null {
    return this.docs[liste][id] ? this.docs[liste][id] : '';
  }

  /** EDITION DES DONNEES */
  edit(liste: string, id: number, obj: any) {
    const listeObj = this.docs[liste];
    listeObj[id] = obj;
    this.setCache(liste, this.docs[liste]);
    this.l.message('MAJ');
  }
}
