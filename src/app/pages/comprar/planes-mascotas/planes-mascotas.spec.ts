import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesMascotas } from './planes-mascotas';

describe('PlanesMascotas', () => {
  let component: PlanesMascotas;
  let fixture: ComponentFixture<PlanesMascotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanesMascotas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesMascotas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
