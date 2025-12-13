import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroEmpresa } from './seguro-empresa';

describe('SeguroEmpresa', () => {
  let component: SeguroEmpresa;
  let fixture: ComponentFixture<SeguroEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguroEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguroEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
