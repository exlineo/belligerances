import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/material.module';
import { Unite, UniteI } from 'src/app/shared/modeles/Type';
import { BoolPipe, IntPipe, PjPipe, StatutsPipe, UnitesPipe } from 'src/app/shared/pipes/tris.pipe';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-unites',
  standalone: true,
  imports: [MaterialModule, StatutsPipe, PjPipe, UnitesPipe, SlicePipe, IntPipe, BoolPipe],
  templateUrl: './unites.component.html',
  styleUrl: './unites.component.css'
})
export class UnitesComponent {
  l:UtilsService = inject(UtilsService);
  d:DonneesService = inject(DonneesService);

  uniteCree:UniteI = new Unite(); // Unité type à créer

  filtre:any = {libre:'', pj:null, etat:null }
  libre:string = '';
  pj:boolean | undefined = undefined;
  etat:boolean | undefined = undefined;

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
    this.l.message('UNITE_ADD');
    this.uniteCree = new Unite();

    this.d.etatSave = true;
   }
   getPVMax(){
    this.uniteCree.pvMax = this.uniteCree.race != -1 ? this.d.docs.races[this.uniteCree.race].basePv : -1;
    console.log(this.uniteCree);
   }
   getFiltre(){
    console.log(this.filtre);
   }
   setTypedFiltre(event:any, arg:string, value?:string){
    console.log(this.pj, JSON.parse(event.value));
    if(value == 'null') this.filtre[arg] == null;
    if(value == 'true') this.filtre[arg] == true;
    if(value == 'false') this.filtre[arg] == false;
   }
}
