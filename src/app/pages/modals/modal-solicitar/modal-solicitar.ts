import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IsaprePlan } from '../modal-isapre';

@Component({
  selector: 'app-modal-solicitar-isapre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-solicitar.html',
  styleUrls: ['./modal-solicitar.scss']
})
export class ModalSolicitarIsapreComponent implements OnInit {

  /* =========================
     INPUTS / OUTPUTS
     ========================= */
  @Input() isVisible = false;
  @Input() plan: IsaprePlan | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  /* =========================
     FORMULARIO
     ========================= */
  formSolicitud!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formSolicitud = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      rut: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      isapreActual: ['no', Validators.required]
    });
  }

  /* =========================
     ACCIONES
     ========================= */
  cerrarModal(): void {
    this.close.emit();
    this.formSolicitud.reset({
      isapreActual: 'no'
    });
  }

  enviar(): void {
    if (this.formSolicitud.invalid) {
      this.formSolicitud.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.formSolicitud.value,
      plan: this.plan
    };

    // 🔥 Aquí luego conectas tu servicio HTTP
    this.submitForm.emit(payload);

    // Reset visual
    setTimeout(() => {
      this.isSubmitting = false;
      this.cerrarModal();
    }, 300);
  }

  /* =========================
     HELPERS
     ========================= */
  campoInvalido(campo: string): boolean {
    const control = this.formSolicitud.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
