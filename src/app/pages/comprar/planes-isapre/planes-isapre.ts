import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleComponent } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';
import { LocalstorageService } from '../../../services/localstorage';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
    ModalSolicitarComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './planes-isapre.html',
  styleUrls: ['./planes-isapre.scss']
})
export class PlanesIsapre {

  /* =========================
     DATA BASE
  ========================= */
  
  cotizacionForm!: FormGroup;
  regiones: any[] = [];
  planesIsapre: any[] = [];
  resultados: any[] = [];
  resultadosPaginados: any[] = [];

  constructor(private localstorageService: LocalstorageService, private fb: FormBuilder) {}

  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {

    this.initForm();

    this.cotizacionForm.get('edad')?.valueChanges.subscribe(() => {
    });

    this.cotizacionForm.get('cargas')?.valueChanges.subscribe(() => {
    // fuerza detección de cambios
    });

    // Regiones
    this.localstorageService.getRegiones().subscribe({
      next:(data) => {
        this.regiones = data;
        console.log("Regiones", data);
         
      }
    });
    

    // Planes Isapre (FUENTE ÚNICA)
    this.localstorageService.getPlanes().subscribe({
      next:(data) => {
        this.planesIsapre = data;
        console.log("Planes", this.planesIsapre[0].precioDesde);
        this.resultados = data;
        this.resetPaginacion();
        this.actualizarPaginacion();
      }
    });
  }

  /* =========================
     FORM INIT
  ========================= */

  initForm(): void {
    this.cotizacionForm = this.fb.group({
      edad: [0],
      regioncoti: [''],
      ingresocoti: [null],
      sistemasaludcoti: [''],
      cargas: this.fb.array([])
    });
  }

  /* =========================
     FILTROS
  ========================= */

  filtros = {
    region: '',
    ingreso: null as number | null,
    edad: 0,
    sexo: 'Hombre'
  };

  /* =========================
   SALUD (SELECT PRINCIPAL)
  ========================= */

  healthOpen = false;
  healthSelected: string | null = null;

  selectHealth(value: string): void {
  this.healthSelected = value;
  this.healthOpen = false;
  this.cotizacionForm.patchValue({
    sistemasaludcoti: value
  });
  }

  /* =========================
   MODAL ASEGURADOS
  ========================= */

  toggleModal(): void {
  this.mostrarModal = !this.mostrarModal;
  }

  /* =========================
     ASEGURADOS
  ========================= */

  mostrarModal = false;
  tieneConyuge = false;

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

  /* =========================
   CARGAS FAMILIARES
  ========================= */

  get cargasForm(): FormArray {
  return this.cotizacionForm.get('cargas') as FormArray;
  }
  incrementarCargas(): void {
  this.cargasForm.push(this.fb.group({ edadCarga: [null] }));
  }

  decrementarCargas(): void {
    if (this.cargasForm.length > 0) {
      this.cargasForm.removeAt(this.cargasForm.length - 1);
    }
  }

  getFactorCargas(): number {
  let total = 0;

  for (const carga of this.cargasForm.value) {
    const edadCarga = Number(carga.edadCarga);

    if (!isNaN(edadCarga) && edadCarga > 0) {
      total += this.precioCargaPorEdad(edadCarga);
    }
  }
  console.log('Factor cargas total:', total);
    return total;
  }


  /* =========================
     CLÍNICAS
  ========================= */

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

  filtrarClinicas(): void {
    const texto = this.clinicaSearch.toLowerCase();
    this.clinicasFiltradas = this.clinicas.filter(c =>
      c.toLowerCase().includes(texto)
    );
  }

  seleccionarClinica(clinica: string): void {
    this.clinicaSearch = clinica;
    this.mostrarLista = false;
  }

  /* =========================
     RESULTADOS / VISTA
  ========================= */

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
  paginasVisibles: number[] = [];

  mostrarPrimeraPagina = false;
  mostrarUltimaPagina = false;
  mostrarDotsInicio = false;
  mostrarDotsFinal = false;

  private resetPaginacion(): void {
    this.paginaActual = 1;
  }

  private aplicarResultados(data: any[]): void {
    this.resultados = data;
    this.resetPaginacion();
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.resultados.length / this.itemsPorPagina);

    const maxPaginasVisibles = 5;
    let inicio = Math.max(this.paginaActual - 2, 2);
    let fin = Math.min(inicio + maxPaginasVisibles - 1, this.totalPaginas - 1);

    if (this.paginaActual >= this.totalPaginas - 2) {
      fin = this.totalPaginas - 1;
      inicio = Math.max(fin - maxPaginasVisibles + 1, 2);
    }

    if (this.paginaActual <= 3) {
      inicio = 2;
      fin = Math.min(maxPaginasVisibles + 1, this.totalPaginas - 1);
    }

    this.paginasVisibles = [];
    for (let i = inicio; i <= fin; i++) {
      this.paginasVisibles.push(i);
    }

    this.mostrarPrimeraPagina = this.totalPaginas > 1;
    this.mostrarUltimaPagina = this.totalPaginas > 1;
    this.mostrarDotsInicio = inicio > 2;
    this.mostrarDotsFinal = fin < this.totalPaginas - 1;

    
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    const endIndex = startIndex + this.itemsPorPagina;
    this.resultadosPaginados = this.resultados.slice(startIndex, endIndex);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;
    this.actualizarPaginacion();

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

  /* =========================
     MODALES
  ========================= */

  planSeleccionado: any | null = null;
  mostrarDetalleModal = false;
  mostrarSolicitarModal = false;

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
  }

  abrirDetalleDesdeSolicitar(): void {
    this.mostrarSolicitarModal = false;
    setTimeout(() => {
      this.mostrarDetalleModal = true;
    }, 150);
  }

  /* =========================
     INFO 7%
  ========================= */
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

//CALCULO DE PRECIO POR EDAD 
  precioTitularPoredad(edad: number): number {
    switch (true) {
      case edad >= 0 && edad < 20:
        return 0.6;

      case edad >= 20 && edad < 25:
        return 0.9;

      case edad >= 25 && edad < 35:
        return 1.0;

      case edad >= 35 && edad < 45:
        return 1.3;

      case edad >= 45 && edad < 55:
        return 1.4;

      case edad >= 55 && edad < 65:
        return 2.0;

      default:
        return 2.4;
    }
  }

  precioCargaPorEdad(edad: number): number {
    switch (true) {
      case edad >= 0 && edad < 20:
        return 0.6;

      case edad >= 20 && edad < 25:
        return 0.7;

      case edad >= 25 && edad < 35:
        return 0.7;

      case edad >= 35 && edad < 45:
        return 0.9;

      case edad >= 45 && edad < 55:
        return 1.0;

      case edad >= 55 && edad < 65:
        return 1.4;

      default:
        return 2.2;
    }
  }


  calcularPrecioPlan(precioBase: number): number{
    const edadRaw: number | null = this.cotizacionForm.get('edad')?.value;
    const edadTitular = Number(edadRaw);

    if (isNaN(edadTitular) || edadTitular < 0) {
      return precioBase;
    }

     // 1️⃣ Factor del titular
    const factorTitular = this.precioTitularPoredad(edadTitular);

    // 2️⃣ Factor total de cargas
    const factorCargas = this.getFactorCargas();

    // 3️⃣ Precio final
    return precioBase * (factorTitular + factorCargas);
  }
  
}

