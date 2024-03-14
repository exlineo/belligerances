import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreaturesComponent } from './creatures-edit.component';

describe('EditCreaturesComponent', () => {
  let component: EditCreaturesComponent;
  let fixture: ComponentFixture<EditCreaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCreaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
