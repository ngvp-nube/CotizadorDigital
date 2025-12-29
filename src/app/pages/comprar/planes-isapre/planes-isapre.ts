import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleComponent, Planes } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';
import { LocalstorageService } from '../../../services/localstorage';

/* =========================
   INTERFACES AUXILIARES
========================= */

interface Conyuge {
  edad: number | null;
  ingreso: number | null;
  sistemaSalud: string;
}

interface CargaFamiliar {
  edad: number | null;
}


/* =========================
   COMPONENTE
========================= */

@Component({
  selector: 'app-planes-isapre',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalDetalleComponent,
    ModalSolicitarComponent
  ],
  templateUrl: './planes-isapre.html',
  styleUrls: ['./planes-isapre.scss']
  
})

  


export class PlanesIsapre {

  regiones: any[] = [];

  constructor(private localstorageService: LocalstorageService) {
    
  }

    ngOnInit(){
    this.localstorageService.get('/api/regiones').subscribe(data => {
    console.log(data);
    this.regiones = data;
    });
    this.buscarPlanes();
    }

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
  edad: null,
  ingreso: null,
  sistemaSalud: ''
  };
  conyugeHealthOpen = false;

  selectConyugeHealth(value: string): void {
  this.conyuge.sistemaSalud = value;
  this.conyugeHealthOpen = false;
}



  clinicaSearch = '';
  mostrarLista = false;

  clinicas: string[] = [
    'Arauco Salud',
    'Bionet',
    'Centro Clínico el Portal',
    'Centro del Cáncer UC CHRISTUS',
    'Clínica Alemana',
    'Clínica Las Condes',
    'Clínica Santa María'
  ];

  clinicasFiltradas: string[] = [];

  filtrarClinicas() {
  const texto = this.clinicaSearch.toLowerCase();

  this.clinicasFiltradas = this.clinicas.filter(c =>
    c.toLowerCase().includes(texto)
  );
}

seleccionarClinica(clinica: string) {
  this.clinicaSearch = clinica;
  this.mostrarLista = false;

  // 👉 aquí luego puedes disparar el filtro real
}


  toggleModal(): void {
    this.mostrarModal = !this.mostrarModal;
  }

  incrementarCargas(): void {
    this.cargas.push({ edad: null });
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
  resultadosPaginados: Planes[] = [];

  mostrarPuntaje = true;
  ordenarPor = 'price';
  vista: 'grid' | 'list' = 'grid';

  cambiarVista(vista: 'grid' | 'list'): void {
    this.vista = vista;
  }

  /* =========================
     PAGINACIÓN
  ========================= */

  paginaActual = 1;
  itemsPorPagina = 15;
  totalPaginas = 0;
  paginas: number[] = [];

  // 🔥 ESTAS FALTABAN
  mostrarPrimeraPagina = false;
  mostrarUltimaPagina = false;
  mostrarDotsInicio = false;
  mostrarDotsFinal = false;

actualizarPaginacion(): void {
  this.totalPaginas = Math.ceil(this.resultados.length / this.itemsPorPagina);

  const maxPaginasVisibles = 5;

  // Rango central SIN incluir 1 ni última
  let inicio = Math.max(this.paginaActual - 2, 2);
  let fin = Math.min(inicio + maxPaginasVisibles - 1, this.totalPaginas - 1);

  // Ajuste cuando estamos cerca del final
  if (this.paginaActual >= this.totalPaginas - 2) {
    fin = this.totalPaginas - 1;
    inicio = Math.max(fin - maxPaginasVisibles + 1, 2);
  }

  // Ajuste cuando estamos cerca del inicio
  if (this.paginaActual <= 3) {
    inicio = 2;
    fin = Math.min(maxPaginasVisibles + 1, this.totalPaginas - 1);
  }

  // Construir páginas centrales
  this.paginasVisibles = [];
  for (let i = inicio; i <= fin; i++) {
    this.paginasVisibles.push(i);
  }

  // Flags visuales
  this.mostrarPrimeraPagina = this.totalPaginas > 1;
  this.mostrarUltimaPagina = this.totalPaginas > 1;

  this.mostrarDotsInicio = inicio > 2;
  this.mostrarDotsFinal = fin < this.totalPaginas - 1;

  // Slice de resultados
  const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
  const endIndex = startIndex + this.itemsPorPagina;
  this.resultadosPaginados = this.resultados.slice(startIndex, endIndex);
}

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;
    this.actualizarPaginacion();

    // 🔥 Scroll EXACTO al inicio de las cards
    setTimeout(() => {
      const el = document.getElementById('cards-start');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }


  paginaAnterior(): void {
    this.irAPagina(this.paginaActual - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual + 1);
  }

  paginasVisibles: number[] = [];

  /* =========================
     MODALES
  ========================= */

  planSeleccionado: Planes | null = null;
  mostrarDetalleModal = false;
  mostrarSolicitarModal = false;



  /* =========================
     BUSCAR PLANES (MOCK)
  ========================= */

  buscarPlanes(): void {
    this.mostrarModal = false;

    const totalAsegurados =
      1 + (this.tieneConyuge ? 1 : 0) + this.cargas.length;

    this.resultados = new Array(400).fill(null).map((_, i): Planes => ({
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

    // 🔥 RESET + PAGINACIÓN
    this.paginaActual = 1;
    this.actualizarPaginacion();
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
    // 🔥 aquí luego conectas backend real
  }

  abrirDetalleDesdeSolicitar(): void {
    this.mostrarSolicitarModal = false;

    setTimeout(() => {
      this.mostrarDetalleModal = true;
    }, 150);
  }

  healthOpen = false;
  healthSelected: string | null = null;

  selectHealth(value: string) {
  this.healthSelected = value;
  this.healthOpen = false;
  }




}
