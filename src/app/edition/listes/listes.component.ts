import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-listes',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './listes.component.html',
  styleUrl: './listes.component.css'
})
export class EditListesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
