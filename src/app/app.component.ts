import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './shared/services/utils.service';
import { EditArmeesComponent } from './edition/armees/armees-edit.component';
import { EditCompagniesComponent } from './edition/compagnies/compagnies-edit.component';
import { EditCreaturesComponent } from './edition/creatures/creatures.component';
import { EditUnitesComponent } from './edition/unites/unites-edit.component';
import { SupprComponent } from './edition/suppr/suppr.component';
import { EditArmesComponent } from './edition/armes/armes-edit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditArmeesComponent, EditCompagniesComponent, EditCreaturesComponent, EditArmesComponent, EditUnitesComponent, SupprComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'Belligerance';
  l: UtilsService = inject(UtilsService); // Langues et autres infos

  constructor() {
    this.l.getLangue();
  }
}
