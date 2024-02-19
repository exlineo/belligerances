import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils.service';
import { SharedModule } from '../../../shared/shared.module';
import { DonneesService } from '../../../shared/services/donnees.service';
import { StatutsPipe } from '../../../shared/pipes/tris.pipe';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-armees',
  standalone: true,
  imports: [SharedModule, StatutsPipe, NgFor, NgIf],
  templateUrl: './armees.component.html',
  styleUrl: './armees.component.css'
})
export class ArmeesComponent {

  l:any = inject(UtilsService);
  d:DonneesService = inject(DonneesService);
}
