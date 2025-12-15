import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalIsapreComponent } from '../../modals/modal-isapre'; 
import { IsaprePlan } from '../../modals/modal-isapre';


// --- NUEVA INTERFAZ PARA EL CÓNYUGE ---
interface Conyuge {
  sexo: string;
  edad: number | null;
  ingreso: number | null;
}
// ----------------------------------------

interface CargaFamiliar {
  sexo: string;
  edad: number | null;
}


interface PuntajeCategoria {
  categoria: string;
  ponderacion: number;
  puntaje: number;
}

interface DetallePuntaje {
  puntajeHospitalario: number;
  puntajeAmbulatorio: number;
  puntajePromedio: number;
  categorias: PuntajeCategoria[];
}


@Component({
  selector: 'app-planes-isapre',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalIsapreComponent],
  templateUrl: './planes-isapre.html',
  styleUrl: './planes-isapre.scss'
})
export class PlanesIsapre {
  filtros = {
    region: '',
    ingreso: null,
    edad: 29,
    sexo: 'Hombre'
  };

  mostrarModal = false;
  tieneConyuge = false;
  cargas: CargaFamiliar[] = [];
  resultados: IsaprePlan[] = [];
  
  // --- VARIABLES AÑADIDAS ---
  conyuge: Conyuge = {
    sexo: 'Mujer',
    edad: null,
    ingreso: null
  };
  ordenarPor: string = 'price'; 
  mostrarPuntaje: boolean = true; 
  vista: 'grid' | 'list' = 'grid'; // Inicializamos la vista en 'grid'

  // --------------------------

  toggleModal() { this.mostrarModal = !this.mostrarModal; }

  incrementarCargas() {
    this.cargas.push({ sexo: 'Hombre', edad: 0 });
  }

  decrementarCargas() {
    if (this.cargas.length > 0) this.cargas.pop();
  }

  cambiarVista(nuevaVista: 'grid' | 'list') {
    this.vista = nuevaVista;
  }

  buscarPlanes() {
    this.mostrarModal = false;
    const totalAsegurados = 1 + (this.tieneConyuge ? 1 : 0) + this.cargas.length;

    this.resultados = new Array(824).fill({ 
      isapre: 'Banmédica',
      nombrePlan: 'Plan Salud Total',
      valor: 8500 * totalAsegurados
    });
  }
   planSeleccionado: IsaprePlan | null = null;
  mostrarDetalleModal = false;

  tabInicialModal: 'vistaGeneral' | 'solicitar' | 'puntaje' | 'precio' = 'vistaGeneral';

  constructor() {
    this.buscarPlanes();
  }

  /* =========================
     MOCK PUNTAJE
  ========================= */
  private getMockDetallePuntaje(): DetallePuntaje {
    return {
      puntajeHospitalario: 9.2,
      puntajeAmbulatorio: 8.8,
      puntajePromedio: 9.0,
      categorias: [
        { categoria: 'Atención Hospitalaria', ponderacion: 0.35, puntaje: 9.2 },
        { categoria: 'Atención Ambulatoria', ponderacion: 0.35, puntaje: 8.8 },
        { categoria: 'Medicamentos', ponderacion: 0.15, puntaje: 7.5 },
        { categoria: 'Odontología', ponderacion: 0.10, puntaje: 6.5 },
        { categoria: 'Otros', ponderacion: 0.05, puntaje: 9.5 }
      ]
    };
  }

  /* =========================
     MODAL CONTROL
  ========================= */
  abrirDetalle(plan: IsaprePlan) {
    this.planSeleccionado = plan;
    this.tabInicialModal = 'vistaGeneral';
    this.mostrarDetalleModal = true;
  }

  abrirSolicitud(plan: IsaprePlan) {
    this.planSeleccionado = plan;
    this.tabInicialModal = 'solicitar';
    this.mostrarDetalleModal = true;
  }

  cerrarDetalle() {
    this.mostrarDetalleModal = false;
    this.planSeleccionado = null;
    this.tabInicialModal = 'vistaGeneral';
  }
}