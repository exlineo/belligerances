import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { KnobModule } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { PaginatorModule } from 'primeng/paginator';
import { PickListModule } from 'primeng/picklist';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [],
  imports: [
    RouterLink,
    RouterLinkActive,
    CheckboxModule,
    ColorPickerModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    KnobModule,
    MultiSelectModule,
    RadioButtonModule,
    SelectButtonModule,
    SliderModule,
    TriStateCheckboxModule,
    ToggleButtonModule,
    ButtonModule,
    SpeedDialModule,
    PaginatorModule,
    PickListModule,
    TableModule,
    DataViewModule,
    AccordionModule,
    TabViewModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    DragDropModule
  ],
  exports:[
    SliderModule,
    TabViewModule,
    AccordionModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    InputNumberModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    PickListModule,
    PaginatorModule,
    ToastModule,
    TooltipModule,
    ColorPickerModule
  ]
})
export class SharedModule { }
