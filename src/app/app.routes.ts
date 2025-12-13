import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';


export const routes: Routes = [
  { path: '', component: Inicio },

  {
    path: 'comprar',
    children: [
      { 
        path: 'seguro-salud', 
        loadComponent: () => import('./pages/comprar/seguro-salud/seguro-salud').then(m => m.SeguroSalud) 
      },
      { 
        path: 'seguro-empresa', 
        loadComponent: () => import('./pages/comprar/seguro-empresa/seguro-empresa').then(m => m.SeguroEmpresa) 
      },
      { 
        path: 'planes-mascotas', 
        loadComponent: () => import('./pages/comprar/planes-mascotas/planes-mascotas').then(m => m.PlanesMascotas) 
      },
      { 
        path: 'planes-isapre', 
        loadComponent: () => import('./pages/comprar/planes-isapre/planes-isapre').then(m => m.PlanesIsapre) 
      }
    ]
  }
];