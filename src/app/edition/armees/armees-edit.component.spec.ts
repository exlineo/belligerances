import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArmeesComponent } from './armees-edit.component';

describe('EditArmeesComponent', () => {
  let component: EditArmeesComponent;
  let fixture: ComponentFixture<EditArmeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArmeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArmeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
