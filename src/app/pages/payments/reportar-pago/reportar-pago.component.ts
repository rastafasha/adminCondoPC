import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos
import { User } from '../../../models/user';
import { PaymentMethod } from '../../../models/paymenthmethod.model';
import { Facturacion } from '../../../models/facturacion';

// Servicios
import { UserService } from '../../../services/user.service';
import { TiposdepagoService } from '../../../services/tiposdepago.service';
import { TasabcvService } from '../../../services/tasabcv.service';
import { FacturacionService } from '../../../services/facturacion.service';
import { TransferenciaService } from '../../../services/transferencia.service';
import { PagoEfectivoService } from '../../../services/pago-efectivo.service';

import { LoadingComponent } from '../../../shared/loading/loading.component';
import Swal from 'sweetalert2';
import { PaymentService } from '../../../services/payment.service';
import { UserRolePipe } from '../../../pipes/user-role.pipe';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-reportar-pago',
  standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent, UserRolePipe],
  templateUrl: './reportar-pago.component.html',
  styleUrls: ['./reportar-pago.component.css']
})
export class ReportarPagoComponent implements OnInit {
@Output() closeModal = new EventEmitter<boolean>();

  // UI State
  public title = 'Realizar un Pago';
  public isLoading: boolean = false;
  public selectedMethod: string = ''; // 'transferencia' | 'efectivo'
  public habilitacionFormTransferencia: boolean = false;
  public habilitacionFormEfectivo: boolean = false;

  // Data Arrays
  public usuarios: User[] = [];
  public facturasPendientes: Facturacion[] = [];
  public paymentMethods: PaymentMethod[] = []; // Cuentas bancarias de la administración

  // Selections
  public usuarioId: string = '';
  public facturaId: string = '';
  public facturaSeleccionada?: Facturacion;
  public paymentSelected?: PaymentMethod; // Cuenta destino seleccionada
  public bankSelected?: PaymentMethod; // Cuenta destino seleccionada
  public tasaBCV: number = 0;

  // Formularios Reactivos
  public formTransferencia: FormGroup;
  public formEfectivo: FormGroup;

  

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private paymentMethodService: TiposdepagoService,
    private tasaService: TasabcvService,
    private facturacionService: FacturacionService,
    private paymentService: PaymentService,
    private efectivoService: PagoEfectivoService
  ) {
    // Inicialización de formularios más limpia
    this.formTransferencia = this.fb.group({
      metodo_pago: ['', Validators.required], // ID de la cuenta bancaria destino
      bank_destino: ['', Validators.required],    // Banco desde donde envía el vecino
      referencia: ['', Validators.required],
      paymentday: ['', Validators.required],
      amount: ['', Validators.required],
      phone: [''],                            // Opcional si no es Pago Móvil
      tasaBCV: [0, Validators.required],
      
    });

    this.formEfectivo = this.fb.group({
      paymentday: [new Date().toISOString().substring(0, 10), Validators.required],
      amount: ['', Validators.required],
      tasaBCV: [0, Validators.required]
    });
  }


  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.isLoading = true;
    // Ejecutamos cargas paralelas
    Promise.all([
      this.getTasadeldia(),
      this.getTiposdePago(),
      this.getUsuariosaCobrar()
    ]).finally(() => this.isLoading = false);
  }

 getTasadeldia() {
    this.tasaService.getUltimaTasa().subscribe((rate: any) => {
      this.tasaBCV = rate.precio_dia;
      this.formTransferencia.patchValue({ tasaBCV: this.tasaBCV });
      this.formEfectivo.patchValue({ tasaBCV: this.tasaBCV });
    });
  }

getTiposdePago() {
    this.paymentMethodService.getPaymentsActives().subscribe((res: any) => {
      this.paymentMethods = res;
    });
  }

  getUsuariosaCobrar() {
    this.usuarioService.getUsuarios().subscribe((resp: any) => {
      this.usuarios = resp;
    });
  }

// --- LÓGICA DE SELECCIÓN ---

  onUsuarioChange(event: any) {
    this.usuarioId = event.target.value;
    this.facturasPendientes = [];
    this.facturaSeleccionada = undefined;
    this.facturaId = '';

    if (this.usuarioId) {
      this.isLoading = true;
      this.facturacionService.obtenerFacturasPorUsuario(this.usuarioId).subscribe({
        next: (facturas: any) => {
          const data = Array.isArray(facturas) ? facturas : [facturas];
          this.facturasPendientes = data.filter(f => f.estado === 'PENDIENTE');
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
  }

  onFacturaChange(event: any) {
    this.facturaId = event.target.value;
    this.facturaSeleccionada = this.facturasPendientes.find(f => f._id === this.facturaId);

    if (this.facturaSeleccionada?.totalPagar) {
      const monto = this.facturaSeleccionada.totalPagar.toString();
      this.formTransferencia.patchValue({ amount: monto });
      this.formEfectivo.patchValue({ amount: monto });
    }
  }


  // Se dispara desde las tarjetas del HTML
  onPaymentMethodChange(event: any) {
    const value = event.target ? event.target.value : event;
    this.selectedMethod = value;

    this.habilitacionFormTransferencia = (value === 'transferencia');
    this.habilitacionFormEfectivo = (value === 'efectivo');
  }

  onChangePayment(event: any) {
  const tipo = event.target.value;
  this.paymentSelected = this.paymentMethods.find(m => m.tipo === tipo);
}
  onChangeBank(event: any) {
    const id = event.target.value;
    this.bankSelected = this.paymentMethods.find(m => m._id === id);
  }


// --- ENVÍO DE FORMULARIOS ---

  sendFormTransfer() {
    if (this.formTransferencia.invalid) {
        // Opcional: Marcar campos como tocados para mostrar errores de validación
        this.formTransferencia.markAllAsTouched();
        return;
    }

    Swal.fire({ title: 'Procesando pago...', didOpen: () => Swal.showLoading() });

    const metodoLimpio = this.paymentSelected?.tipo ? this.paymentSelected.tipo.toUpperCase() : 'TRANSFERENCIA';

    const payload = {
      ...this.formTransferencia.value, // Esto ya trae bankName, amount, referencia, paymentday Y bank_destino
      cliente: this.usuarioId,
      factura: this.facturaId,
      // Asegúrate de que selectedMethod tenga el valor correcto (ej: 'TRANSFERENCIA')
      metodo_pago: metodoLimpio,
      status: 'PENDIENTE',
      tasaBCV: this.tasaBCV,
      fecha_reporte: new Date().toISOString() // Recomendado para auditoría
    };

    this.paymentService.createPayment(payload).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'La transferencia ha sido reportada.', 'success');
        this.onClose();
      },
      error: () => Swal.fire('Error', 'No se pudo registrar el pago', 'error')
    });
  }

  sendFormEfectivo() {
    if (this.formEfectivo.invalid) return;

    Swal.fire({ title: 'Registrando efectivo...', didOpen: () => Swal.showLoading() });

    const payload = {
      ...this.formEfectivo.value,
      cliente: this.usuarioId,
      factura: this.facturaId,
       metodo_pago: 'EFECTIVO',
      bank_destino: 'CAJA',
      referencia: 'CAJA',
      tasaBCV: this.tasaBCV,
      fecha_reporte: new Date().toISOString(),
      status: 'APROBADO' // El efectivo suele ser inmediato
    };

    this.paymentService.createPayment(payload).subscribe({
      next: () => {
        Swal.fire('Cobrado', 'El pago en efectivo se procesó correctamente', 'success');
        this.onClose(true);
      },
      error: () => Swal.fire('Error', 'Ocurrió un problema en la transacción', 'error')
    });
  }


  onClose(actualizar: boolean = false) {
  this.formTransferencia.reset();
  this.formEfectivo.reset();
  this.selectedMethod = '';
  this.paymentSelected = undefined; 
  // Emitimos 'true' si queremos que el padre refresque la lista
  this.closeModal.emit(actualizar); 
}

}
