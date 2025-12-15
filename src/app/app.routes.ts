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
        path: 'seguros-vida', 
        loadComponent: () => import('./pages/comprar/seguros-vida/seguros-vida').then(m => m.SegurosVida) 
      },
      { 
        path: 'planes-isapre', 
        loadComponent: () => import('./pages/comprar/planes-isapre/planes-isapre').then(m => m.PlanesIsapre) 
      }
    ]
  }
];