import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitesComponent } from './unites.component';

describe('UnitesComponent', () => {
  let component: UnitesComponent;
  let fixture: ComponentFixture<UnitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
