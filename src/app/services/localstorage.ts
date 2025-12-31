import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

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
  planes = [  {
    id: 1,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 1',
    hospitalaria: 90,
    urgencia: 70,
    ambulatoria: 70,
    topeAnualUf: 9000,
    puntaje: 7.5,
    precioBase: 35000,
  }
  ,
  {
    id: 2,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 2',
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 60000
  }
    ,
  {
    id: 3,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 3',
    hospitalaria: 85,
    urgencia: 70,
    ambulatoria: 65,
    topeAnualUf: 6000,
    puntaje: 7.5,
    precioBase: 25000
  }
    ,
  {
    id: 4,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 4',
    hospitalaria: 85,
    urgencia: 75,
    ambulatoria: 70,
    topeAnualUf: 5000,
    puntaje: 7.6,
    precioBase: 36000
  }
    ,
  {
    id: 5,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 5',
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 32000
  }
    ,
  {
    id: 6,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 6',
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.2,
    precioBase: 45000
  }
    ,
  {
    id: 7,
    preferente: true,
    nombrePlan: 'Colmena',
    logo: 'assets/img/isapres/banmedica.png',
    plan: 'Plan Salud Total 7',
    hospitalaria: 80,
    urgencia: 80,
    ambulatoria: 60,
    topeAnualUf: 8000,
    puntaje: 7.5,
    precioBase: 30000
  }
];

  // ========================
// DATA PLANES ISAPRE (CARD)
// ========================



  constructor() {}
  

  get(url: string): Observable<any[]> {
    if (url === '/api/regiones') {
      return of(this.regiones);
    }

    if (url === '/api/planes-isapre') {
     return of(this.planes);
    }

    return of([]);
  }


  getPlanes(): Observable<any[]> {
    return of(this.planes); // simula llamada HTTP
  }

  getRegiones(): Observable<any[]> {
    return of(this.regiones); // simula llamada HTTP
  }
}
