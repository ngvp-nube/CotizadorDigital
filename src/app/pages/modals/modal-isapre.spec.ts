import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIsapre } from './modal-isapre';

describe('ModalIsapre', () => {
  let component: ModalIsapre;
  let fixture: ComponentFixture<ModalIsapre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalIsapre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIsapre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
