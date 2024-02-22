import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-erreur',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './erreur.component.html',
  styleUrl: './erreur.component.css'
})
export class ErreurComponent {
  l:UtilsService = inject(UtilsService);
}
