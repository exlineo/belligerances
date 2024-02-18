import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  l:any = inject(UtilsService);
}
