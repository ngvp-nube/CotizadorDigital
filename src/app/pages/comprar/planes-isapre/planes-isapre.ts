import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalIsapreComponent,IsaprePlan} from '../../modals/modal-isapre'; // 👉 IMPORTAMOS EL MODAL Y EL TIPO CORRECTO

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

/* =========================
   COMPONENTE
========================= */

@Component({
  selector: 'app-planes-isapre',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalIsapreComponent],
  templateUrl: './planes-isapre.html',
  styleUrl: './planes-isapre.scss'
})
export class PlanesIsapre {

  /* =========================
     FILTROS
  ========================= */

  filtros = {
    region: '',
    ingreso: null,
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

  toggleModal() {
    this.mostrarModal = !this.mostrarModal;
  }

  incrementarCargas() {
    this.cargas.push({ sexo: 'Hombre', edad: 0 });
  }

  decrementarCargas() {
    if (this.cargas.length > 0) this.cargas.pop();
  }

  /* =========================
     RESULTADOS
  ========================= */

  resultados: IsaprePlan[] = [];
  mostrarPuntaje = true;
  ordenarPor: string = 'price';
  vista: 'grid' | 'list' = 'grid';

  /* =========================
     PAGINACIÓN
  ========================= */

  itemsPorPagina = 15;
  paginaActual = 1;
  totalPaginas = 0;
  resultadosPaginados: IsaprePlan[] = [];
  paginas: number[] = [];

  /* =========================
     MODAL
  ========================= */

  planSeleccionado: IsaprePlan | null = null;
  mostrarDetalleModal = false;

  tabInicialModal: 'vistaGeneral' | 'solicitar' | 'puntaje' | 'precio' =
    'vistaGeneral';

  constructor() {
    this.buscarPlanes();
  }

  /* =========================
     BUSCAR PLANES (MOCK)
  ========================= */

  buscarPlanes() {
    this.mostrarModal = false;

    const totalAsegurados =
      1 + (this.tieneConyuge ? 1 : 0) + this.cargas.length;

    // 🔥 MOCK REALISTA
    this.resultados = new Array(824).fill(null).map((_, i) => ({
      isapre: 'Banmédica',
      nombrePlan: `Plan Salud Total ${i + 1}`,
      valor: 8500 * totalAsegurados,
      puntaje: 7.8,
      prestadores: 'Libre Elección',
      hospitalaria: '90%',
      urgencia: '70%',
      topeAnual: '7.000 UF',
      tipoCobertura: 'Preferentes'
    }));

    // 🔁 Reset paginación
    this.paginaActual = 1;
    this.totalPaginas = Math.ceil(
      this.resultados.length / this.itemsPorPagina
    );

    this.paginas = Array.from(
      { length: this.totalPaginas },
      (_, i) => i + 1
    );

    this.actualizarPagina();
  }

  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.resultadosPaginados = this.resultados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPagina();
  }

  cambiarVista(vista: 'grid' | 'list') {
    this.vista = vista;
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
