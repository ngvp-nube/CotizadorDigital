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
  cargasConfirmadas: { edadCarga: number }[] = [];
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

    this.cotizacionForm.get('ingresocoti')?.valueChanges.subscribe(() => {
    // Angular vuelve a evaluar calcularPrecioPlan automáticamente
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

    this.cotizacionForm
      .get('sistemasaludcoti')
      ?.valueChanges.subscribe(() => {
      this.filtrarPorSistemaSalud();
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
      edad: [null],
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

      this.cargasConfirmadas = this.cargasForm.value
      .filter((c: any) => c.edadCarga && c.edadCarga > 0);
    }
  }

  getFactorCargas(): number {
  let total = 0;

  for (const carga of this.cargasConfirmadas) {
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

  regionOpen = false;
  regionSeleccionada: any = null;

  selectRegion(region: any): void {
  this.regionSeleccionada = region;
  this.regionOpen = false;

  this.filtrarPorRegion();;
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

porcentajePorCobertura(codigoPlan:string): number{
  switch (codigoPlan) {
    case '13-SF1088-33':
      return 0.0345;

    case '13-SA5663-36':
      return 0.0364;
    
    case '13-SB5663-36':
      return 0.0379;

    case '13-SED8060-26':
      return 0.0368;

    case '13-SFT020-26':
      return 0.0395;

    case '13-SFT006-20':
      return 0.0409;

    case '13-SFT1088-20':
      return 0.0378;

    case '13-SPB6628-26':
      return 0.0425;

    case '13-SBP-3005-25':
      return 0.0435;

    default:
      return 0;
  }
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

  factoresIsapre: Record<string, number> = {
    Consalud: 1.036
    // futuro:
    // Banmédica: 1.02,
    // Consalud: 1.04
  };

  getFactorIsapre(nombrePlan: string): number {
  return this.factoresIsapre[nombrePlan] ?? 0;
  }

  getDescuentoPorRenta(): number {
  const rentaRaw = this.cotizacionForm.get('ingresocoti')?.value;
  const renta = Number(rentaRaw);

    if (isNaN(renta) || renta <= 0) {
      return 0;
    }

    if (renta >= 600_000 && renta <= 1_500_000) {
      return 0.07; // 7%
    }

    if (renta >= 1_500_001 && renta <= 2_500_000) {
      return 0.05; // 5%
    }

    return 0;
  }



  calcularPrecioPlan(plan: any): number {
  const edadRaw = this.cotizacionForm.get('edad')?.value;
  const edadTitular = Number(edadRaw);

  if (edadRaw === null|| edadTitular < 0) {
    return plan.precioBase;
  }

  const factorTitular = this.precioTitularPoredad(edadTitular);
  const factorCargas = this.getFactorCargas();
  const factorIsapre = this.getFactorIsapre(plan.nombrePlan);
  const porcentajeCodigo = this.porcentajePorCobertura(plan.codigoPlan);


  // 1️⃣ Se suma el porcentaje al precio base
  const precioBaseAjustado =
    plan.precioBase * (1 + porcentajeCodigo);

  // 2️⃣ Se aplican los factores
  const precioBaseCalculado =
    precioBaseAjustado *
    (factorTitular + factorCargas + factorIsapre);

  // 3️⃣ Descuento final
  const descuento = this.getDescuentoPorRenta();
  const precioFinal = precioBaseCalculado * (1 - descuento);


  return Math.round(precioFinal);
}




  confirmarCargas(): void {
  // 1️⃣ Guardamos snapshot de las cargas
  this.cargasConfirmadas = this.cargasForm.value
    .filter((c: any) => c.edadCarga && c.edadCarga > 0);

  // 2️⃣ Cerramos el modal
  this.mostrarModal = false;
}

filtrarPorSistemaSalud(): void {
  const sistemaActual = this.cotizacionForm.get('sistemasaludcoti')?.value;

  // Si no selecciona nada o es "No tiene", mostramos todo
  if (!sistemaActual || sistemaActual === 'No tiene') {
    this.aplicarResultados(this.planesIsapre);
    return;
  }

  // Mostrar todos los planes EXCEPTO la isapre actual
  const filtrados = this.planesIsapre.filter(
    plan => plan.nombrePlan !== sistemaActual
  );

  this.aplicarResultados(filtrados);
}

prestadoresPorRegion: Record<string, string[]> = {
  'Arica y Parinacota': ['San José Interclínica'],
  'Metropolitana de Santiago': ['Clínica Dávila'],
  'Magallanes y Antártica Chilena': ['Clínica RedSalud Magallanes']
};




filtrarPorRegion(): void {
  if (!this.regionSeleccionada) {
    this.aplicarResultados(this.planesIsapre);
    return;
  }

  const regionNombre = this.regionSeleccionada.nombre;
  const prestadoresPermitidos = this.prestadoresPorRegion[regionNombre];

  if (!prestadoresPermitidos) {
    // Si la región no tiene mapeo, mostramos todo
    this.aplicarResultados([]);
    return;
  }

  const filtrados = this.planesIsapre.filter(plan =>
    Array.isArray(plan.prestadores) &&
    plan.prestadores.some((prestador: string) =>
      prestadoresPermitidos.some((permitido: string) =>
        prestador.toLowerCase().includes(permitido.toLowerCase())
      )
    )
  );

  this.aplicarResultados(filtrados);
}


  
}

