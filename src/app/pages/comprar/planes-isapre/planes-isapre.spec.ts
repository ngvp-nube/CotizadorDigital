import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesIsapre } from './planes-isapre';

describe('PlanesIsapre', () => {
  let component: PlanesIsapre;
  let fixture: ComponentFixture<PlanesIsapre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanesIsapre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesIsapre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
