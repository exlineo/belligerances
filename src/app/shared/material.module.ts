import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
@NgModule({
  declarations: [],
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  exports:[
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatRadioModule
  ]
})
export class MaterialModule { }
