import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FacturacionService } from '../../services/facturacion.service';
import { TasabcvService } from '../../services/tasabcv.service';
import { LoadingComponent } from "../../shared/loading/loading.component";
declare var bootstrap: any;

@Component({
  selector: 'app-modal-factura-masiva',
  imports: [CommonModule,
    ReactiveFormsModule, LoadingComponent],
  templateUrl: './modal-factura-masiva.component.html',
  styleUrl: './modal-factura-masiva.component.css'
})
export class ModalFacturaMasivaComponent implements OnInit {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  // Define los meses para el select
meses = [
  { val: 1, nombre: 'Enero' }, { val: 2, nombre: 'Febrero' }, { val: 3, nombre: 'Marzo' },
  { val: 4, nombre: 'Abril' }, { val: 5, nombre: 'Mayo' }, { val: 6, nombre: 'Junio' },
  { val: 7, nombre: 'Julio' }, { val: 8, nombre: 'Agosto' }, { val: 9, nombre: 'Septiembre' },
  { val: 10, nombre: 'Octubre' }, { val: 11, nombre: 'Noviembre' }, { val: 12, nombre: 'Diciembre' }
];

formMasivo: FormGroup;
isLoading:boolean = false;
tasaBCV!:number;
constructor(
  private fb: FormBuilder, 
  private facturaService: FacturacionService,
  private tasaService: TasabcvService,
) {
  this.formMasivo = this.fb.group({
    mes: [new Date().getMonth() + 1, Validators.required],
    anio: [new Date().getFullYear(), Validators.required],
    tasaBCV: [0, [Validators.required, Validators.min(0.1)]],
    porcentajeIva: [0, [Validators.required, Validators.min(0)]] // Puedes ajustar el mínimo según tus necesidades
  });
}

ngOnInit() {
  this.isLoading =true
  this.tasaService.getUltimaTasa().subscribe((rate:any) => {
    this.tasaBCV = rate.precio_dia; // Carga automática para ahorrar tiempo
    this.isLoading =false
    this.formMasivo.patchValue({ tasaBCV: this.tasaBCV });
  });
}



ejecutarFacturacionMasiva() {
  if (!this.formMasivo.valid) {
        //mostramos las alertas de los campos requeridos
        this.formMasivo.markAllAsTouched(); // Esto activa las validaciones visuales
        return
      }
  Swal.fire({
    title: '¿Confirmar Facturación Masiva?',
    text: `Se procesará el mes ${this.formMasivo.value.mes}/${this.formMasivo.value.anio} a tasa BCV: ${this.formMasivo.value.tasaBCV}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    confirmButtonText: 'Sí, generar todas'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading =true
      this.facturaService.facturacionMasiva(this.formMasivo.value).subscribe((resp: any) => {
        this.isLoading =false;
        Swal.fire('¡Éxito!', resp.msg, 'success');
        // Cerrar modal programáticamente si es necesario
      });
    }
  });
}

onClose() {
    this.formMasivo.reset();
    this.closeModal.emit();
  }

}
