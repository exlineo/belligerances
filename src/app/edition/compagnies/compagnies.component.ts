import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-compagnies',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class EditCompagniesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
