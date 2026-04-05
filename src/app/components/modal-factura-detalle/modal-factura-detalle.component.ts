import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { DetalleFactura, Facturacion } from '../../models/facturacion';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';

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
  usuario!:User;
  usuarioID!:string;

  constructor(
      private userService: UserService,
      private router: Router,
  
    ) {
    }

  ngOnInit() {
    this.facturaSeleccionado;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['facturaSeleccionado'] && this.facturaSeleccionado) {
      const data = this.facturaSeleccionado;
      this.usuarioID = this.facturaSeleccionado.usuario;
      this.userService.getUserById(this.usuarioID).subscribe((resp:any)=>{
        this.usuario = resp;
      })
    }
  }


  onClose() {
    this.closeModal.emit();
  }



}
