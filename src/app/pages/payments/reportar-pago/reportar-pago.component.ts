import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Payment } from '../../../models/payment';
import { User } from '../../../models/user';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { PaymentMethod } from '../../../models/paymenthmethod.model';
import Swal from 'sweetalert2';
import { TransferenciaService } from '../../../services/transferencia.service';
import { PagoEfectivoService } from '../../../services/pago-efectivo.service';
import { TiposdepagoService } from '../../../services/tiposdepago.service';
import { TasabcvService } from '../../../services/tasabcv.service';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-reportar-pago',
  standalone: true,
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    LoadingComponent
  ],
  templateUrl: './reportar-pago.component.html',
  styleUrls: ['./reportar-pago.component.css']
})
export class ReportarPagoComponent implements OnInit {
@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  public PaymentRegisterForm!: FormGroup;

  title= 'Realizar un Pago';


  cartItems: any[] = [];
  Item: any[] = [];
  total= 0;

  public usuario:any;
  visible :boolean = false;
  isLoading :boolean = false;

  metodo!:string;
  error!: string;
  pagoSeleccionado!: Payment;
  pagoS!: Payment;

  uploadError!: boolean;
  imagePath!: string;
  paymentSeleccionado!:Payment;

  user:User;

  public storage = environment.apiUrl;
  public identity!: User;
  public userId!: any;
  public tasaBCV!: number;

  selectedMethod: string = 'Selecciona un método de pago';
  habilitacionFormTransferencia: boolean = false;
  habilitacionFormEfectivo: boolean = false;

  paymentMethods: PaymentMethod[] = []; //array metodos de pago para transferencia (dolares, bolivares, movil)
  paymentSelected!: PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia
  paymentMethodinfo!: PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia


  formTransferencia = new FormGroup({
    metodo_pago: new FormControl(this.paymentMethodinfo, Validators.required),
    bankName: new FormControl('', Validators.required),
    referencia: new FormControl('', Validators.required),
    paymentday: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    tasaBCV: new FormControl(0, Validators.required),
  });


  formEfectivo = new FormGroup({
    paymentday: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    tasaBCV: new FormControl(0, Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private trasnferenciaService: TransferenciaService,
    private efectivoService: PagoEfectivoService,
    private usuarioService: UserService,
    private paymentMethodService: TiposdepagoService,
    private tasaService: TasabcvService,
  ) {
    this.user = this.usuarioService.usuario;
  }


  ngOnInit(): void {
    window.scrollTo(0,0);
    let USER = localStorage.getItem('user');
    if (USER) {
      this.identity = JSON.parse(USER);
    }
    this.userId = this.identity.uid;
    this.visible= false;
    this.getTiposdePago();
    this.getTasadeldia();
    this.total = this.getTotal();
  }

  getTasadeldia(){
    this.tasaService.getUltimaTasa().subscribe((rate:any) => {
    this.tasaBCV = rate.precio_dia; // Carga automática para ahorrar tiempo
    this.isLoading =false
    this.formTransferencia.patchValue({ tasaBCV: this.tasaBCV });
    this.formEfectivo.patchValue({ tasaBCV: this.tasaBCV });
  });
  }

getTiposdePago(){
  this.paymentMethodService.getPaymentsActives().subscribe((res:any)=>{
    this.paymentMethods = res;
    // console.log(this.paymentMethods)
  })
}
  getTotal():number{
    let total =  0;
    this.cartItems.forEach(item => {
      total += item.quantity * item.productPrice;
    });
    return +total.toFixed(2);
  }




  get image() {
    return this.PaymentRegisterForm.get('image');
  }

  avatarUpload(datos:any) {
    const data = JSON.parse(datos.response);
    this.PaymentRegisterForm.controls['image'].setValue(data.image);//almaceno el nombre de la imagen
  }


  // Método que se llama cuando cambia el select
  onPaymentMethodChange(event: any) {
    this.selectedMethod = event.target.value;
    console.log(this.selectedMethod)
    this.renderTipos();
  }

  // metodo para el cambio del select 'tipo de transferencia'
  onChangePayment(event: Event) {
    const target = event.target as HTMLSelectElement; //obtengo el valor
    // console.log(target.value)

    // guardo el metodo seleccionado en la variable de clase paymentSelected
    this.paymentSelected = this.paymentMethods.filter(method => method._id === target.value)[0]
    console.log(this.paymentSelected)
  }

  private renderTipos() {
    if (this.selectedMethod === 'card' || this.selectedMethod === 'paypal') {
      this.habilitacionFormTransferencia = false;
      this.habilitacionFormEfectivo = false;
    }
    else if (this.selectedMethod === 'transferencia') {
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      this.habilitacionFormTransferencia = true;
      this.habilitacionFormEfectivo = false;
    }
    else if (this.selectedMethod === 'efectivo') {
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      this.habilitacionFormEfectivo = true;
      this.habilitacionFormTransferencia = false;
    }
    else {
      this.habilitacionFormTransferencia = false;
      this.habilitacionFormEfectivo = false;
    }
  }



  sendFormTransfer() {

    if (this.formTransferencia.valid) {

      const data = {
        user: this.user.uid,
        // name_person: this.identity.first_name + this.identity.last_name,
        // phone: this.identity.telefono,
        // amount: this.totalAmount,
        ...this.formTransferencia.value
      }


      // llamo al servicio
      this.trasnferenciaService.createTransfer(data).subscribe(resultado => {
        // console.log('resultado: ',resultado);
        // this.verify_dataComplete(Number(this.formTransferencia.value.amount));
        // this.verify_dataComplete(Number(this.totalAmount));
        if (resultado.ok || resultado.status === 200) {
          // transferencia registrada con exito
          // console.log(resultado.payment);
          // alert('Transferencia registrada con exito');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transferencia registrada con exito',
            showConfirmButton: false,
            timer: 1500,
          });
          // this.onItemRemoved();
          // this._router.navigate(['/my-account/ordenes']);
        }
        else {
          // error al registar la transferencia
          // alert('Error al registrar la transferencia');
          // console.log(resultado.msg);
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Error al registrar la transferencia',
            text: resultado.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }

  sendFormEfectivo() {

    if (this.formEfectivo.valid) {

      const data = {
        // localId: this.tiendaSelected._id,
        // user: this.identity.uid,
        // name_person: this.identity.first_name + this.identity.last_name,
        // phone: this.identity.telefono,
        // amount: this.totalAmount,
        ...this.formEfectivo.value
      }

      // llamo al servicio
      this.efectivoService.registro(data).subscribe(resultado => {
        // console.log('resultado: ',resultado);
        // this.verify_dataComplete(Number(this.formEfectivo.value.amount));
        // this.verify_dataComplete(Number(this.totalAmount));
        if (resultado.ok || resultado.status === 200) {
          // transferencia registrada con exito
          // console.log(resultado.payment);
          // alert('Transferencia registrada con exito');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Pago registrada con exito',
            showConfirmButton: false,
            timer: 1500,
          });
          // this.onItemRemoved();
          // this._router.navigate(['/my-account/ordenes']);
        }
        else {
          // error al registar la transferencia
          // alert('Error al registrar la transferencia');
          // console.log(resultado.msg);
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Error al registrar el Pago',
            text: resultado.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }


  onClose() {
    this.selectedMethod = 'Selecciona un método de pago';
    this.habilitacionFormTransferencia = false;
    this.habilitacionFormEfectivo = false;
    this.closeModal.emit();
  }

}
