import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArmesComponent } from './armes-edit.component';

describe('EditArmesComponent', () => {
  let component: EditArmesComponent;
  let fixture: ComponentFixture<EditArmesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArmesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
