import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleComponent, Planes } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';
import Swal from 'sweetalert2';

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






mostrarInfo7Porciento() {
  Swal.fire({
    title: 'Resultados ajustados a tu 7% de salud',
    icon: 'info',
    width: 500,
    padding: '1.2rem',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#3f4cff',
    customClass: {
      popup: 'swal-renta-info'
    },
    html: `
      <div style="text-align:left; font-size:13px; line-height:1.6;">

        <div style="display:flex; gap:16px; margin-bottom:12px;">
          
          <div style="flex:1;">
            <p style="font-weight:600; color:#3f4cff; margin-bottom:6px;">
              👨‍👩‍👧 Dependientes
            </p>
            <p>
              Si trabajas con contrato, tu empleador aporta un <strong>7% de tu sueldo
              imponible</strong> para salud.
            </p>
            <p>
              Ese monto puedes destinarlo libremente en el plan que prefieras, pero
              debes ocupar al menos ese monto.
            </p>
            <p>
              Si te aparecen pocas opciones o no te gusta la cobertura, es porque
              con ese 7% no alcanza para planes más altos.
            </p>
            <p>
              👉 Usa el filtro <strong>“Precio”</strong> para ver opciones que se ajusten
              a tu cotización.
            </p>
          </div>

          <div style="flex:1;">
            <p style="font-weight:600; color:#3f4cff; margin-bottom:6px;">
              🧑 Independientes
            </p>
            <p>
              Si trabajas sin contrato o no trabajas, puedes elegir igualmente
              el plan que quieras.
            </p>
            <p>
              La diferencia es que debes destinar lo que quieras al plan y
              <strong>no ingreses renta</strong> en el perfil.
            </p>
            <p>
              👉 Usa el filtro <strong>“Precio”</strong> para buscar planes que se
              acomoden a tu disposición de pago.
            </p>
          </div>

        </div>

      </div>
    `
  });
}






}
