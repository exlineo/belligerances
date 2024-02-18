import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-infos-armees',
  standalone: true,
  imports: [],
  templateUrl: './infos-armees.component.html',
  styleUrl: './infos-armees.component.css'
})
export class InfosArmeesComponent {
  l:any = inject(UtilsService);
}
