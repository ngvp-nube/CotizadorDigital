import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegurosVida } from './seguros-vida';

describe('SegurosVida', () => {
  let component: SegurosVida;
  let fixture: ComponentFixture<SegurosVida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegurosVida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegurosVida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
