import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SeguroResultado {
    compania: string;
    precio: number;
    tipo: string;
  }

@Component({
  selector: 'app-seguro-salud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguro-salud.html',
  styleUrl: './seguro-salud.scss',
})



export class SeguroSalud {
    filtros = {
      edad: null,
      sexo: ''
    };

    resultados: SeguroResultado[] = []; // Aquí cargarías los datos de los seguros

buscarPrecios() {
    console.log('Buscando precios con:', this.filtros);
    // Para la simulación con la interfaz, inicializamos datos ficticios
    this.resultados = [
      { compania: 'Colmena', precio: 45000, tipo: 'Oro' },
      { compania: 'Cruz Blanca', precio: 42000, tipo: 'Plata' }
    ];
  }
}
