import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { Compagnie, CompagnieI } from 'src/app/shared/modeles/Type';
import { CompagniesPipe, PjPipe, StatutsPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, CompagniesPipe, JsonPipe],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class CompagniesComponent implements OnInit {
  l: UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  filtre:string = '';

  compagnie!: CompagnieI;

  ngOnInit() { this.initCompagnie(); }

  initCompagnie() { this.compagnie = new Compagnie(); }

}
