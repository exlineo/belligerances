import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { StatutsPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-armurerie',
  standalone: true,
  imports: [MaterialModule, StatutsPipe],
  templateUrl: './armurerie.component.html',
  styleUrl: './armurerie.component.css'
})
export class ArmurerieComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
