import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-armes',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './armes.component.html',
  styleUrl: './armes.component.css'
})
export class EditArmesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
