import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleComponent } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';

interface SeguroResultado {
    compania: string;
    precio: number;
    tipo: string;
  }


interface Conyuge {
  sexo: string;
  edad: number | null;
  ingreso: number | null;
}

interface CargaFamiliar {
  sexo: string;
  edad: number | null;
}


@Component({
  selector: 'app-seguro-salud',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './seguro-salud.html',
  styleUrl: './seguro-salud.scss',
})



export class SeguroSalud {

//     //resultados: SeguroResultado[] = []; // Aquí cargarías los datos de los seguros
// buscarPrecios() {
//     console.log('Buscando precios con:', this.filtros);
//     // Para la simulación con la interfaz, inicializamos datos ficticios
//     this.resultados = [
//       { compania: 'Colmena', precio: 45000, tipo: 'Oro' },
//       { compania: 'Cruz Blanca', precio: 42000, tipo: 'Plata' }
//     ];
//   }

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
  
    resultados: any[] = [];
    mostrarPuntaje = true;
    ordenarPor = 'price';
    vista: 'grid' | 'list' = 'grid';
  
    cambiarVista(vista: 'grid' | 'list'): void {
      this.vista = vista;
    }
  
    /* =========================
       MODALES
    ========================= */
  
    planSeleccionado: any | null = null;
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
  
      this.resultados = new Array(20).fill(null).map((_, i): any => ({
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
  
    abrirDetalle(plan: any): void {
      this.planSeleccionado = plan;
      this.mostrarDetalleModal = true;
    }
  
    abrirSolicitud(plan: any): void {
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
