import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { DetalleFactura, Facturacion } from '../../models/facturacion';

@Component({
  selector: 'app-modal-factura-detalle',
  imports: [CommonModule,
    LoadingComponent,
    ReactiveFormsModule],
  templateUrl: './modal-factura-detalle.component.html',
  styleUrl: './modal-factura-detalle.component.css'
})
export class ModalFacturaDetalleComponent implements OnChanges {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Input() facturaSeleccionado: any | null = null;
  isLoading: boolean = false;
  title: string = 'Detalle Factura';

  ngOnInit() {
    this.facturaSeleccionado;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['facturaSeleccionado'] && this.facturaSeleccionado) {
      const data = this.facturaSeleccionado;
      console.log(this.facturaSeleccionado);

    }
  }


  onClose() {
    this.closeModal.emit();
  }
}
