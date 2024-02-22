export interface UniteI {
    id:number;
    nom:string;
    race:number;
    cac?:number;
    jet?:number;
    ca:number;
    armure?:number;
    bouclier?:number;
    pvMax:number;
    pv:number;
    monture?:number;
    impact:number;
    attaque:number;
    degats:number;
    xp:number;
    nbCombats?:number;
    etat: EtatE;
    pj:boolean;
    avatar?:string;
}
export enum EtatE{
    mort = -2,
    alite = -1,
    grave = 0,
    leger = 1,
    combattant = 2
}
export class Unite implements UniteI{
    id = -1;
    nom = '';
    race = -1;
    pvMax = -1;
    pv = -1;
    ca = -1;  
    xp = 0;
    impact = -1;
    attaque = -1;
    degats = -1;
    etat = EtatE.combattant;
    pj = false;
    avatar = '';
}
export interface CompagnieI {
    id:number;
    nom:string;
    descr?:string;
    armee?:number;
    statut:number;
    unites:Array<number>;
    unitesCombat?:Array<number>;
    commandant:number;
    munitions?:{type:string,q:number},
    pvMax:number;
    pv?:number;
    moral:number;
    ordre?:OrdreI;
    nbCombats?:number;
    avatar?:string;
}
export interface OrdreI{
    id:number;
    ordre:string;
    descr:string;
    effets:[{type?:string,bonus?:number,statut?:string,cible?:string}]
}
export class Compagnie implements CompagnieI {
    id = -1;
    nom = '';
    descr = '';
    statut = -1;
    unites = [];
    pvMax = -1;
    pv = -1
    moral = -1;
    nbCombats = 0;
    commandant = -1;
    avatar = '';
}
export interface ArmeeI {
    id:number;
    nom:string;
    descr?:string;
    commandant?:number;
    couleur:string;
    statut:number;
    compagnies:Array<number>;
}
export class Armee implements ArmeeI {
    id = -1;
    nom = '';
    descr = '';
    couleur = '';
    statut = 2;
    compagnies = [];
}
export interface CreatureI {
    id:number;
    nom:string,
    basePv:number,
    baseArmure:number
}
export class Creature implements CreatureI {
    id = -1;
    nom = '';
    basePv = -1;
    baseArmure = -1;
}
export interface MontureI {
    id:number;
    nom:string;
    impact:number;
}