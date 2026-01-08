import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface Plan {
  id: number;
  codigoPlan: string;
  preferente: boolean;
  nombrePlan: string;
  logo: string;
  plan: string;
  prestadores: string[];
  hospitalaria: number;
  urgencia: number;
  ambulatoria: number;
  topeAnualUf: number;
  puntaje: number;
  precioBase: number;
  imagenContrato?: string;
}



@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private readonly API_INDICADORES = 'https://mindicador.cl/api';


  regiones = [
    { id: 1, nombre: 'Arica y Parinacota' },
    { id: 2, nombre: 'Tarapacá' },
    { id: 3, nombre: 'Antofagasta' },
    { id: 4, nombre: 'Atacama' },
    { id: 5, nombre: 'Coquimbo' },
    { id: 6, nombre: 'Valparaíso' },
    { id: 7, nombre: 'Metropolitana de Santiago' },
    { id: 8, nombre: 'O’Higgins' },
    { id: 9, nombre: 'Maule' },
    { id: 10, nombre: 'Ñuble' },
    { id: 11, nombre: 'Biobío' },
    { id: 12, nombre: 'La Araucanía' },
    { id: 13, nombre: 'Los Ríos' },
    { id: 14, nombre: 'Los Lagos' },
    { id: 15, nombre: 'Aysén' },
    { id: 16, nombre: 'Magallanes y Antártica Chilena' }

  ]
  
  planes: Plan[] = [
  {
    id: 1,
    codigoPlan: '13-SF1088-33',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 1',
    prestadores: ['Clínica Dávila'],
    hospitalaria: 90,
    urgencia: 70,
    ambulatoria: 70,
    topeAnualUf: 9000,
    puntaje: 7.5,
    precioBase: 3.41,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 2,
    codigoPlan: '13-SA5663-36',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 2',
    prestadores: ['Clínica Dávila'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 3.64,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 3,
    codigoPlan: '13-SB5663-36',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 3',
    prestadores: ['Clínica Dávila'],
    hospitalaria: 85,
    urgencia: 70,
    ambulatoria: 65,
    topeAnualUf: 6000,
    puntaje: 7.5,
    precioBase: 3.79,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 4,
    codigoPlan: '13-SED8060-26',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 4',
    prestadores: ['Clínica Dávila'],
    hospitalaria: 85,
    urgencia: 75,
    ambulatoria: 70,
    topeAnualUf: 5000,
    puntaje: 7.6,
    precioBase: 3.68,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 5,
    codigoPlan: '13-SFT020-26',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 5',
    prestadores: ['Clínica Dávila'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 3.95,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 6,
    codigoPlan: '13-SFT006-20',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 6',
    prestadores: ['Clínica RedSalud Magallanes'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.2,
    precioBase: 4.09,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 7,
    codigoPlan: '13-SFT1088-20',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 7',
    prestadores: ['San José Interclínica'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 3.78,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 8,
    codigoPlan: '13-SPB6628-26',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 8',
    prestadores: ['San José Interclínica'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 4.25, 
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
  {
    id: 9,
    codigoPlan: '13-SBP-3005-25',
    preferente: true,
    nombrePlan: 'Consalud',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 9',
    prestadores: ['San José Interclínica'],
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 4.25,
    imagenContrato: 'assets/contratos/consalud-plan-1.pdf'
  },
];


  // ========================
// DATA PLANES ISAPRE (CARD)
// ========================



  constructor(private http: HttpClient) {}
  
  getUF(): Observable<number> {
    return this.http.get<any>(`${this.API_INDICADORES}/uf`).pipe(
      map(resp => resp.serie[0].valor)
    );
  }

  get(url: string): Observable<any[]> {
    if (url === '/api/regiones') {
      return of(this.regiones);
    }

    if (url === '/api/planes-isapre') {
     return of(this.planes);
    }

    return of([]);
  }


  getPlanes(): Observable<Plan[]> {
    return of(this.planes); // simula llamada HTTP
  }

  getRegiones(): Observable<any[]> {
    return of(this.regiones); // simula llamada HTTP
  }
}
