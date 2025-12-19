import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  trigger,  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        )
      ])
    ])
  ]
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
