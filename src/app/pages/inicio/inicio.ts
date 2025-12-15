import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  constructor(private router: Router) {}
  PlanesIsapresIr(){
     this.router.navigate(['/comprar/planes-isapre']);
  }

  PlanesvidaIr(){
     this.router.navigate(['/comprar/seguros-vida']);
  }

  PlanesPymeIr(){
     this.router.navigate(['/comprar/seguro-empresa']);
  }
}
