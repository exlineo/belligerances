export interface UniteI {
  id:number;
  nom:string;
  descr?:string;
  race:number;
  cac?:number;
  jet?:number;
  sort?:number;
  armure?:number;
  bouclier?:number;
  pvMax:number;
  pv:number;
  monture?:number;
  impact:number;
  xp:number;
  nbCombats?:number;
  etat: number;
  pj:boolean;
  archetype:boolean;
  cmd?:number;
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
  sort = -1;
  xp = 0;
  impact = -1;
  etat = 2;
  pj = false;
  archetype = false;
  cmd = 0;
  avatar = '';
}
export interface CompagnieI {
  id:number;
  nom:string;
  descr?:string;
  armee?:number;
  statut:number;
  unites:Array<number>;
  combattants?:Array<number>;
  commandant:number;
  munitions?:{type:number,q:number},
  pvMax:number;
  pv?:number;
  moral:number;
  ordre?:OrdreI | null;
  morts?:number;
  blesses?:number;
  xp:number;
  avatar?:string;
  position:PositionI;
}
export interface OrdreI{
  id:number;
  ordre:string;
  descr:string;
  effets:{type:string,bonus:number,statut?:string,cible?:string}
}
export class Compagnie implements CompagnieI {
  id = -1;
  nom = '';
  descr = '';
  armee = -1;
  statut = 2;
  unites = [];
  combattants = [];
  munitions = {type:-1, q:0};
  pvMax = -1;
  pv = -1
  moral = 6;
  blesses = 0;
  morts = 0;
  commandant = -1;
  xp = 0;
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
  basePv?:number,
  baseArmure?:number,
  impact?:number
}
export class Creature implements CreatureI {
  id = -1;
  nom = '';
  basePv = 10;
  baseArmure = 10;
}
export interface ArmeI{
  id:number;
  nom:string;
  descr?:string;
  degats?:{min:number, max:number};
  portee?:{min:number, max:number, munitions:number};
  impact?:number;
  bonus?:number;
}
export class Arme implements ArmeI{
  id = -1;
  nom = '';
  descr = '';
  degats = {min:0, max:0};
  portee = {min:0, max:0, munitions:-1};
  impact = 0;
  bonus = 0;
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
armures: Array<ArmeI>;
boucliers: Array<ArmeI>;
montures: Array<CreatureI>;
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
enum OrdresE{
  cac = 'cac',
  jet = 'jet',
  sort = 'sort',
  def = 'def',
  moral = 'moral',
}
