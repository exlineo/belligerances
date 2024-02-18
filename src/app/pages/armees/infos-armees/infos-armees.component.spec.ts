import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosArmeesComponent } from './infos-armees.component';

describe('InfosArmeesComponent', () => {
  let component: InfosArmeesComponent;
  let fixture: ComponentFixture<InfosArmeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosArmeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfosArmeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
