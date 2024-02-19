import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UtilsService } from '../../../shared/services/utils.service';
import { NgFor, NgIf } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-accueil-batailles',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NgFor, NgIf, SharedModule],
  templateUrl: './accueil-batailles.component.html',
  styleUrl: './accueil-batailles.component.css',
  animations: [
    trigger('tabOuvre', [
      state('ferme', style({ right: 250 })),
      state('ouvre', style({right: 0 })),
      transition('ouvre => ferme', [
        animate('.3s ease')
      ]),
      transition('ferme => ouvre', [
        animate('0.3s ease')
      ]),
    ]),
  ]
})
export class AccueilBataillesComponent {
  l:UtilsService = inject(UtilsService);

  tabArmees:boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
  tabActions:boolean = false; // Déclencher l'ouverture ou la fermeture d'une fenêtre
}
