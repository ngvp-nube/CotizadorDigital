import { Component, HostListener } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Cotizador';

  menuOpen = false;
  activeDropdown: string | null = null;
  isMobile = false;

  constructor(private router: Router) {
    this.updateViewport();

    // cerrar menú al navegar
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.resetMenu());
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
