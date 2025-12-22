import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private startTime = 0;
  private minDuration = 700; // 👈 ms visibles mínimos (ajustable)

  show(): void {
    this.startTime = Date.now();
    this.loadingSubject.next(true);
  }

  hide(): void {
    const elapsed = Date.now() - this.startTime;
    const remaining = this.minDuration - elapsed;

    if (remaining > 0) {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, remaining);
    } else {
      this.loadingSubject.next(false);
    }
  }
}
