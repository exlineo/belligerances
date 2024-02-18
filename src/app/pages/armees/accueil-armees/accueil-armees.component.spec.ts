import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilArmeesComponent } from './accueil-armees.component';

describe('AccueilArmeesComponent', () => {
  let component: AccueilArmeesComponent;
  let fixture: ComponentFixture<AccueilArmeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilArmeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccueilArmeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
