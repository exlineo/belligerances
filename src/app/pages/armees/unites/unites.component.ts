import { Component, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { PjPipe, StatutsPipe, UnitesPipe, UnitesTaillePipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-unites',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, UnitesPipe, UnitesTaillePipe],
  templateUrl: './unites.component.html',
  styleUrl: './unites.component.css'
})
export class UnitesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  filtre:string = '';
}
