import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UtilsService } from '../../../shared/services/utils.service';
@Component({
  selector: 'app-accueil-batailles',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './accueil-batailles.component.html',
  styleUrl: './accueil-batailles.component.css'
})
export class AccueilBataillesComponent {
  l:UtilsService = inject(UtilsService);

}
