import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 

// ----------------------------------------------------
// 1. INTERFACES PARA DETALLE Y PUNTAJE
// ----------------------------------------------------

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

// ----------------------------------------------------
// 2. INTERFAZ PRINCIPAL DEL PLAN
// ----------------------------------------------------

export interface IsaprePlan {
    isapre: string;
    nombrePlan: string;
    valor: number;
    puntaje: number; 
    prestadores: string; 
    hospitalaria: string; 
    urgencia: string; 
    topeAnual: string; 
    tipoCobertura: 'Libre Elección' | 'Preferentes' | 'Cerrados'; 
    detallePuntaje?: DetallePuntaje; 
    imagenContrato?: string; 
}

@Component({
    selector: 'app-modal-isapre',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal-isapre.html',
    styleUrls: ['./modal-isapre.scss']
})
export class ModalIsapreComponent implements OnInit, OnChanges {

    @Input() plan: IsaprePlan | null = null;
    @Input() isVisible: boolean = false;

    @Input() tabInicial: 
        'vistaGeneral' | 'contrato' | 'puntaje' | 'precio' | 'solicitar' 
        = 'vistaGeneral';

    @Output() close = new EventEmitter<void>();

    tabActiva: 
        'vistaGeneral' | 'contrato' | 'puntaje' | 'precio' | 'solicitar' 
        = 'vistaGeneral';

    prestadoresPreferentes = [
        { prestador: "Clínica Las Condes", hospitalario: "100%", ambulatorio: "90%", urgencia: "90%" },
        { prestador: "Clínica Red Salud (Valores)", hospitalario: "90%", ambulatorio: "85%", urgencia: "85%" },
        { prestador: "Hospital Clínico Universidad de Chile", hospitalario: "80%", ambulatorio: "80%", urgencia: "80%" },
        { prestador: "Clínica Alemana", hospitalario: "70%", ambulatorio: "70%", urgencia: "70%" },
        { prestador: "Diagnóstico e Imágenes", hospitalario: "90%", ambulatorio: "n/a", urgencia: "n/a" }
    ];

    coberturaHospitalariaPorcentaje: number = 100;
    coberturaAmbulatoriaPorcentaje: number = 80;

    beneficiosPlan = [
        { nombre: 'Vida Smart', icono: 'person_outline' },
        { nombre: 'Medicamentos 50%', icono: 'medication_liquid' },
        { nombre: 'Rescate Emergencia Móvil', icono: 'ambulance' },
        { nombre: 'Kinesiología a Domicilio', icono: 'kinesiology' }
    ];

    beneficiosIsapre = [
        { nombre: 'Descuentos en Farmacia', icono: 'receipt_long' },
        { nombre: 'Salud Dental', icono: 'dentistry' },
        { nombre: 'Red de Ópticas', icono: 'eyeglasses' },
        { nombre: 'Orientación Médica Telefónica', icono: 'call' },
        { nombre: 'Bono Costo Cero', icono: 'paid' }
    ];

    ngOnInit(): void {

        this.tabActiva = this.tabInicial;
        
        if (!this.plan) {
            this.plan = {
                isapre: 'Banmédica',
                nombrePlan: 'Plan Salud Premium 5.500',
                valor: 185000,
                puntaje: 9.0, 
                prestadores: 'Libre Elección', 
                hospitalaria: '100%', 
                urgencia: '100%', 
                topeAnual: '5500 UF', 
                tipoCobertura: 'Libre Elección',
                detallePuntaje: this.getMockDetallePuntaje()
            };
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tabInicial']) {
            this.tabActiva = this.tabInicial;
        }
        
        if (changes['isVisible']?.currentValue === true) {
            this.tabActiva = this.tabInicial;
        }
    }

    cerrarModal() {
        this.close.emit();
        this.tabActiva = 'vistaGeneral';
    }

    cambiarTab(tab: 'vistaGeneral' | 'contrato' | 'puntaje' | 'precio' | 'solicitar') {
        this.tabActiva = tab;
    }

    /** 🔥 Método para ir a la pestaña Solicitar */
    irASolicitar() {
        this.tabActiva = 'solicitar';

        // Scroll hacia arriba para mostrar el formulario
        setTimeout(() => {
            const caja = document.querySelector('.modal-content-body');
            if (caja) caja.scrollTop = 0;
        }, 50);
    }

    getMockDetallePuntaje(): DetallePuntaje {
        return {
            puntajeHospitalario: 9.2,
            puntajeAmbulatorio: 8.8,
            puntajePromedio: 9.0,
            categorias: [
                { categoria: 'Atención Hospitalaria', ponderacion: 0.35, puntaje: 9.2 },
                { categoria: 'Atención Ambulatoria', ponderacion: 0.35, puntaje: 8.8 },
                { categoria: 'Medicamentos y Kinesiología', ponderacion: 0.15, puntaje: 7.5 },
                { categoria: 'Especialidades Odontológicas', ponderacion: 0.10, puntaje: 6.5 },
                { categoria: 'Otros Beneficios', ponderacion: 0.05, puntaje: 9.5 },
            ]
        };
    }

    gesValor: number = 0.77;
    planValor: number = 3.28;
    maxUF: number = 4.5;

    get gesAltura(): string {
        return (this.gesValor / this.maxUF * 300) + 'px';
    }

    get planAltura(): string {
        return (this.planValor / this.maxUF * 300) + 'px';
    }
}
