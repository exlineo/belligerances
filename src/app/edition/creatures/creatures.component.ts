import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-creatures',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './creatures.component.html',
  styleUrl: './creatures.component.css'
})
export class EditCreaturesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
