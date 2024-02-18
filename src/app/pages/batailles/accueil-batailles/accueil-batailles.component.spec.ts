import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilBataillesComponent } from './accueil-batailles.component';

describe('AccueilBataillesComponent', () => {
  let component: AccueilBataillesComponent;
  let fixture: ComponentFixture<AccueilBataillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilBataillesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccueilBataillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
