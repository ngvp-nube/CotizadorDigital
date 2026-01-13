import { Component, HostListener } from '@angular/core';
import {RouterOutlet, RouterLink,Router, NavigationStart, NavigationEnd} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LoaderComponent } from './loader/loader';
import { LoaderService } from './services/loader';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LoaderComponent, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Cotizador';

  loading$!: Observable<boolean>;

  menuOpen = false;
  activeDropdown: string | null = null;
  isMobile = false;

  constructor(private router: Router, private loader: LoaderService) {
    this.updateViewport();
    this.loading$ = this.loader.loading$;

    // cerrar menú al navegar
    // this.router.events
    //  .pipe(filter(e => e instanceof NavigationEnd))
    // .subscribe(() => this.resetMenu());
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loader.show();
      }

      if (event instanceof NavigationEnd) {
        this.loader.hide();
        this.resetMenu();
      }
    });


  }
   

  /* -------------------------
     VIEWPORT
  ------------------------- */

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  private updateViewport(): void {
    this.isMobile = window.innerWidth <= 1024;

    // al volver a desktop limpiamos estado mobile
    if (!this.isMobile) {
      this.activeDropdown = null;
      this.menuOpen = false;
    }
  }

  /* -------------------------
     MENÚ HAMBURGUESA
  ------------------------- */

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    if (!this.menuOpen) {
      this.activeDropdown = null;
    }
  }

  closeMenu(): void {
    this.resetMenu();
  }

  /* -------------------------
     DROPDOWNS (FORMA PRO)
  ------------------------- */

  onDropdownTrigger(event: MouseEvent, key: string): void {
    if (!this.isMobile) return; // desktop: hover manda

    // mobile: evitar navegación
    event.preventDefault();
    event.stopPropagation();

    this.activeDropdown =
      this.activeDropdown === key ? null : key;
  }

  /* -------------------------
     UTIL
  ------------------------- */

  private resetMenu(): void {
    this.menuOpen = false;
    this.activeDropdown = null;
  }
}
