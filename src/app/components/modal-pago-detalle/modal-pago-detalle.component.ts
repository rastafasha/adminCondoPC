import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Facturacion, DetalleFactura } from '../../models/facturacion';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-modal-pago-detalle',
  imports: [CommonModule,
    LoadingComponent,
    ReactiveFormsModule],
  templateUrl: './modal-pago-detalle.component.html',
  styleUrl: './modal-pago-detalle.component.css'
})
export class ModalPagoDetalleComponent {
   @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Input() pagoSeleccionado: any | null = null;
  isLoading: boolean = false;
  title: string = 'Detalle Pago';

  ngOnInit() {
    this.pagoSeleccionado;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pagoSeleccionado'] && this.pagoSeleccionado) {
      const data = this.pagoSeleccionado;
      console.log(this.pagoSeleccionado);

    }
  }


  onClose() {
    this.closeModal.emit();
  }
}
