import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AccueilArmeesComponent } from './pages/armees/accueil-armees/accueil-armees.component';
import { ArmeesComponent } from './pages/armees/armees/armees.component';
import { AccueilBataillesComponent } from './pages/batailles/accueil-batailles/accueil-batailles.component';
import { CompagniesComponent } from './pages/armees/compagnies/compagnies.component';
import { UnitesComponent } from './pages/armees/unites/unites.component';
import { BataillesComponent } from './pages/batailles/batailles/batailles.component';
import { ErreurComponent } from './pages/erreur/erreur.component';

export const routes: Routes = [
    { path:'', component:AccueilComponent },
    { path:'accueil', children:[
      { path:'', component:AccueilArmeesComponent },
      { path:'armees', component:ArmeesComponent },
      { path:'compagnies', component:CompagniesComponent },
      { path:'unites', component:UnitesComponent }
    ]},
    { path:'batailles', component:AccueilBataillesComponent, children:[
      { path:'actions', component:BataillesComponent }
    ]},
    { path:'**', component:ErreurComponent }
];
