import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { DonneesService } from 'src/app/shared/services/donnees.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements AfterViewInit{

  l: UtilsService = inject(UtilsService);
  d: DonneesService = inject(DonneesService);
  sain: DomSanitizer = inject(DomSanitizer);

  index!: number;
  href: any;

  @ViewChild('tele') tele!: ElementRef;
  fichier:string = '';

  ngAfterViewInit(): void {
      this.fichier = 'campagnes.json';
      this.href = this.sain.bypassSecurityTrustUrl('');
  }

  creeCampagne() {
    this.d.campagne!.dates = { creation: Date.now(), update: 0 };
    this.d.campagne!.id = this.d.campagnes.length;
    this.d.campagnes.push(this.d.campagne!);
    // this.d.setCache('campagne-' + this.d.campagne?.id, this.d.campagne);
    this.d.etatSave = true;
  }
  /** Télécharger les données des campagnes */
  downloadJson() {
    if (this.d.campagne) {
      this.fichier = 'campagnes_'+ Date.now() +'.json';
      const json = JSON.stringify(this.d.campagnes);
      console.log(this.d.campagnes, json);
      this.href = this.sain.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(json));
      this.tele.nativeElement.click();
    } else {
      this.l.message('ER_TELECHARGE');
    }
  }
}
