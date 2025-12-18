import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalDetalleComponent, Planes } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';

/* =========================
   INTERFACES AUXILIARES
========================= */

interface Conyuge {
  sexo: string;
  edad: number | null;
  ingreso: number | null;
}

interface CargaFamiliar {
  sexo: string;
  edad: number | null;
}

/* =========================
   COMPONENTE
========================= */

@Component({
  selector: 'app-seguros-vida',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalDetalleComponent,
    ModalSolicitarComponent
  ],
  templateUrl: './seguros-vida.html',
  styleUrls: ['./seguros-vida.scss']
})
export class SegurosVida {

  
    /* =========================
       FILTROS
    ========================= */
  
    filtros = {
      region: '',
      ingreso: null as number | null,
      edad: 29,
      sexo: 'Hombre'
    };
  
    /* =========================
       ASEGURADOS
    ========================= */
  
    mostrarModal = false;
    tieneConyuge = false;
    cargas: CargaFamiliar[] = [];
  
    conyuge: Conyuge = {
      sexo: 'Mujer',
      edad: null,
      ingreso: null
    };
  
    toggleModal(): void {
      this.mostrarModal = !this.mostrarModal;
    }
  
    incrementarCargas(): void {
      this.cargas.push({ sexo: 'Hombre', edad: 0 });
    }
  
    decrementarCargas(): void {
      if (this.cargas.length > 0) {
        this.cargas.pop();
      }
    }
  
    /* =========================
       RESULTADOS
    ========================= */
  
    resultados: Planes[] = [];
    mostrarPuntaje = true;
    ordenarPor = 'price';
    vista: 'grid' | 'list' = 'grid';
  
    cambiarVista(vista: 'grid' | 'list'): void {
      this.vista = vista;
    }
  
    /* =========================
       MODALES
    ========================= */
  
    planSeleccionado: Planes | null = null;
    mostrarDetalleModal = false;
    mostrarSolicitarModal = false;
  
    constructor() {
      this.buscarPlanes();
    }
  
    /* =========================
       BUSCAR PLANES (MOCK)
    ========================= */
  
    buscarPlanes(): void {
      this.mostrarModal = false;
  
      const totalAsegurados =
        1 + (this.tieneConyuge ? 1 : 0) + this.cargas.length;
  
      this.resultados = new Array(20).fill(null).map((_, i): Planes => ({
        isapre: 'Banmédica',
        nombrePlan: `Plan Salud Total ${i + 1}`,
        valor: 8500 * totalAsegurados,
        puntaje: 7.8,
        prestadores: 'Red Preferente Banmédica',
        hospitalaria: '90%',
        urgencia: '70%',
        topeAnual: '7.000 UF',
        tipoCobertura: 'Preferentes'
      }));
    }
  
    /* =========================
       CONTROL MODALES
    ========================= */
  
    abrirDetalle(plan: Planes): void {
      this.planSeleccionado = plan;
      this.mostrarDetalleModal = true;
    }
  
    abrirSolicitud(plan: Planes): void {
      this.planSeleccionado = plan;
      this.mostrarSolicitarModal = true;
    }
  
    cerrarDetalle(): void {
      this.mostrarDetalleModal = false;
      this.planSeleccionado = null;
    }
  
    cerrarSolicitar(): void {
      this.mostrarSolicitarModal = false;
      this.planSeleccionado = null;
    }
  
    desdeDetalleASolicitar(): void {
      this.mostrarDetalleModal = false;
  
      setTimeout(() => {
        this.mostrarSolicitarModal = true;
      }, 200);
    }
  
    procesarSolicitud(payload: any): void {
      console.log('Solicitud Isapre enviada:', payload);
      // 🔥 luego conectas backend real
    }
  
      abrirDetalleDesdeSolicitar(): void {
    // oculto solicitar SIN borrar el plan
    this.mostrarSolicitarModal = false;
  
    setTimeout(() => {
      this.mostrarDetalleModal = true;
    }, 150);
    }
}
