import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

interface IsaprePlan {
  isapre: string;
  nombrePlan: string;
  valor: number;
}

@Component({
  selector: 'app-planes-mascotas',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './seguros-vida.html',
  styleUrl: './seguros-vida.scss',
})
export class SegurosVida {
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
  PlanesvidaIr() {
    
  }

}
