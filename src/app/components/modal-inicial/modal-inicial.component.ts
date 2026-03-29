import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-modal-inicial',
  imports: [CommonModule],
  templateUrl: './modal-inicial.component.html',
  styleUrls: ['./modal-inicial.component.css']
})
export class ModalInicialComponent implements AfterViewInit {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  isLogued: boolean = false;

   currentStep = 1;

  ngAfterViewInit() {
    const USER = localStorage.getItem("user");
    this.isLogued = !!USER;
    if (localStorage.getItem('modalInicialDismissed')) {
      return;
    }
    setTimeout(() => {
      const modalElement = $('#exampleModal');
      if (modalElement.length) {
        modalElement.modal('show');
      }
    }, 500);
  }

  onNoShowMore() {
    localStorage.setItem('modalInicialDismissed', 'true');
    $('#exampleModal').modal('hide');
  }

  nextStep() {
    this.currentStep = 2;

  }

  prevStep() {
    this.currentStep = 1;
  }

   onClose() {
    this.closeModal.emit();
  }
 
}
