import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitar } from './modal-solicitar';

describe('ModalSolicitar', () => {
  let component: ModalSolicitar;
  let fixture: ComponentFixture<ModalSolicitar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSolicitar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSolicitar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
