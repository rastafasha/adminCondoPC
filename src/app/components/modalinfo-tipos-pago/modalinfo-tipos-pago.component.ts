import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-modalinfo-tipos-pago',
  imports: [CommonModule],
  templateUrl: './modalinfo-tipos-pago.component.html',
  styleUrls: ['./modalinfo-tipos-pago.component.css']
})
export class ModalinfoTiposPagoComponent implements AfterViewInit {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Input() displaycomponent: string = 'block';
  @Input() info!:string;
  @Input() sectionId!: string; 
  isLogued: boolean = false;

  ngAfterViewInit() {
    const USER = localStorage.getItem("user");
    this.isLogued = !!USER;

    // USAMOS EL ID DE LA SECCIÓN PARA COMPROBAR
    if (localStorage.getItem(`modalDismissed_${this.sectionId}`)) {
      return;
    }

    setTimeout(() => {
      const modalElement = document.getElementById('infoModal') as HTMLElement;
      if (modalElement) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement) || 
                               new (window as any).bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    }, 500);
  }

  // onNoShowMore() {
  //   localStorage.setItem('modalInfoTiposPagoDismissed', 'true');
  //   $('#infoModal').modal('hide');
  //   $('.modal-backdrop').remove();
  //   $('body, html').removeClass('modal-open').css({'padding-right': '', 'overflow': '', 'overflow-x': 'auto'});
  // }

  // onClose() {
  //   $('#infoModal').modal('hide');
  //   $('.modal-backdrop').remove();
  //   $('body, html').removeClass('modal-open').css({'padding-right': '', 'overflow': '', 'overflow-x': 'auto'});
  //   this.closeModal.emit();
  // }

  onNoShowMore() {
    // GUARDAMOS CON EL ID ESPECÍFICO
    localStorage.setItem(`modalDismissed_${this.sectionId}`, 'true');
    this.closeAndCleanup();
  }

  onClose() {
    this.closeAndCleanup();
    this.closeModal.emit();
  }

  // Función auxiliar para no repetir el código de limpieza de Bootstrap
  private closeAndCleanup() {
    const modalElement = document.getElementById('infoModal') as HTMLElement;
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (bootstrapModal) bootstrapModal.hide();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowX = 'auto';
  }

  // Método público para abrir el modal manualmente (ignorando el bloqueo)
  public open() {
    setTimeout(() => {
      const modalElement = document.getElementById('infoModal') as HTMLElement;
      if (modalElement) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement) || 
                               new (window as any).bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    }, 100);
  }
}

