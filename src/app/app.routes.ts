import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AccueilArmeesComponent } from './pages/armees/accueil-armees/accueil-armees.component';
import { ArmeesComponent } from './pages/armees/armees/armees.component';
import { AccueilBataillesComponent } from './pages/batailles/accueil-batailles/accueil-batailles.component';
import { CompagniesComponent } from './pages/armees/compagnies/compagnies.component';
import { UnitesComponent } from './pages/armees/unites/unites.component';
import { BataillesComponent } from './pages/batailles/batailles/batailles.component';
import { ErreurComponent } from './pages/erreur/erreur.component';
import { ArmurerieComponent } from './pages/armees/armurerie/armurerie.component';
import { CreaturesComponent } from './pages/armees/creatures/creatures.component';
import { InfosArmeesComponent } from './pages/armees/infos-armees/infos-armees.component';

export const routes: Routes = [
    { path:'', component:AccueilComponent, title:"Belligérances" },
    { path:'armees', component:AccueilArmeesComponent, children:[
      { path:'', component:InfosArmeesComponent },
      { path:'creer', component:ArmeesComponent, title:"Belligérances : armées" },
      { path:'compagnies', component:CompagniesComponent, title:"Belligérances : compagnies"  },
      { path:'unites', component:UnitesComponent, title:"Belligérances : unités"  },
      { path:'armurerie', component:ArmurerieComponent, title:"Belligérances : armurerie"  },
      { path:'creatures', component:CreaturesComponent, title:"Belligérances : races & créatures"  }
    ]},
    { path:'batailles', component:AccueilBataillesComponent, title:"Belligérances : champ de bataille", children:[
      { path:'', component:BataillesComponent }
    ]},
    { path:'**', component:ErreurComponent, title:"Belligérances : perdu ?"  }
];
