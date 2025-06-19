import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private toastContainer: HTMLElement | null = null;

  constructor() {
    this.ensureToastContainer();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    this.ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    toast.textContent = message;
    this.toastContainer!.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  private ensureToastContainer() {
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.className = 'custom-toast-container';
      document.body.appendChild(this.toastContainer);
    }
  }
}
