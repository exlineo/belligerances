import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BataillesComponent } from './batailles.component';

describe('BataillesComponent', () => {
  let component: BataillesComponent;
  let fixture: ComponentFixture<BataillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BataillesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BataillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
