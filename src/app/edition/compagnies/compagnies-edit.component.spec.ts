import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompagniesComponent } from './compagnies-edit.component';

describe('EditCompagniesComponent', () => {
  let component: EditCompagniesComponent;
  let fixture: ComponentFixture<EditCompagniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompagniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompagniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
