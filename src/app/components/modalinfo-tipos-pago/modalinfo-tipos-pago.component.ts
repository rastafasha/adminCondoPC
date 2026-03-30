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
  @Input() displaycomponent: string = 'block';
  @Input() info!:string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  isLogued: boolean = false;

  currentStep = 1;

  ngAfterViewInit() {
    const USER = localStorage.getItem("user");
    this.isLogued = !!USER;
    if (localStorage.getItem('modalInfoTiposPagoDismissed')) {
      return;
    }
    setTimeout(() => {
      const modalElement = $('#infoModal');
      if (modalElement.length) {
        modalElement.modal('show');
      }
    }, 500);
  }

  onNoShowMore() {
    localStorage.setItem('modalInfoTiposPagoDismissed', 'true');
    $('#infoModal').modal('hide');
    $('.modal-backdrop').remove();
    $('body, html').removeClass('modal-open').css({'padding-right': '', 'overflow': '', 'overflow-x': 'auto'});
  }

  onClose() {
    $('#infoModal').modal('hide');
    $('.modal-backdrop').remove();
    $('body, html').removeClass('modal-open').css({'padding-right': '', 'overflow': '', 'overflow-x': 'auto'});
    this.closeModal.emit();
  }
}

