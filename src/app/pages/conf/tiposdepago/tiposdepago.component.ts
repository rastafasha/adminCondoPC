import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { PaymentMethod } from '../../../models/paymenthmethod.model';
import { TiposdepagoService } from '../../../services/tiposdepago.service';
import { UserService } from '../../../services/user.service';
import { ModalinfoTiposPagoComponent } from '../../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiposdepago',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    ModalinfoTiposPagoComponent, BackButtnComponent, LoadingComponent
  ],
  templateUrl: './tiposdepago.component.html',
  styleUrls: ['./tiposdepago.component.css']
})
export class TiposdepagoComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  public url;
  public identity;
  public msm_error = false;
  public msm_success = false;
  title: string = 'Gestión Tipos de Pago';
  isLoading:boolean = false;

  public slider: any = {};
  clientIdPaypal: string = '';
  clientSecret: string = '';
  mode: string = '';

  tipoSeleccionado: any;
  pagoSeleccionado: any;

  public tiposdepagos: PaymentMethod[] = [];

  bankAccountType: string = '';
  bankName: string = '';
  bankAccount: string = '';
  ciorif: string = '';
  phone: string = '';
  email: string = '';
  tipo: string = '';
  user: any;
  user_id: string = '';
  username: string = '';

  // Edit mode properties
  isEditMode: boolean = false;
  editingPayment: PaymentMethod | null = null;

  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Crear Tipos de Pago que use tu negocio</li>
            <li>Usa los datos bancarios para que transfieran a tu cuenta en dólares o euros</li>
            <li>Si esta disponible el sistema de pago móvil, agrega los datos </li>
            <li>Para agregar los datos de paypal, es necesario nuestra asistencia técnica</li>
            <li>La cuenta de paypal actual esta en modo prueba, y es de nuestra empresa</li>
          </ul>`;


  constructor(
    private fb: FormBuilder,
    private paymentMethodService: TiposdepagoService,
    private userService: UserService,
  ) {
    this.url = environment.apiUrl;
    this.identity = this.userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');
    this.getTiposdePago();
  }

  

  selectedTypeEdit(tipo: any) {
    this.pagoSeleccionado = tipo;
  }

  selectedType(tipodepago: PaymentMethod) {
    this.tipoSeleccionado = tipodepago;
  }

  editPayment(tipodepago: PaymentMethod) {
    this.editingPayment = { ...tipodepago };
    this.isEditMode = true;
    this.tipoSeleccionado = null;

    // Set main fields
    this.tipo = this.editingPayment!.tipo;
    this.pagoSeleccionado = this.tipo;
    this.bankAccountType = this.editingPayment!.bankAccountType || '';
    this.bankName = this.editingPayment!.bankName || '';
    this.bankAccount = this.editingPayment!.bankAccount?.toString() || '';
    this.ciorif = this.editingPayment!.ciorif || '';
    this.phone = this.editingPayment!.telefono || '';
    this.username = this.editingPayment!.username || '';
    this.email = this.editingPayment!.email || '';

    
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingPayment = null;
    this.resetFormFields();
  }

  private resetFormFields() {
    this.tipo = '';
    this.pagoSeleccionado = null;
    this.bankAccountType = '';
    this.bankName = '';
    this.bankAccount = '';
    this.ciorif = '';
    this.phone = '';
    this.username = '';
    this.email = '';
    // Paypal fields untouched (prefilled globally)
  }

  getTiposdePago() {
    this.isLoading = true
    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.tiposdepagos = paymentMethods;
      this.isLoading = false
    });
  }


  cambiarStatus(tipodepago: PaymentMethod) {
    this.isLoading = true
    this.paymentMethodService.updateStatus(tipodepago).subscribe(resp => {
      this.isLoading = false
      this.reloadList();
    });
  }

  save() {
    if (this.isEditMode && this.editingPayment) {
      // Update PaymentMethod
      this.editingPayment!.tipo = this.tipo;
      this.editingPayment!.bankAccountType = this.bankAccountType;
      this.editingPayment!.bankName = this.bankName;
      this.editingPayment!.bankAccount = parseFloat(this.bankAccount || '0') || 0;
      this.editingPayment!.ciorif = this.ciorif;
      this.editingPayment!.telefono = this.phone;
      this.editingPayment!.username = this.username;
      this.editingPayment!.email = this.email;

      this.paymentMethodService.actualizarPaymentMethod(this.editingPayment!).subscribe((resp: any) => {
        
        Swal.fire('Éxito', 'Tipo de pago actualizado correctamente', 'success');
        this.cancelEdit();
        this.reloadList();
      }, error => {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      });
    } else {
      // Create
      let data = {
        tipo: this.tipo,
        bankAccountType: this.bankAccountType,
        bankName: this.bankName,
        bankAccount: parseFloat(this.bankAccount || '0') || 0,
        ciorif: this.ciorif,
        phone: this.phone,
        username: this.username,
        email: this.email,
        user: this.user.uid,
        local: this.user.local
      };
      this.paymentMethodService.crearPaymentMethod(data).subscribe((resp: any) => {
        
        this.resetFormFields();
        this.reloadList();
      });
    }
  }

  private reloadList() {
    this.getTiposdePago();
  }

  deleteTipoPago(tiposdepago: PaymentMethod) {

    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No podras recuperarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentMethodService.borrarPaymentMethod(tiposdepago._id!).subscribe((resp: any) => {
          this.getTiposdePago();
          
        });
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });
  }
}

