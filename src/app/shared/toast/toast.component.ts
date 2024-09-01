import { Component, Input, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from './toast.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnDestroy {
  public toastData: { title: string, message: string } | undefined;
  private toastSubscription: Subscription;

  constructor(private toastService: ToastService) {
    this.toastSubscription = this.toastService.toastData$.subscribe(data => {
      this.toastData = data;
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }
}
