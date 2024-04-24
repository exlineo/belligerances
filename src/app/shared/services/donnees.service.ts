import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Arme, ArmeeI, Campagne, CampagneI, CompagnieI, Creature, DocumentsI, OrdreI, Params, ParamsI, UniteI } from '../modeles/Type';
import { UtilsService } from './utils.service';
import { BonusCmdPipe, BonusMoralPipe, BonusXpPipe } from '../pipes/tris.pipe';
import { Router } from '@angular/router';

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
  storage: any; // Enregistrer tout ce qu'il y a des le storage

  etatSave: boolean = false; // Savoir s'il faut enregistrer des données modifiées

  xpPipe: BonusXpPipe = new BonusXpPipe();
  cmdPipe: BonusCmdPipe = new BonusCmdPipe();
  moralPipe: BonusMoralPipe = new BonusMoralPipe();

  http:HttpClient = inject(HttpClient);
  l:UtilsService = inject(UtilsService);
  router:Router = inject(Router);

  constructor() {
    this.init();
  }
  init(){
    if (sessionStorage.getItem('campagne')) {
      this.campagne = JSON.parse(sessionStorage.getItem('campagne')!);
      this.docs = { ...this.campagne!.docs };
    }else{
      this.router.navigateByUrl('/');
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
    this.l.sendFiles(this.campagnes);
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
    if (localStorage.getItem('params')) {
      this.params = JSON.parse(localStorage.getItem('params')!);
    } else {
      this.http.get('assets/data/params.json').subscribe({
      next: (data: any) => {
        this.params = data;
        this.getOrdres();
      },
      error: (err) => console.error(err)
    });
  }
  }
  // 1
  getCampagnes() {
    console.log("Get camapagnes");
    if (localStorage.getItem('campagnes')) {
      this.campagnes = JSON.parse(localStorage.getItem('campagnes')!);
      console.log("Campagnes locales chargées");
    } else {
      this.http.get('assets/data/campagnes.json').subscribe({
        next: (data: any) => {
          this.setCache('campagnes', data);
          this.campagnes = data;
          this.docs = { ...this.campagne!.docs };
          console.log("Récupération des campagnes sauvegardées");
          this.l.message('MSG_LOAD');
        },
        error: (err) => console.error(err)
      });
    }
  }
  /** Créer une campagne */
  creeCampagne() {
    this.campagne!.dates = { creation: Date.now(), update: 0 };
    this.campagne!.id = this.campagnes.length;
    // Récupération de données type pour la campagne
    this.http.get<DocumentsI>('assets/data/docs.json').subscribe(docs => {
      this.campagne!.docs = docs;
      this.campagnes.push(this.campagne!);
      localStorage.setItem('campagnes', JSON.stringify(this.campagnes));
      sessionStorage.setItem('campagne', JSON.stringify(this.campagne));
      this.l.message('MSG_CAMP_CREE');
    });
  }
  /** Calculer le nombre de points de vie d'une compagnie */
  setCompagniePV(c:CompagnieI){
    let pv = 0;
    c.unites.forEach((id:number) => {
      pv += this.docs.unites.find((u:UniteI) => u.id == id).pv;
    })
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
  /** Récupérer une unité à partir de son ID */
  getUnite(id:number){
    return this.docs.unites.find((u:UniteI) => u.id == id);
  }
  /**
   * Récupérer une donnée d'un tableau loadé au démarrage
   * @param tab Tableau à traiter (race, armure...)
   * @param id Id à récupérer
   */
  getCompagniesUnites(liste: string, id: number): any {
    return this.docs[liste].find((l: any) => l.id == id) ?? '';
  }
  /** EDITION DES DONNEES */
  edit(liste: string, id: number, obj: any) {
    const listeObj = this.docs[liste];
    listeObj[id] = obj;
    this.setCache(liste, this.docs[liste]);
    this.l.message('MAJ');
  }
  /** Sauvegarder les modifications */
  saveCampagne() {
    for (let i = 0; i < this.campagnes.length; ++i) {
      if (this.campagne && this.campagnes[i].id == this.campagne.id) {
        this.campagne.docs = this.docs;
        this.campagnes[i] = { ...this.campagne };

        sessionStorage.setItem('campagne', JSON.stringify(this.campagne));
        this.setCache('campagnes', this.campagnes);
      }
    }
    this.l.message('MSG_SAVE');
    this.etatSave = false;
  }
  /** Créer une unite avec tous les paramètres dedans */
  /** Set Unité totale */
  setUnite(unite: UniteI) {
    let u: any = {};
    u.race = this.docs.races[unite.race] ? this.docs.races[unite.race] : new Creature();
    u.armure = this.docs.armures[unite.armure!] ? this.docs.armures[unite.armure!] : new Arme();
    u.cac = this.docs.cac[unite.cac!] ? this.docs.cac[unite.cac!] : new Arme();
    u.jet = this.docs.jet[unite.jet!] ? this.docs.jet[unite.jet!] : new Arme();
    u.sort = this.docs.sorts[unite.sort!] ? this.docs.sorts[unite.sort!] : new Arme();
    u.bouclier = this.docs.boucliers[unite.bouclier!] ? this.docs.boucliers[unite.bouclier!] : new Arme();
    u.monture = this.docs.montures[unite.monture!] ? this.docs.montures[unite.monture!] : new Creature();
    u.xp = this.xpPipe.transform(unite.xp); // Bonus d'xp de l'attaquant
    u.unite = unite; // Pointeur vers l'unité pour attribuer les dégats
    u.id = unite.id;

    return u;
  }
  /**
   * Ajouter une compagnie à une armée
   * @param idC Id de la compagnie
   * @param idA Id de l'armée dans laquelle elle est ajoutée
   */
  addCompagnieToArmee(idC:number, idA:number){
    this.docs.armees.forEach((ar:ArmeeI) => {
      if(idA != ar.id && ar.compagnies.includes(idC)){
        let index = ar.compagnies.indexOf(idC);
        ar.compagnies.splice(index, 1);
      } else if(idA == ar.id && !ar.compagnies.includes(idC)){
        ar.compagnies.push(idC);
      }
    })
  }
}
