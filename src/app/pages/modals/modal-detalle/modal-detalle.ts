import {Component,Input,Output,EventEmitter,OnChanges,SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan } from '../../../services/localstorage';

@Component({
  selector: 'app-modal-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle.html',
  styleUrls: ['./modal-detalle.scss']
})
export class ModalDetalleComponent implements OnChanges {

  /* =========================
     INPUTS / OUTPUTS
  ========================= */


  @Input() plan!: Plan & { precioFinal: number };
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() solicitar = new EventEmitter<void>();

  /* =========================
     ESTADO
  ========================= */

  tabActiva: 'vistaGeneral' | 'contrato' | 'puntaje' | 'precio' = 'vistaGeneral';

  prestadoresPreferentes = [
    {
      prestador: 'Clínica Las Condes',
      hospitalario: '90%',
      ambulatorio: '70%',
      urgencia: '70%'
    },
    {
      prestador: 'Clínica Alemana',
      hospitalario: '90%',
      ambulatorio: '70%',
      urgencia: '70%'
    }
  ];

  /* =========================
     CICLO DE VIDA
  ========================= */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']?.currentValue === true) {
      this.tabActiva = 'vistaGeneral';
    }
  }

  /* =========================
     ACCIONES
  ========================= */

  cerrarModal(): void {
    this.close.emit();
    this.tabActiva = 'vistaGeneral';
  }

  irASolicitar(): void {
    this.solicitar.emit();
  }

  /* =========================
     GRÁFICO PRECIO (MOCK VISUAL)
  ========================= */

  gesValor = 0.77;
  planValor = 3.28;
  maxUF = 4.5;

  get gesAltura(): string {
    return (this.gesValor / this.maxUF * 300) + 'px';
  }

  get planAltura(): string {
    return (this.planValor / this.maxUF * 300) + 'px';
  }
}
