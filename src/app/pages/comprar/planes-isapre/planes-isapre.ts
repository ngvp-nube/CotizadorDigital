/* ======================================================
 * IMPORTS
 * ====================================================== */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalDetalleComponent } from '../../modals/modal-detalle/modal-detalle';
import { ModalSolicitarComponent } from '../../modals/modal-solicitar/modal-solicitar';
import { LocalstorageService, Plan } from '../../../services/localstorage';

/* ======================================================
 * INTERFACES & TYPES
 * ====================================================== */

export type DetallePrecio = {
  precioBaseUF: number;

  edadTitular: number;
  factorEdad: number;
  factorCargas: number;
  factorRiesgo: number;

  beneficiarios: number;
  factorIsapreUF: number;
  precioFinalUF: number;

  valorUF: number;
  precioFinalCLP: number;
  descuento: number;
  precioConDescuentoCLP: number;
};

export type PlanConPrecioFinal = Plan & {
  precioFinal: number;
  detallePrecio: DetallePrecio;
};

/* ======================================================
 * COMPONENT
 * ====================================================== */
@Component({
  selector: 'app-planes-isapre',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDetalleComponent,
    ModalSolicitarComponent
  ],
  templateUrl: './planes-isapre.html',
  styleUrls: ['./planes-isapre.scss']
})
export class PlanesIsapre {

  /* ======================================================
   * DATA BASE / STATE
   * ====================================================== */
  cotizacionForm!: FormGroup;

  regiones: any[] = [];
  planesIsapre: any[] = [];
  resultados: any[] = [];
  resultadosPaginados: any[] = [];

  valorUF: number | null = null;

  cargasConfirmadas: { edadCarga: number }[] = [];

  /* ======================================================
   * SELECT SALUD (PRINCIPAL)
   * ====================================================== */
  healthOpen = false;
  healthSelected: string | null = null;

  selectHealth(value: string): void {
    this.healthSelected = value;
    this.healthOpen = false;
    this.cotizacionForm.patchValue({ sistemasaludcoti: value });
  }

  /* ======================================================
   * MODAL ASEGURADOS
   * ====================================================== */
  mostrarModal = false;

  toggleModal(): void {
    this.mostrarModal = !this.mostrarModal;
  }

  /* ======================================================
   * CARGAS FAMILIARES
   * ====================================================== */
  get cargasForm(): FormArray {
    return this.cotizacionForm.get('cargas') as FormArray;
  }

  incrementarCargas(): void {
    this.cargasForm.push(this.fb.group({ edadCarga: [null] }));
  }

  decrementarCargas(): void {
    if (this.cargasForm.length > 0) {
      this.cargasForm.removeAt(this.cargasForm.length - 1);

      // Mantener snapshot consistente
      this.cargasConfirmadas = this.cargasForm.value
        .filter((c: any) => c.edadCarga && c.edadCarga > 0);
    }
  }

  confirmarCargas(): void {
    this.cargasConfirmadas = this.cargasForm.value
      .filter((c: any) => c.edadCarga && c.edadCarga > 0);

    this.mostrarModal = false;
  }

  getFactorCargas(): number {
    let total = 0;

    for (const carga of this.cargasConfirmadas) {
      const edadCarga = Number(carga.edadCarga);

      if (!isNaN(edadCarga) && edadCarga > 0) {
        total += this.precioCargaPorEdad(edadCarga);
      }
    }

    return total;
  }

  getFactorTotalCargas(): number {
    return this.cargasForm.value.reduce(
      (total: number, carga: any) => {
        const edad = Number(carga.edadCarga);
        if (!isNaN(edad) && edad > 0) {
          return total + this.precioCargaPorEdad(edad);
        }
        return total;
      },
      0
    );
  }

  /* ======================================================
   * CLÍNICAS
   * ====================================================== */
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

  /* ======================================================
   * RESULTADOS / VISTA
   * ====================================================== */
  mostrarPuntaje = true;
  ordenarPor = 'price';
  vista: 'grid' | 'list' = 'grid';

  cambiarVista(vista: 'grid' | 'list'): void {
    this.vista = vista;
  }

  /* ======================================================
   * PAGINACIÓN (COMPLETA)
   * ====================================================== */
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

  /* ======================================================
   * MODALES (DETALLE / SOLICITAR)
   * ====================================================== */
  planSeleccionado: any | null = null;
  mostrarDetalleModal = false;
  mostrarSolicitarModal = false;

  abrirDetalle(plan: Plan): void {
    const detallePrecio = this.calcularDetallePrecio(plan);

    this.planSeleccionado = {
      ...plan,
      precioFinal: detallePrecio?.precioConDescuentoCLP ?? 0,
      detallePrecio
    };

    this.mostrarDetalleModal = true;
  }

  abrirSolicitud(plan: Plan): void {
    const detallePrecio = this.calcularDetallePrecio(plan);

    this.planSeleccionado = {
      ...plan,
      precioFinal: detallePrecio?.precioConDescuentoCLP ?? 0,
      detallePrecio
    };

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

  /* ======================================================
   * REGION SELECT
   * ====================================================== */
  regionOpen = false;
  regionSeleccionada: any = null;

  selectRegion(region: any): void {
    this.regionSeleccionada = region;
    this.regionOpen = false;
    this.filtrarPorRegion();
  }

  /* ======================================================
   * FACTORES / REGLAS
   * ====================================================== */
  factoresIsapre: Record<string, number> = {
    Consalud: 0.731
    // futuro:
    // Banmédica: 1.02,
    // Consalud: 1.04
  };

  prestadoresPorRegion: Record<string, string[]> = {
    'Arica y Parinacota': ['San José Interclínica'],
    'Metropolitana de Santiago': ['Clínica Dávila'],
    'Magallanes y Antártica Chilena': ['Clínica RedSalud Magallanes']
  };

  getFactorIsapreUF(plan: Plan): number {
    const base = this.factoresIsapre[plan.nombrePlan] ?? 0;
    const beneficiarios = 1 + this.cargasConfirmadas.length;
    return base * beneficiarios;
  }

  getFactorIsapre(nombrePlan: string): number {
    return this.factoresIsapre[nombrePlan] ?? 0;
  }

  /* ======================================================
   * SWEETALERT INFO 7%
   * ====================================================== */
  mostrarInfo7Porciento(): void {
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

  mostrarInfoFactores(): void{
    Swal.fire({
    title: 'Factores que influyen en el precio de tu plan',
    icon: 'info',
    width: '900',
    heightAuto: false,
    scrollbarPadding: false,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#3f4cff',
    padding: '1.5rem',
    customClass: {
    popup: 'swal-no-inner-scroll'
    },
    html: `
      <div style="text-align:left; font-size:13px; line-height:1.6;">

        <!-- FACTOR DE RIESGO -->
        <h3 style="margin-bottom:8px; color:#3f4cff;">
          📊 Tabla de Factores de Riesgo
        </h3>
        <p>
          Las Isapres utilizan una tabla oficial para calcular el riesgo del plan
          según la edad del titular y de sus cargas familiares.
        </p>

        <table style="width:100%; border-collapse:collapse; margin:12px 0;">
          <thead>
            <tr style="background:#f1f4ff;">
              <th style="padding:8px; border:1px solid #ddd;">Rango de edad</th>
              <th style="padding:8px; border:1px solid #ddd;">Titular</th>
              <th style="padding:8px; border:1px solid #ddd;">Carga</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px; border:1px solid #ddd;">0 a &lt; 20 años</td><td style="padding:8px; border:1px solid #ddd;">0.6</td><td style="padding:8px; border:1px solid #ddd;">0.6</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">20 a &lt; 25 años</td><td style="padding:8px; border:1px solid #ddd;">0.9</td><td style="padding:8px; border:1px solid #ddd;">0.7</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">25 a &lt; 35 años</td><td style="padding:8px; border:1px solid #ddd;">1.0</td><td style="padding:8px; border:1px solid #ddd;">0.7</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">35 a &lt; 45 años</td><td style="padding:8px; border:1px solid #ddd;">1.3</td><td style="padding:8px; border:1px solid #ddd;">0.9</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">45 a &lt; 55 años</td><td style="padding:8px; border:1px solid #ddd;">1.4</td><td style="padding:8px; border:1px solid #ddd;">1.0</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">55 a &lt; 65 años</td><td style="padding:8px; border:1px solid #ddd;">2.0</td><td style="padding:8px; border:1px solid #ddd;">1.4</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">65 años y más</td><td style="padding:8px; border:1px solid #ddd;">2.4</td><td style="padding:8px; border:1px solid #ddd;">2.2</td></tr>
          </tbody>
        </table>

        <hr style="margin:20px 0;" />

        <!-- GES -->
        <h3 style="margin-bottom:8px; color:#3f4cff;">
          🏥 Tabla GES (Garantías Explícitas en Salud)
        </h3>

        <p>
          El GES es un valor fijo que se cobra por cada beneficiario del plan
          (titular y cargas).
        </p>

        <table style="width:100%; border-collapse:collapse; margin:12px 0;">
          <thead>
            <tr style="background:#f1f4ff;">
              <th style="padding:8px; border:1px solid #ddd;">Beneficiarios</th>
              <th style="padding:8px; border:1px solid #ddd;">GES (UF)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px; border:1px solid #ddd;">1</td><td style="padding:8px; border:1px solid #ddd;">0.731</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">2</td><td style="padding:8px; border:1px solid #ddd;">1.462</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">3</td><td style="padding:8px; border:1px solid #ddd;">2.193</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">4</td><td style="padding:8px; border:1px solid #ddd;">2.924</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;">5</td><td style="padding:8px; border:1px solid #ddd;">3.655</td></tr>
          </tbody>
        </table>

        <p style="font-size:12px; color:#666;">
          Estos valores son referenciales y corresponden a tablas utilizadas por las Isapres
          para el cálculo del precio de los planes de salud.
        </p>

      </div>
    `
  });

  }

  /* ======================================================
   * CÁLCULOS: EDAD / CARGAS
   * ====================================================== */
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

  getDescuentoPorRenta(): number {
    const rentaRaw = this.cotizacionForm.get('ingresocoti')?.value;
    const renta = Number(rentaRaw);

    if (isNaN(renta) || renta <= 0) return 0;

    if (renta >= 600_000 && renta <= 1_500_000) return 0.07; // 7%
    if (renta >= 1_500_001 && renta <= 2_500_000) return 0.05; // 5%

    return 0;
  }

  calcularPrecioPlan(plan: Plan): number {
    if (!this.valorUF) return 0;

    const edadRaw = this.cotizacionForm.get('edad')?.value;
    if (!edadRaw) return plan.precioBase * this.valorUF;

    const edadTitular = Number(edadRaw);
    if (isNaN(edadTitular) || edadTitular <= 0) return 0;

    // 1️⃣ Factores de riesgo
    const factorTitular = this.precioTitularPoredad(edadTitular);
    const factorCargas = this.getFactorCargas();
    const factorRiesgo = factorTitular + factorCargas;

    // 2️⃣ Precio base en UF
    const precioBaseUF = plan.precioBase;

    // 3️⃣ Precio ajustado por riesgo (UF)
    const precioRiesgoUF = precioBaseUF * factorRiesgo;

    // 4️⃣ Factor Isapre (UF)
    const factorIsapreUF = this.getFactorIsapreUF(plan);

    // 5️⃣ Total UF
    const precioFinalUF = precioRiesgoUF + factorIsapreUF;

    // 6️⃣ Conversión a CLP
    const precioFinalCLP = precioFinalUF * this.valorUF;

    // 7️⃣ Descuento por renta
    const descuento = this.getDescuentoPorRenta();
    const precioConDescuento = precioFinalCLP * (1 - descuento);

    return Math.round(precioConDescuento);
  }

  calcularDetallePrecio(plan: Plan): DetallePrecio | null {
    if (!this.valorUF) return null;

    const edadRaw = this.cotizacionForm.get('edad')?.value;
    if (!edadRaw) return null;

    const edadTitular = Number(edadRaw);
    if (isNaN(edadTitular) || edadTitular <= 0) return null;

    // 1️⃣ Factores de riesgo (UF)
    const factorEdad = this.precioTitularPoredad(edadTitular);
    const factorCargas = this.getFactorCargas();
    const factorRiesgo = factorEdad + factorCargas;

    // 2️⃣ Precio base UF
    const precioBaseUF = plan.precioBase;

    // 3️⃣ Precio ajustado por riesgo (UF)
    const precioRiesgoUF = precioBaseUF * factorRiesgo;

    // 4️⃣ Beneficiarios
    const beneficiarios = 1 + this.cargasConfirmadas.length;

    // 5️⃣ Factor Isapre (UF)
    const factorIsapreBase = this.factoresIsapre[plan.nombrePlan] ?? 0;
    const factorIsapreUF = factorIsapreBase * beneficiarios;

    // 6️⃣ Total UF
    const precioFinalUF = precioRiesgoUF + factorIsapreUF;

    // 7️⃣ Conversión a CLP
    const valorUF = this.valorUF;
    const precioFinalCLP = Math.round(precioFinalUF * valorUF);

    // 8️⃣ Descuento
    const descuento = this.getDescuentoPorRenta();
    const precioConDescuentoCLP = Math.round(precioFinalCLP * (1 - descuento));

    return {
      precioBaseUF,

      edadTitular,
      factorEdad,
      factorCargas,
      factorRiesgo,

      beneficiarios,
      factorIsapreUF,

      precioFinalUF,

      valorUF,
      precioFinalCLP,
      descuento,
      precioConDescuentoCLP
    };
  }

  /* ======================================================
   * FILTROS POR SISTEMA / REGION
   * ====================================================== */
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

  filtrarPorRegion(): void {
    if (!this.regionSeleccionada) {
      this.aplicarResultados(this.planesIsapre);
      return;
    }

    const regionNombre = this.regionSeleccionada.nombre;
    const prestadoresPermitidos = this.prestadoresPorRegion[regionNombre];

    if (!prestadoresPermitidos) {
      // Si la región no tiene mapeo, mostramos vacío (tal como lo tenías)
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

  /* ======================================================
   * LIFECYCLE / INIT
   * ====================================================== */
  constructor(
    private localstorageService: LocalstorageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // UF
    this.localstorageService.getUF().subscribe({
      next: (uf) => {
        this.valorUF = uf;
      },
      error: () => {
        console.error('Error al obtener UF');
        this.valorUF = null;
      }
    });

    // Form
    this.initForm();

    // Estos subscriptions estaban “vacíos” en tu código.
    // Los dejo tal cual, por si dependes de la detección de cambios.
    this.cotizacionForm.get('edad')?.valueChanges.subscribe(() => {});
    this.cotizacionForm.get('ingresocoti')?.valueChanges.subscribe(() => {});
    this.cotizacionForm.get('cargas')?.valueChanges.subscribe(() => {});

    // Regiones
    this.localstorageService.getRegiones().subscribe({
      next: (data) => {
        this.regiones = data;
      }
    });

    // Sistema salud -> filtra
    this.cotizacionForm.get('sistemasaludcoti')
      ?.valueChanges.subscribe(() => {
        this.filtrarPorSistemaSalud();
      });

    // Planes Isapre (FUENTE ÚNICA)
    this.localstorageService.getPlanes().subscribe({
      next: (data) => {
        this.planesIsapre = data;
        this.resultados = data;
        this.resetPaginacion();
        this.actualizarPaginacion();
      }
    });
  }

  private initForm(): void {
    this.cotizacionForm = this.fb.group({
      edad: [null],
      regioncoti: [''],
      ingresocoti: [null],
      sistemasaludcoti: [''],
      cargas: this.fb.array([])
    });
  }
}
