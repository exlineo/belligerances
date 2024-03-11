import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprComponent } from './suppr.component';

describe('SupprComponent', () => {
  let component: SupprComponent;
  let fixture: ComponentFixture<SupprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
