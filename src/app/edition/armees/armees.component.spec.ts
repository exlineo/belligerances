import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmeesComponent } from './armees.component';

describe('ArmeesComponent', () => {
  let component: ArmeesComponent;
  let fixture: ComponentFixture<ArmeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
