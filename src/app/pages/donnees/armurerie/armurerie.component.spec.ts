import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmurerieComponent } from './armurerie.component';

describe('ArmurerieComponent', () => {
  let component: ArmurerieComponent;
  let fixture: ComponentFixture<ArmurerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmurerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmurerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
