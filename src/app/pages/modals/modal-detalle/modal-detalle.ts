import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';

/* ============================================================
   INTERFACES
   ============================================================ */

export interface PuntajeCategoria {
  categoria: string;
  ponderacion: number;
  puntaje: number;
}

export interface DetallePuntaje {
  puntajeHospitalario: number;
  puntajeAmbulatorio: number;
  puntajePromedio: number;
  categorias: PuntajeCategoria[];
}

export interface Planes {
  isapre: string;
  nombrePlan: string;
  valor: number;
  puntaje: number;
  prestadores: string;
  hospitalaria: string;
  urgencia: string;
  topeAnual: string;
  tipoCobertura: 'Libre Elección' | 'Preferentes' | 'Cerrados';
  detallePuntaje?: DetallePuntaje;
  imagenContrato?: string;
}

@Component({
  selector: 'app-modal-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle.html',
  styleUrls: ['./modal-detalle.scss']
})
export class ModalDetalleComponent implements OnInit, OnChanges {

  /* ============================================================
     INPUTS / OUTPUTS
     ============================================================ */
  @Input() plan: Planes | null = null;
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() solicitar = new EventEmitter<void>();

  /* ============================================================
     ESTADO
     ============================================================ */
  tabActiva: 'vistaGeneral' | 'contrato' | 'puntaje' | 'precio' = 'vistaGeneral';

  prestadoresPreferentes = [
    {
      prestador: 'Clínica Las Condes',
      hospitalario: '100%',
      ambulatorio: '90%',
      urgencia: '90%'
    },
    {
      prestador: 'Clínica Red Salud',
      hospitalario: '90%',
      ambulatorio: '85%',
      urgencia: '85%'
    },
    {
      prestador: 'Hospital Clínico U. de Chile',
      hospitalario: '80%',
      ambulatorio: '80%',
      urgencia: '80%'
    }
  ];

  /* ============================================================
     CICLO DE VIDA
     ============================================================ */
  ngOnInit(): void {
    if (!this.plan) {
      this.plan = this.getMockPlan();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']?.currentValue === true) {
      this.tabActiva = 'vistaGeneral';
    }
  }

  /* ============================================================
     ACCIONES UI
     ============================================================ */
  cerrarModal(): void {
    this.close.emit();
    this.tabActiva = 'vistaGeneral';
  }

  cambiarTab(tab: 'vistaGeneral' | 'contrato' | 'puntaje' | 'precio'): void {
    this.tabActiva = tab;
  }

  irASolicitar(): void {
    this.solicitar.emit();
  }

  /* ============================================================
     GRÁFICO PRECIO
     ============================================================ */
  gesValor = 0.77;
  planValor = 3.28;
  maxUF = 4.5;

  get gesAltura(): string {
    return (this.gesValor / this.maxUF * 300) + 'px';
  }

  get planAltura(): string {
    return (this.planValor / this.maxUF * 300) + 'px';
  }

  /* ============================================================
     MOCK (SOLO DEV)
     ============================================================ */
  private getMockPlan(): Planes {
    return {
      isapre: 'Banmédica',
      nombrePlan: 'Plan Salud Premium 5.500',
      valor: 185000,
      puntaje: 9.0,
      prestadores: 'Libre Elección',
      hospitalaria: '100%',
      urgencia: '100%',
      topeAnual: '5500 UF',
      tipoCobertura: 'Libre Elección',
      detallePuntaje: {
        puntajeHospitalario: 9.2,
        puntajeAmbulatorio: 8.8,
        puntajePromedio: 9.0,
        categorias: [
          { categoria: 'Atención Hospitalaria', ponderacion: 0.35, puntaje: 9.2 },
          { categoria: 'Atención Ambulatoria', ponderacion: 0.35, puntaje: 8.8 },
          { categoria: 'Medicamentos y Kinesiología', ponderacion: 0.15, puntaje: 7.5 },
          { categoria: 'Especialidades Odontológicas', ponderacion: 0.10, puntaje: 6.5 },
          { categoria: 'Otros Beneficios', ponderacion: 0.05, puntaje: 9.5 }
        ]
      }
    };
  }
}
