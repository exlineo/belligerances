import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/material.module';
import { CompagniesPipe, PjPipe, StatutsPipe, UnitesArrayPipe, UnitesPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-edit-compagnies',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, UnitesPipe, SlicePipe, UnitesArrayPipe, PjPipe],
  templateUrl: './compagnies-edit.component.html',
  styleUrl: './compagnies-edit.component.css'
})
export class EditCompagniesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  filtreUnites:string = '';
  filtreRaces:number = -1;
  pagination = {min:0,max:25};

  setPagination(event:PageEvent){
    const min = event.pageIndex * event.pageSize;
    const max = min + event.pageSize;
    this.pagination = {min, max};
    console.log(this.pagination, event);
   }

   updateCompagnie() {
    for(let i=0; i<this.d.docs.compagnies.length; ++i){
      if(this.d.docs.compagnies[i].id == this.l.maj.id){
        this.d.docs.compagnies[i] = {...this.l.maj};
      }
    }
    this.l.close();
    this.d.etatSave = true;
  }
}
