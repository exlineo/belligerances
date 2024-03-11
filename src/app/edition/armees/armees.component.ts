import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-armees',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './armees.component.html',
  styleUrl: './armees.component.css'
})
export class EditArmeesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
