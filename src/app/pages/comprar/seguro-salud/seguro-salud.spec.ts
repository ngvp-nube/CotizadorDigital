import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroSalud } from './seguro-salud';

describe('SeguroSalud', () => {
  let component: SeguroSalud;
  let fixture: ComponentFixture<SeguroSalud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguroSalud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguroSalud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
