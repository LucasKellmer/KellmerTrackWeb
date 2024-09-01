import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ title: string, message: string }>();
  public toastData$ = this.toastSubject.asObservable();

  constructor() {}

  showToast(title: string, message: string): void {
    this.toastSubject.next({ title, message });
  }
}
