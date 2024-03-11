import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitesComponent } from './unites-edit.component';

describe('EditUnitesComponent', () => {
  let component: EditUnitesComponent;
  let fixture: ComponentFixture<EditUnitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUnitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUnitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
