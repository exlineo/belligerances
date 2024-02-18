import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  t: any;
  langue: string = 'fr';

  constructor(private http: HttpClient) {
    this.getLangue();
  }
  getLangue() {
    this.http.get(`assets/data/${this.langue}/lang.json`).subscribe({
      next: data => this.t = data,
      error: () => console.log('Erreur lors de la récupération du fichier lang.json'),
      complete: () => console.log('Langue chargée')
    }
    )
  }
}
