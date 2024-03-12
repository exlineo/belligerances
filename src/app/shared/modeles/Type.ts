export interface UniteI {
  id:number;
  nom:string;
  descr?:string;
  race:number;
  cac?:number;
  jet?:number;
  ca?:number;
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
  munitions?:{type:number,q:number},
  pvMax:number;
  pv?:number;
  moral:number;
  ordre?:OrdreI;
  nbCombats?:number;
  avatar?:string;
  position:PositionI;
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
  munitions = {type:-1, q:0};
  pvMax = -1;
  pv = -1
  moral = -1;
  nbCombats = 0;
  commandant = -1;
  avatar = '';
  position = {x:0,y:0};
}
export interface ArmeeI {
  id:number;
  nom:string;
  descr?:string;
  avatar?:string;
  commandant?:number;
  couleur:string;
  statut:number;
  compagnies:Array<number>;
}
export class Armee implements ArmeeI {
  id = -1;
  nom = '';
  descr = '';
  couleur = '#FFFFFF';
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
export interface MaterielI{
  id:number;
  nom:string;
  descr:string;
  bonus:number;
}
export interface ArmeI{
  id:number;
  nom:string;
  descr:string;
  degats:{min:number, max:number};
  portee?:{min:number, max:number, munitions:number};
  impact?:number;
}
export class Arme implements ArmeI{
  id = -1;
  nom = '';
  descr = '';
  degats = {min:0, max:0};
  portee = {min:0, max:0, munitions:-1};
  impact = 0;
}
export interface ParamsI {
cartes:Array<CarteI>;
couleurs?:Array<string>;
}
export class Params implements ParamsI {
cartes = [];
}
export interface CarteI {
id:number;
nom:string;
description:string;
img:string;
vignette:string;
}
export interface PositionI{
x:number;
y:number;
}
export interface AleasI{
  cac?:boolean;
  jet?:boolean;
  armure?:boolean;
  bouclier?:boolean;
  race?:boolean;
  monture?:boolean;
  pourcent:number;
  n:number;
}
export class Aleas implements AleasI {
  cac = false;
  jet = false;
  armure = false;
  bouclier = false;
  race = false;
  monture = false;
  pourcent = 0;
  n = 0;
}
export interface DocumentsI {
cac: Array<ArmeI>;
jet: Array<ArmeI>;
sorts: Array<ArmeI>;
armures: Array<MaterielI>;
boucliers: Array<MaterielI>;
montures: Array<MontureI>;
munitions: Array<ArmeI>;
monstres: Array<CreatureI>;
races: Array<CreatureI>;
animaux: Array<CreatureI>;
ordres: Array<OrdreI>;
armees: Array<ArmeeI>;
compagnies: Array<CompagnieI>;
unites: Array<UniteI>;
}
export interface CampagneI {
id:number;
dates:{creation:number, update:number};
nom:string;
descr?:string;
statut:number;
docs:DocumentsI;
}
export class Campagne implements CampagneI {
id = -1;
dates = {creation:0, update:0};
nom = '';
descr = '';
statut = 1;
docs = {} as DocumentsI;
// docs = {cac:[], jet:[], sorts:[], armures:[], boucliers:[], montures:[], munitions:[], monstres:[], races:[], animaux:[], ordres:[], armees:[], compagnie:[], unites:[], params:new Params()};
}
