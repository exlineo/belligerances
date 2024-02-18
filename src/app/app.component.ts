import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './shared/services/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'Belligerance';
  l:UtilsService = inject(UtilsService);

  constructor(){
    this.l.getLangue();
    console.log(this.l.t);
  }
}
