import { Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/material.module';
import { Unite, UniteI } from 'src/app/shared/modeles/Type';
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

  uniteCree:UniteI = new Unite(); // Unité type à créer

  filtre:string = '';

  pagination = {min:0,max:25};

  setPagination(event:PageEvent){
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = {min, max};
   }
   // Créer une unité
   creeUnite(){
    this.uniteCree.id = this.d.docs.unites.length;
    this.uniteCree.pv = this.uniteCree.pvMax;
    this.d.docs.unites.push({...this.uniteCree});
    this.l.message(this.l.t['UNITE'] + ' ' + this.l.t['CREEE']);
    this.uniteCree = new Unite();
   }
   getPVMax(){
    return this.uniteCree.race != -1 ? this.d.docs.races[this.uniteCree.race].basePv : -1;
   }
}
