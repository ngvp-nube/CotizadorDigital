import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private readonly KEY = 'regiones_chile';

  // 👉 Arreglo estático
  private readonly REGIONES = [
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
  ];

  constructor() {
    // Inicializa localStorage una sola vez
    if (!localStorage.getItem(this.KEY)) {
      localStorage.setItem(this.KEY, JSON.stringify(this.REGIONES));
    }
  }

  // 👉 "URL fake" para la maqueta
  get(url: string): Observable<any> {

    if (url === '/api/regiones') {
      return of(JSON.parse(localStorage.getItem(this.KEY) || '[]'));
    }

    return of(null);
  }
}
